// Replace relative links with absolute urls in a README HTML string
interface RepositoryOptions {
  vendor: string
  defaultBranch: string
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
        img.src = 'https://raw.githubusercontent.com/' + repositoryOwner + '/' + repositoryName + '/' + options.defaultBranch + '/' + src
      }
    }
  })
  return tempElement.innerHTML
}
