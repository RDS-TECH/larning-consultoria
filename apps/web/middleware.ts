import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // pt-BR será o padrão sem prefixo na URL
});

export const config = {
  // Match apenas caminhos internacionalizados
  // Excluir api, _next, _vercel e arquivos estáticos
  matcher: ['/', '/(pt-BR|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
