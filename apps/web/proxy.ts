import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match apenas caminhos internacionalizados
  // Excluir api, _next, _vercel e arquivos estáticos
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)',]
};
