'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const changeLocale = (newLocale: string) => {
    startTransition(() => {
      // Salva a preferência no cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`

      // Recarrega a página para aplicar o novo idioma
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLocale('pt-BR')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'pt-BR'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        🇧🇷 PT
      </button>
      <button
        onClick={() => changeLocale('en')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        🇺🇸 EN
      </button>
    </div>
  )
}
