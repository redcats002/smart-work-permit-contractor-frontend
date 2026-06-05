interface IUseResource {
  getRequestUrl (prefix: string): string
  getFullUrl (path: string): string
}
export default function useResource (): IUseResource {
  const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000'
  function getRequestUrl (prefix: string): string {
    let url = ''
    if (!url) url = VITE_APP_API_URL
    return `${url}${prefix}`
  }

  function getFullUrl (path: string): string {
    return window.location.origin + path
  }

  return {
    getRequestUrl,
    getFullUrl
  }
}
