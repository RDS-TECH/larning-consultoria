import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never', // URLs sem locale visível - completamente transparente
  localeDetection: true // Detecta idioma via Accept-Language header e cookies
});

export const config = {
  // Match apenas caminhos internacionalizados
  // Excluir api, _next, _vercel e arquivos estáticos
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)',]
};
