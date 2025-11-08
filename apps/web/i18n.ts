import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Obtém o locale requisitado (pode ser do cookie, Accept-Language, etc)
  let locale = await requestLocale;

  // Valida se o locale é suportado, senão usa o padrão
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // Configurações opcionais
    timeZone: 'America/Sao_Paulo',
    now: new Date(),
  };
});
