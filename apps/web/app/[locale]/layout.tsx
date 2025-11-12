import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import LocaleLayoutClient from './layout-client';
import LangUpdater from './lang-updater';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Unwrap params usando await
  const { locale } = await params;

  // Carregar mensagens no servidor
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LangUpdater locale={locale} />
      <LocaleLayoutClient>
        {children}
      </LocaleLayoutClient>
    </NextIntlClientProvider>
  )
}
