import { getOrganizationContextInfo } from '@services/organizations/orgs'
import LoginClient from './login'
import { Metadata } from 'next'

type MetadataProps = {
  params: Promise<{ orgslug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(params: MetadataProps): Promise<Metadata> {
  const orgslug = (await params.searchParams).orgslug

  // Get Org context information only if orgslug is provided
  if (!orgslug) {
    return {
      title: 'Login',
    }
  }

  try {
    const org = await getOrganizationContextInfo(orgslug, {
      revalidate: 0,
      tags: ['organizations'],
    })

    return {
      title: 'Login' + ` — ${org.name}`,
    }
  } catch (error) {
    return {
      title: 'Login',
    }
  }
}

const Login = async (params: MetadataProps) => {
  const orgslug = (await params.searchParams).orgslug

  // Try to get org info if orgslug is provided
  let org = null
  if (orgslug) {
    try {
      org = await getOrganizationContextInfo(orgslug, {
        revalidate: 0,
        tags: ['organizations'],
      })
    } catch (error) {
      // If org not found, org will be null and LoginClient will handle it
      console.error('Failed to fetch organization info:', error)
    }
  }

  return (
    <div>
      <LoginClient org={org}></LoginClient>
    </div>
  )
}

export default Login
