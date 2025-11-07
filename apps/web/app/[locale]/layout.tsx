'use client'
import '../../styles/globals.css'
import StyledComponentsRegistry from '../../components/Utils/libs/styled-registry'
import { motion } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import LHSessionProvider from '@components/Contexts/LHSessionContext'
import { isDevEnv } from './auth/options'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    // Carregar mensagens do locale
    import(`../../messages/${locale}.json`)
      .then((msgs) => setMessages(msgs.default))
      .catch(() => {
        // Fallback para pt-BR se falhar
        import(`../../messages/pt-BR.json`)
          .then((msgs) => setMessages(msgs.default));
      });
  }, [locale]);

  const variants = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  }

  if (!messages) {
    return null; // ou um loading
  }

  return (
    <html className="" lang={locale}>
      <head />
      <body>
        {isDevEnv ? '' : <Script data-website-id="a1af6d7a-9286-4a1f-8385-ddad2a29fcbb" src="/umami/script.js" />}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider key="session-provider" refetchInterval={60000}>
            <LHSessionProvider>
              <StyledComponentsRegistry>
                <motion.main
                  variants={variants}
                  initial="hidden"
                  animate="enter"
                  exit="exit"
                  transition={{ type: 'tween' }}
                >
                  {children}
                </motion.main>
              </StyledComponentsRegistry>
            </LHSessionProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
