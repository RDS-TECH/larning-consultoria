import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  // Desabilita detecção automática para sempre usar pt-BR como padrão
  localeDetection: false,
});

export const config = {
  // Match apenas caminhos internacionalizados
  // Excluir api, _next, _vercel e arquivos estáticos
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)',]
};
