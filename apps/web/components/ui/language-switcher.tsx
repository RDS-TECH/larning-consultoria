'use client'

import React from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const LOCALES = [
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = LOCALES.find((l) => l.code === locale) || LOCALES[0]

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname if it exists
    const pathnameWithoutLocale = pathname.replace(/^\/(en|pt-BR)/, '') || '/'

    // Build new pathname with new locale
    const newPath = newLocale === 'pt-BR'
      ? pathnameWithoutLocale
      : `/${newLocale}${pathnameWithoutLocale}`

    // Preserve query params
    if (typeof window !== 'undefined') {
      const queryString = window.location.search
      router.push(newPath + queryString)
    } else {
      router.push(newPath)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label="Switch language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocale.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => switchLocale(loc.code)}
            className={`cursor-pointer ${
              loc.code === locale ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{loc.flag}</span>
            <span>{loc.name}</span>
            {loc.code === locale && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
