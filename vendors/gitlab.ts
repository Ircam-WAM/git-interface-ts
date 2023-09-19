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

  // public async getUser () {
  //   return await instance.owner
  // }

  // public async getUsername () {
  //   return await instance.owner.login
  // }

  // public async getDefaultBranch () {
  //   return await instance.default_branch
  // }

  // public async getReadme() {
  //   let { data: readme } = await githubApi.rest.repos.getReadme({
  //     owner: this.repositoryOwner,
  //     repo: this.repositoryName,
  //     mediaType: {
  //       format: 'html',
  //     },
  //   })

  //   // sanitize readme
  //   const readmeHtml = DOMPurify.sanitize(readme)

  //   if (this.repositoryOwner && this.repositoryOwner) {
  //     // replace relative links by absolute links in HTML
  //     const opts = {
  //       vendor: 'github',
  //       defaultBranch: instance.default_branch
  //     }
  //     const readmeAbsLinks = readmeRelToAbsLinks(readmeHtml, opts,  this.repositoryOwner, this.repositoryName)
  //     return readmeAbsLinks
  //   } else {
  //     return readmeHtml
  //   }
  // }

  // public async getReleases () {
  //   const { data: releases } = await githubApi.rest.repos.listReleases({
  //     owner: this.repositoryOwner,
  //     repo: this.repositoryName
  //   })
  //   return releases
  // }

  // public async getTags() {
  //   const { data: tags } = await githubApi.rest.repos.listTags({
  //     owner: this.repositoryOwner,
  //     repo: this.repositoryName
  //   })
  //   return tags
  // }
}
