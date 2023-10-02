import { Gitlab, Projects, ProjectMembers, ProjectReleases, Tags, Branches } from '@gitbeaker/rest'
import { decode } from 'js-base64'
import { marked } from 'marked'
import * as DOMPurify from 'dompurify'
import { readmeRelToAbsLinks } from "../utils/links"

export class GitlabRepository {
  public gitlabApi: any
  private gitlabApiToken: string

  public url: string
  public namespace: string

  public host: string
  public hostInstance: any

  public instance: any

  public repositoryOwner: string
  public repositoryName: string

  constructor(repositoryUrl: string, debug = false) {
    this.url = repositoryUrl
    const parsedUrl = new URL(this.url)

    const isDebug = debug ? debug : false

    // Allow HTTPS only
    if (!isDebug) {
      if (parsedUrl.protocol !== 'https:') {
        throw new Error('Repository must use HTTPS')
      }
    }

    if (parsedUrl) {
      this.repositoryOwner = parsedUrl.pathname.split('/')[1]
      this.repositoryName = parsedUrl.pathname.split('/')[2]

      this.namespace = parsedUrl.hostname

      this.host = parsedUrl.origin

      if (this.host.includes('git.forum.ircam.fr')) {
        // get token from forum gitlab instane
        this.gitlabApiToken = process.env.GIT_FORUM_API_TOKEN
      } else {
        // else get token from default gitlab host
        this.gitlabApiToken = process.env.GITLAB_API_TOKEN
      }

      this.gitlabApi = new Gitlab({
        host: this.host,
        token: this.gitlabApiToken,
      })
    }
  }

  public async init() {
    // init function with async requests
    if (this.repositoryOwner && this.repositoryName) {
      console.log('GITLAB API: ', this.gitlabApi)

      this.instance = await this.getProjectSearchResult()
    }
  }

  private async getProjectSearchResult () {
    const projectsAPI = new Projects({
      host: this.host,
      token: this.gitlabApiToken,
    })

    let project = null

    if (projectsAPI && this.repositoryName) {
      const projectsSearchResults = await projectsAPI.search(this.repositoryName)
      if (projectsSearchResults && projectsSearchResults.length > 0) {
        project = projectsSearchResults[0]
      }
    }

    return project
  }

  public async getRepositoryApi () {
    return this.gitlabApi
  }

  public async getRepositoryInstance () {
    return this.instance
  }

  public async getUser () {
    if (this.instance) {
      return this.instance.owner
    } else {
      return ''
    }
  }

  public async getUsername () {
    if (this.instance) {
      return this.instance.owner.username
    } else {
      return ''
    }
  }

  public async getDefaultBranch () {
    if (this.instance) {
      return this.instance.default_branch
    } else {
      return ''
    }
  }

  public async getReadme() {
    return ''
  }

  public async getReleases () {
    const releasesAPI = new ProjectReleases({
      host: this.host,
      token: this.gitlabApiToken,
    })

    let releases = null

    if (releasesAPI && this.instance) {
      releases = await releasesAPI.all(this.instance.id)
    }

    return releases
  }

  public async getTags () {
    const tagsAPI = new Tags({
      host: this.host,
      token: this.gitlabApiToken,
    })

    let tags = null

    if (tagsAPI && this.instance) {
      tags = await tagsAPI.all(this.instance.id)
    }

    return tags
  }

  public async getBranches () {
    const branchesAPI = new Branches({
      host: this.host,
      token: this.gitlabApiToken,
    })

    let branches = null

    if (branchesAPI && this.instance) {
      branches = await branchesAPI.all(this.instance.id)
    }

    return branches
  }

  public async getContributors () {
    const membersAPI = new ProjectMembers({
      host: this.host,
      token: this.gitlabApiToken,
    })

    let members = null

    if (membersAPI && this.instance) {
      members = await membersAPI.all(this.instance.id)
    }

    return members
  }
}
