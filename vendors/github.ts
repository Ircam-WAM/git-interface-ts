import { decode } from 'js-base64'
import { marked } from 'marked'
import * as DOMPurify from 'dompurify'
import { readmeRelToAbsLinks, parseReadmeAnchors } from "../utils/links"

// Octokit does not load on Safari, we must import the module conditionally
export let githubApi
let Octokit

let isChrome = navigator.userAgent.indexOf('Chrome') > -1
let isSafari = navigator.userAgent.indexOf("Safari") > -1
if ((isChrome) && (isSafari)) { isSafari = false }

if (!isSafari) {
  import('@octokit/rest')
  .then((module) => {
     Octokit = module.Octokit

     githubApi = new Octokit({
        // log: {
        //   debug: (message: any, info?: any) => console.log('debug', Message: ${message} ),
        //   info: (message: any, info?: any) => console.log('info', Message: ${message}} ),
        //   warn: (message: any, info?: any) => console.log('info', Message: ${message} ),
        //   error: (message: any, info?: any) => console.log('info', Message: ${message} )
        // }
      })
  })
}

export let instance = null

export class GithubRepository {
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

      this.namespace = parsedUrl.hostname

      this.host = parsedUrl.origin
    }
  }

  public async init() {
    if (!isSafari) {
      // init function with async requests
      if (this.repositoryOwner && this.repositoryName) {
        // const result = await this.hostInstance.request("GET /users")
        const result = await githubApi.rest.repos.get({
          owner: this.repositoryOwner,
          repo: this.repositoryName,
        })
        instance = result.data
      }
    }
  }

  public async getRepositoryApi () {
    if (!isSafari) {
      return githubApi
    }
  }

  public async getRepositoryInstance () {
    if (!isSafari) {
      return instance
    }
  }

  public async getUser () {
    if (!isSafari) {
      return await instance.owner
    }
  }

  public async getUsername () {
    if (!isSafari) {
      return await instance.owner.login
    }
  }

  public async getDefaultBranch () {
    if (!isSafari) {
      return await instance.default_branch
    }
  }

  public async getReadme () {
    if (!isSafari) {
      let { data: readme } = await githubApi.rest.repos.getReadme({
        owner: this.repositoryOwner,
        repo: this.repositoryName,
        mediaType: {
          format: 'html',
        },
      })

      // sanitize readme
      const readmeHtml = DOMPurify.sanitize(readme)

      if (this.repositoryOwner && this.repositoryName) {
        // replace relative links by absolute links in HTML
        const opts = {
          vendor: 'github',
          defaultBranch: instance.default_branch
        }
        const readmeAbsLinks = readmeRelToAbsLinks(readmeHtml, opts,  this.repositoryOwner, this.repositoryName)
        const readmeParsedAnchors = parseReadmeAnchors(readmeAbsLinks)
        return readmeParsedAnchors
      } else {
        return readmeHtml
      }
    }
  }

  public async getReleases () {
    if (!isSafari) {
      const { data: releases } = await githubApi.rest.repos.listReleases({
        owner: this.repositoryOwner,
        repo: this.repositoryName
      })
      return releases
    }
  }

  public async getTags () {
    if (!isSafari) {
      const { data: tags } = await githubApi.rest.repos.listTags({
        owner: this.repositoryOwner,
        repo: this.repositoryName
      })
      return tags
    }
  }

  public async getBranches () {
    if (!isSafari) {
      const { data: tags } = await githubApi.rest.repos.listBranches({
        owner: this.repositoryOwner,
        repo: this.repositoryName
      })
      return tags
    }
  }

  public async getContributors () {
    if (!isSafari) {
      const { data: tags } = await githubApi.rest.repos.listContributors({
        owner: this.repositoryOwner,
        repo: this.repositoryName
      })
      return tags
    }
  }
}

export async function fetchGithubRepositoryReadme (repositoryUrl: string) {
  if (repositoryUrl && repositoryUrl.includes('github')) {
    const repoAuthor = repositoryUrl.split('/')[3]
    const repoName = repositoryUrl.split('/')[4]
    let url = 'https://api.github.com/repos/' + repoAuthor + '/' + repoName + '/readme'

    const response = await fetch(url)
    const body = await response.json()
    const content = DOMPurify.sanitize(marked.parse((decode(body.content))))
    const gitRepositoryReadme = content
    // console.log('README: ', gitRepositoryReadme)

    return gitRepositoryReadme
  }
}
