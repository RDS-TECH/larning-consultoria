'use client'
import AccountCreation from './account_creation'
import DefaultElements from './default_elements'
import DisableInstallMode from './disable_install_mode'
import Finish from './finish'
import GetStarted from './get_started'
import OrgCreation from './org_creation'
import SampleData from './sample_data'
import { useTranslations } from 'next-intl'

export function useInstallSteps() {
  const t = useTranslations('install')

  return [
    {
      id: 'INSTALL_STATUS',
      name: t('getStarted.stepName'),
      component: <GetStarted />,
      completed: false,
    },
    {
      id: 'ORGANIZATION_CREATION',
      name: t('orgCreation.stepName'),
      component: <OrgCreation />,
      completed: false,
    },
    {
      id: 'DEFAULT_ELEMENTS',
      name: t('defaultElements.stepName'),
      component: <DefaultElements />,
      completed: false,
    },
    {
      id: 'ACCOUNT_CREATION',
      name: t('accountCreation.stepName'),
      component: <AccountCreation />,
      completed: false,
    },
    {
      id: 'SAMPLE_DATA',
      name: t('sampleData.stepName'),
      component: <SampleData />,
      completed: false,
    },
    {
      id: 'FINISH',
      name: t('finish.stepName'),
      component: <Finish />,
      completed: false,
    },
    {
      id: 'DISABLING_INSTALLATION_MODE',
      name: t('disableInstallMode.stepName'),
      component: <DisableInstallMode />,
      completed: false,
    },
  ]
}

// For backward compatibility, export a default constant
// This will use the default language
export const INSTALL_STEPS = [
  {
    id: 'INSTALL_STATUS',
    name: 'Get started',
    component: <GetStarted />,
    completed: false,
  },
  {
    id: 'ORGANIZATION_CREATION',
    name: 'Organization Creation',
    component: <OrgCreation />,
    completed: false,
  },
  {
    id: 'DEFAULT_ELEMENTS',
    name: 'Default Elements',
    component: <DefaultElements />,
    completed: false,
  },
  {
    id: 'ACCOUNT_CREATION',
    name: 'Account Creation',
    component: <AccountCreation />,
    completed: false,
  },
  {
    id: 'SAMPLE_DATA',
    name: 'Sample Data',
    component: <SampleData />,
    completed: false,
  },
  {
    id: 'FINISH',
    name: 'Finish',
    component: <Finish />,
    completed: false,
  },
  {
    id: 'DISABLING_INSTALLATION_MODE',
    name: 'Disabling Installation Mode',
    component: <DisableInstallMode />,
    completed: false,
  },
]
