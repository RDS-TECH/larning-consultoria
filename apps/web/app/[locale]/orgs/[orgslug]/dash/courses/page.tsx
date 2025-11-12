import { getOrganizationContextInfo } from '@services/organizations/orgs'
import { Metadata } from 'next'
import React from 'react'
import CoursesHome from './client'
import { nextAuthOptions } from '../../../../auth/options'
import { getServerSession } from 'next-auth'
import { getOrgCourses } from '@services/courses/courses'
import { getTranslations } from 'next-intl/server'

type MetadataProps = {
  params: Promise<{ orgslug: string; locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type Session = {
  tokens?: {
    access_token?: string
  }
}

export async function generateMetadata(props: MetadataProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations('courses')

  // Get Org context information
  const org = await getOrganizationContextInfo(params.orgslug, {
    revalidate: 1800,
    tags: ['organizations'],
  })

  const pageTitle = t('pageTitleWithOrg', { orgName: org.name })

  // SEO
  return {
    title: pageTitle,
    description: org.description,
    keywords: `${org.name}, ${org.description}, courses, learning, education, online learning, edu, online courses, ${org.name} courses`,
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title: pageTitle,
      description: org.description,
      type: 'website',
    },
  }
}

async function CoursesPage(params: any) {
  const orgslug = (await params.params).orgslug
  const org = await getOrganizationContextInfo(orgslug, {
    revalidate: 1800,
    tags: ['organizations'],
  })
  const session = await getServerSession(nextAuthOptions as any) as Session
  const access_token = session?.tokens?.access_token
  const courses = await getOrgCourses(
    orgslug,
    { revalidate: 0, tags: ['courses'] },
    access_token ? access_token : null
  )

  return <CoursesHome org_id={org.org_id} orgslug={orgslug} courses={courses} />
}

export default CoursesPage
