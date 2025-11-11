import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import LocaleLayoutClient from './layout-client';

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
    <html className="" lang={locale}>
      <head />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleLayoutClient>
            {children}
          </LocaleLayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
