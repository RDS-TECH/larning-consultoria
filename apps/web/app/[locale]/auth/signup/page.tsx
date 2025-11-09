import { Metadata } from 'next'
import { getOrganizationContextInfo } from '@services/organizations/orgs'
import SignUpClient from './signup'
import { Suspense } from 'react'
import PageLoading from '@components/Objects/Loaders/PageLoading'

type MetadataProps = {
  params: Promise<{ orgslug: string; courseid: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  params: MetadataProps
): Promise<Metadata> {
  const orgslug = (await params.searchParams).orgslug

  // Get Org context information only if orgslug is provided
  if (!orgslug) {
    return {
      title: 'Sign up',
    }
  }

  try {
    const org = await getOrganizationContextInfo(orgslug, {
      revalidate: 0,
      tags: ['organizations'],
    })

    return {
      title: 'Sign up' + ` — ${org.name}`,
    }
  } catch (error) {
    return {
      title: 'Sign up',
    }
  }
}

const SignUp = async (params: any) => {
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
      // If org not found, org will be null and SignUpClient will handle it
      console.error('Failed to fetch organization info:', error)
    }
  }

  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <SignUpClient org={org} />
      </Suspense>
    </>
  )
}
export default SignUp
