
import { GithubRepository } from "./vendors/github"
import { GitlabRepository } from "./vendors/gitlab"

export class Repository {
  public url: string

  public vendor: string
  public vendorClient: any
  public vendorInstance: any

  public isDebug: boolean

  // supported vendors
  public vendors = [
    { name: 'github', client: GithubRepository },
    { name: 'gitlab', client: GitlabRepository }
  ]

  constructor(repositoryUrl: string, repositoryVendor?: string, debug = false) {
    this.url = repositoryUrl
    this.vendor = repositoryVendor ? repositoryVendor : this.getRepositoryVendor(repositoryUrl)
    this.isDebug = debug

    if (this.vendor) {
      for (let i = 0; i < this.vendors.length; i++) {
        if (this.vendor === this.vendors[i].name) {
          this.vendorClient = this.vendors[i].client
          this.vendorInstance = new this.vendorClient(this.url, debug = this.isDebug)
        }
      }

      if (!this.vendorClient) {
        throw new Error('Repository vendor is not supported')
      }
    } else {
      throw new Error('Repository vendor not found')
    }
  }

  public getRepositoryVendor (url: string): string | undefined {
    if (url) {
      if (url.includes('github')) {
        return 'github'
      } else if (url.includes('gitlab')) {
        return 'gitlab'
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

  public async init () {
    if (this.vendorInstance) {
      await this.vendorInstance.init()
    }
  }

  public async getRepositoryApi () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getRepositoryApi()
    }
  }

  public async getRepositoryInstance () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getRepositoryInstance()
    }
  }

  public async getUser () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getUser()
    }
  }

  public async getUsername () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getUsername()
    }
  }

  public async getDefaultBranch () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getDefaultBranch()
    }
  }

  public async getReadme () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getReadme()
    }
  }

  public async getReleases () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getReleases()
    }
  }

  public async getTags () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getTags()
    }
  }

  public async getBranches () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getBranches()
    }
  }

  public async getContributors () {
    if (this.vendorInstance) {
      return await this.vendorInstance.getContributors()
    }
  }
}
