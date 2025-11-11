import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Lista de todos os locales suportados
  locales: ['pt-BR', 'en'],

  // Locale padrão usado quando nenhum locale válido é detectado
  defaultLocale: 'pt-BR',

  // Desabilita detecção automática de locale pela URL
  // Isso mantém sempre pt-BR como padrão
  localePrefix: 'always'
});

// Exporta funções de navegação tipadas
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
