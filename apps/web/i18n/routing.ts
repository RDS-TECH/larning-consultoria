import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Lista de idiomas suportados
  locales: ['pt-BR', 'en'],

  // Idioma padrão quando nenhum locale corresponder
  defaultLocale: 'pt-BR',

  // URLs completamente transparentes - sem prefixo de locale visível
  localePrefix: 'never'
});
