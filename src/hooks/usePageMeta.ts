import { useEffect } from 'react'

interface PageMetaOptions {
  title?: string
  description?: string
  image?: string
}

const DEFAULT_TITLE = 'Wishlist'
const DEFAULT_IMAGE = '/favicon.png'

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
    || document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement

  if (!el) {
    el = document.createElement('meta')
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      el.setAttribute('property', property)
    } else {
      el.setAttribute('name', property)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageMeta({ title, description, image }: PageMetaOptions) {
  useEffect(() => {
    const resolvedTitle = title ? `${title} • Wishlist` : DEFAULT_TITLE
    const resolvedImage = image || DEFAULT_IMAGE
    const resolvedDescription = description || 'View this wishlist'

    // Set document title
    document.title = resolvedTitle

    // Open Graph
    setMeta('og:title', resolvedTitle)
    setMeta('og:description', resolvedDescription)
    setMeta('og:image', resolvedImage)
    setMeta('og:type', 'website')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', resolvedTitle)
    setMeta('twitter:description', resolvedDescription)
    setMeta('twitter:image', resolvedImage)

    // Standard description
    setMeta('description', resolvedDescription)

    // Cleanup: reset to defaults when component unmounts
    return () => {
      document.title = DEFAULT_TITLE
      setMeta('og:title', DEFAULT_TITLE)
      setMeta('og:description', 'View this wishlist')
      setMeta('og:image', DEFAULT_IMAGE)
      setMeta('twitter:title', DEFAULT_TITLE)
      setMeta('twitter:description', 'View this wishlist')
      setMeta('twitter:image', DEFAULT_IMAGE)
      setMeta('description', 'View this wishlist')
    }
  }, [title, description, image])
}