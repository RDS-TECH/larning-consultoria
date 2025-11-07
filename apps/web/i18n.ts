import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Lista de idiomas suportados
export const locales = ['pt-BR', 'en'] as const;
export const defaultLocale = 'pt-BR' as const;

// Type helper para locales
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validar que o locale recebido é válido
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    // Configurações opcionais
    timeZone: 'America/Sao_Paulo',
    now: new Date(),
  };
});
