'use client'
import BreadCrumbs from '@components/Dashboard/Misc/BreadCrumbs'
import { getUriWithOrg } from '@services/config/config'
import { ImageIcon, TextIcon, LucideIcon, Share2Icon, LayoutDashboardIcon, CodeIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, use } from 'react';
import { motion } from 'framer-motion'
import OrgEditGeneral from '@components/Dashboard/Pages/Org/OrgEditGeneral/OrgEditGeneral'
import OrgEditImages from '@components/Dashboard/Pages/Org/OrgEditImages/OrgEditImages'
import OrgEditSocials from '@components/Dashboard/Pages/Org/OrgEditSocials/OrgEditSocials'
import OrgEditLanding from '@components/Dashboard/Pages/Org/OrgEditLanding/OrgEditLanding'
import OrgEditOther from '@components/Dashboard/Pages/Org/OrgEditOther/OrgEditOther'
import { useTranslations } from 'next-intl'

export type OrgParams = {
  subpage: string
  orgslug: string
}

interface TabItem {
  id: string
  labelKey: string
  icon: LucideIcon
}

const SETTING_TABS: TabItem[] = [
  { id: 'general', labelKey: 'general', icon: TextIcon },
  { id: 'landing', labelKey: 'landing', icon: LayoutDashboardIcon },
  { id: 'previews', labelKey: 'previews', icon: ImageIcon },
  { id: 'socials', labelKey: 'socials', icon: Share2Icon },
  { id: 'other', labelKey: 'other', icon: CodeIcon },
]

function TabLink({ tab, isActive, orgslug, label }: {
  tab: TabItem,
  isActive: boolean,
  orgslug: string,
  label: string
}) {
  return (
    <Link href={getUriWithOrg(orgslug, '') + `/dash/org/settings/${tab.id}`}>
      <div
        className={`py-2 w-fit text-center border-black transition-all ease-linear ${
          isActive ? 'border-b-4' : 'opacity-50'
        } cursor-pointer`}
      >
        <div className="flex items-center space-x-2.5 mx-2.5">
          <tab.icon size={16} />
          <div>{label}</div>
        </div>
      </div>
    </Link>
  )
}

function OrgPage(props: { params: Promise<OrgParams> }) {
  const params = use(props.params);
  const t = useTranslations('organization.edit.settings')
  const tTabs = useTranslations('organization.edit.settings.tabs')

  const getPageLabels = () => {
    const labels = {
      general: { title: t('titles.general'), subtitle: t('subtitles.general') },
      previews: { title: t('titles.previews'), subtitle: t('subtitles.previews') },
      socials: { title: t('titles.socials'), subtitle: t('subtitles.socials') },
      landing: { title: t('titles.landing'), subtitle: t('subtitles.landing') },
      other: { title: t('titles.other'), subtitle: t('subtitles.other') },
    }
    return labels[params.subpage as keyof typeof labels] || { title: '', subtitle: '' }
  }

  const pageLabels = getPageLabels()

  return (
    <div className="h-full w-full bg-[#f8f8f8] flex flex-col">
      <div className="pl-10 pr-10 tracking-tight bg-[#fcfbfc] nice-shadow flex-shrink-0">
        <BreadCrumbs type="org"></BreadCrumbs>
        <div className="my-2  py-2">
          <div className="w-100 flex flex-col space-y-1">
            <div className="pt-3 flex font-bold text-4xl tracking-tighter">
              {pageLabels.title}
            </div>
            <div className="flex font-medium text-gray-400 text-md">
              {pageLabels.subtitle}{' '}
            </div>
          </div>
        </div>
        <div className="flex space-x-0.5 font-black text-sm">
          {SETTING_TABS.map((tab) => (
            <TabLink
              key={tab.id}
              tab={tab}
              isActive={params.subpage === tab.id}
              orgslug={params.orgslug}
              label={tTabs(tab.labelKey)}
            />
          ))}
        </div>
      </div>
      <div className="h-6 flex-shrink-0"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1, type: 'spring', stiffness: 80 }}
        className="flex-1 overflow-y-auto"
      >
        {params.subpage == 'general' ? <OrgEditGeneral /> : ''}
        {params.subpage == 'previews' ? <OrgEditImages /> : ''}
        {params.subpage == 'socials' ? <OrgEditSocials /> : ''}
        {params.subpage == 'landing' ? <OrgEditLanding /> : ''}
        {params.subpage == 'other' ? <OrgEditOther /> : ''}
      </motion.div>
    </div>
  )
}

export default OrgPage
