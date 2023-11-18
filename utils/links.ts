// Replace relative links with absolute urls in a README HTML string
interface RepositoryOptions {
  vendor: string
  defaultBranch: string
  host?: string
}

export function readmeRelToAbsLinks (html: string, options: RepositoryOptions, repositoryOwner: string, repositoryName: string, defaultBranch = 'main'): string {
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html

  // replace relative links by absolute links in HTML
  const imgElements: NodeListOf<HTMLImageElement> = tempElement.querySelectorAll('img[src]')

  // Convert relative links to absolute links
  imgElements.forEach(img => {
    const src = img.getAttribute('src')
    if (src && !src.startsWith('http') && !src.startsWith('//')) {
      if (options.vendor === 'github') {
        img.setAttribute('src', 'https://raw.githubusercontent.com/' + repositoryOwner + '/' + repositoryName + '/' + options.defaultBranch + '/' + src)
      }
      if (options.vendor === 'gitlab') {
        img.setAttribute('src', options.host + '/' + repositoryOwner + '/' + repositoryName + '/-/raw/' + options.defaultBranch + '/' + src)
      }
    }
  })
  return tempElement.innerHTML
}

export function parseReadmeAnchors (readme: string) {
  // convert readme string to html
  const parser = new DOMParser();
  const html = parser.parseFromString(readme, 'text/html');
  const body = html.body
  const allLinksElements = body.getElementsByTagName('a')

  for (let i = 0; i < allLinksElements.length; i++) {
      if (allLinksElements[i].className.includes('anchor')) {
        // set anchor link
        allLinksElements[i].href = 'javascript:void(0)'
      }
  }

  // serialize readme html back to string
  const readmeEl = body.querySelector('#readme')
  const s = new XMLSerializer()
  const str = s.serializeToString(readmeEl)
  return str
}
