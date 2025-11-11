export const LEARNHOUSE_HTTP_PROTOCOL =
  process.env.NEXT_PUBLIC_LEARNHOUSE_HTTPS?.toLowerCase() === 'true' ? 'https://' : 'http://'
const LEARNHOUSE_API_URL = process.env.NEXT_PUBLIC_LEARNHOUSE_API_URL
export const LEARNHOUSE_BACKEND_URL = process.env.NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL
export const LEARNHOUSE_DOMAIN = process.env.NEXT_PUBLIC_LEARNHOUSE_DOMAIN
export const LEARNHOUSE_TOP_DOMAIN =
  process.env.NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN

export const getAPIUrl = () => {
  if (!LEARNHOUSE_API_URL) {
    console.error('NEXT_PUBLIC_LEARNHOUSE_API_URL is not defined. Please check your environment variables and redeploy.')
    return ''
  }
  // Garantir que a URL termine com /
  return LEARNHOUSE_API_URL.endsWith('/') ? LEARNHOUSE_API_URL : `${LEARNHOUSE_API_URL}/`
}

export const getBackendUrl = () => {
  if (!LEARNHOUSE_BACKEND_URL) {
    console.error('NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL is not defined. Please check your environment variables and redeploy.')
    return ''
  }
  return LEARNHOUSE_BACKEND_URL
}

// Multi Organization Mode
export const isMultiOrgModeEnabled = () =>
  process.env.NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG?.toLowerCase() === 'true' ? true : false

export const getUriWithOrg = (orgslug: string, path: string) => {
  // Em desenvolvimento local (localhost), sempre incluir o orgslug na rota
  if (LEARNHOUSE_DOMAIN === 'localhost') {
    // Estrutura: /orgs/{orgslug}{path}
    return `/orgs/${orgslug}${path}`
  }

  const multi_org = isMultiOrgModeEnabled()
  if (multi_org) {
    return `${LEARNHOUSE_HTTP_PROTOCOL}${orgslug}.${LEARNHOUSE_DOMAIN}${path}`
  }
  return `${LEARNHOUSE_HTTP_PROTOCOL}${LEARNHOUSE_DOMAIN}${path}`
}

export const getUriWithoutOrg = (path: string) => {
  // Em desenvolvimento local (localhost), usar URL relativa para preservar a porta
  if (LEARNHOUSE_DOMAIN === 'localhost') {
    return path
  }

  const multi_org = isMultiOrgModeEnabled()
  if (multi_org) {
    return `${LEARNHOUSE_HTTP_PROTOCOL}${LEARNHOUSE_DOMAIN}${path}`
  }
  return `${LEARNHOUSE_HTTP_PROTOCOL}${LEARNHOUSE_DOMAIN}${path}`
}

export const getOrgFromUri = () => {
  const multi_org = isMultiOrgModeEnabled()
  if (multi_org) {
    getDefaultOrg()
  } else {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname

      return hostname.replace(`.${LEARNHOUSE_DOMAIN}`, '')
    }
  }
}

export const getDefaultOrg = () => {
  return process.env.NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG
}




