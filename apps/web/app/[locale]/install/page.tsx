import React from 'react'
import InstallClient from './install'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('install')

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}

function InstallPage() {
  return (
    <div className="bg-white h-screen">
      <InstallClient />
    </div>
  )
}

export default InstallPage
