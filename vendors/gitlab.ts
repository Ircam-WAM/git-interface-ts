import { Gitlab } from '@gitbeaker/rest'
import { decode } from 'js-base64'
import { marked } from 'marked'
import * as DOMPurify from 'dompurify'
import { readmeRelToAbsLinks } from "../utils/links"

// export const gitlabApi = new Gitlab({
//   host: 'https://git.forum.ircam.fr/',
//   token: process.env.GITLAB_API_TOKEN,
// })

export let instance = null

export class GitlabRepository {
  public url: string
  public namespace: string

  public host: string
  public hostInstance: any

  public gitlabApi: any
  private gitlabApiToken: string

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
      // const result = await githubApi.rest.repos.get({
      //   owner: this.repositoryOwner,
      //   repo: this.repositoryName,
      // })
      // instance = result.data

      console.log(':::::::::::')
      console.log(this.gitlabApi)
      console.log(':::::::::::')

      this.gitlabApi.Projects.all().then((projects) => {
        console.log(projects);
      })

      // let users = await gitlabApi.Users.all()
      // console.log(users)
    }
  }

  public async getRepositoryApi() {
    return this.gitlabApi
  }

  public async getRepositoryInstance() {
    return instance
  }

  public async getUser () {
    return ''
  }

  public async getUsername () {
    return ''
  }

  public async getDefaultBranch () {
    return ''
  }

  public async getReadme() {
    return ''
  }

  public async getReleases () {
    return ''
  }

  public async getTags() {
    return ''
  }

  public async getBranches() {
    return ''
  }

  public async getContributors() {
    return ''
  }
}
