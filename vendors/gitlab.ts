import { Gitlab } from '@gitbeaker/rest'
import { decode } from 'js-base64'
import { marked } from 'marked'
import * as DOMPurify from 'dompurify'
import { readmeRelToAbsLinks } from "../utils/links"

export const gitlabApi = new Gitlab({
  token: 'glpat-Jw2pzcExU8QTRrFzj85B',
})

export let instance = null

export class GitlabRepository {
  public url: string
  public namespace: string

  public host: string
  public hostInstance: any

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
    }

    this.namespace = parsedUrl.hostname

    this.host = parsedUrl.origin
  }

  public async init() {
    // init function with async requests
    if (this.repositoryOwner && this.repositoryName) {
      // const result = await githubApi.rest.repos.get({
      //   owner: this.repositoryOwner,
      //   repo: this.repositoryName,
      // })
      // instance = result.data

      gitlabApi.Projects.all().then((projects) => {
        console.log(projects);
      })

      // let users = await gitlabApi.Users.all()
      // console.log(users)
    }
  }

  public async getRepositoryApi() {
    return gitlabApi
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
