import React from 'react'
import { Metadata } from 'next'
import { getOrganizationContextInfo } from '@services/organizations/orgs'
import Trail from './trail'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../../../auth/options'
import { getTranslations } from 'next-intl/server'

type MetadataProps = {
  params: Promise<{ orgslug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type Session = {
  tokens?: {
    access_token?: string
  }
}

export async function generateMetadata(props: MetadataProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations('trail')
  const session = await getServerSession(nextAuthOptions as any) as Session
  const access_token = session?.tokens?.access_token
  // Get Org context information
  const org = await getOrganizationContextInfo(params.orgslug, {
    revalidate: 1800,
    tags: ['organizations'],
  }, access_token)
  return {
    title: `${t('pageTitle')} — ${org.name}`,
    description: t('pageDescription'),
  }
}

const TrailPage = async (params: any) => {
  let orgslug = (await params.params).orgslug

  return (
    <div>
      <Trail orgslug={orgslug} />
    </div>
  )
}

export default TrailPage
