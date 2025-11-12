# Guia Prático de Implementação - Internacionalização pt-BR

## Status Atual

✅ **Arquivos Criados**:
- `apps/web/messages/pt-BR.json` - Traduções completas em português
- `apps/web/messages/en.json` - Traduções em inglês (opcional)
- `apps/web/i18n.ts` - Configuração do next-intl
- `TRADUCAO_PT_BR.md` - Estratégia completa de tradução

## Próximos Passos para Implementação

### 1. Instalar next-intl

```bash
cd apps/web
pnpm add next-intl
```

### 2. Atualizar next.config.js

Edite `apps/web/next.config.js`:

```javascript
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/umami/script.js',
        destination: `https://eu.umami.is/script.js`,
      },
      {
        source: '/umami/api/send',
        destination: `https://eu.umami.is/api/send`,
      },
    ]
  },
  reactStrictMode: false,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withNextIntl(nextConfig);
```

### 3. Criar middleware.ts

Crie `apps/web/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // pt-BR será o padrão sem prefixo na URL
});

export const config = {
  // Match apenas caminhos internacionalizados
  matcher: ['/', '/(pt-BR|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### 4. Reestruturar Rotas (IMPORTANTE)

Você precisa mover todas as rotas para dentro de uma pasta `[locale]`:

**ANTES**:
```
apps/web/app/
├── layout.tsx
├── page.tsx
├── auth/
│   ├── login/
│   └── signup/
└── orgs/
```

**DEPOIS**:
```
apps/web/app/
├── [locale]/
│   ├── layout.tsx      # Novo layout com NextIntlClientProvider
│   ├── page.tsx
│   ├── auth/
│   │   ├── login/
│   │   └── signup/
│   └── orgs/
└── api/                # API routes permanecem fora
```

### 5. Atualizar Root Layout

Crie/edite `apps/web/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../styles/globals.css';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Buscar mensagens do locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 6. Exemplos Práticos de Migração

#### Exemplo 1: Client Component (Login)

**ANTES** (`apps/web/app/auth/login/login.tsx`):
```tsx
'use client'
import { useFormik } from 'formik'

const validate = (values: any) => {
  const errors: any = {}
  if (!values.email) {
    errors.email = 'Required'
  }
  return errors
}

const LoginClient = (props) => {
  return (
    <div>
      <FormLabelAndMessage label="Email" />
      <button>Login</button>
    </div>
  )
}
```

**DEPOIS** (`apps/web/app/[locale]/auth/login/login.tsx`):
```tsx
'use client'
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik'

const LoginClient = (props) => {
  const t = useTranslations('auth.login');

  const validate = (values: any) => {
    const errors: any = {}
    if (!values.email) {
      errors.email = t('errors.required')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = t('errors.invalidEmail')
    }
    return errors
  }

  return (
    <div>
      <FormLabelAndMessage label={t('email')} />
      <button>{t('loginButton')}</button>
    </div>
  )
}
```

#### Exemplo 2: Server Component (Dashboard)

**ANTES**:
```tsx
function DashboardHome() {
  return (
    <div>
      <h1>Courses</h1>
      <p>Create and manage courses, chapters and activities</p>
    </div>
  )
}
```

**DEPOIS**:
```tsx
import { getTranslations } from 'next-intl/server';

async function DashboardHome() {
  const t = await getTranslations('dashboard.home');

  return (
    <div>
      <h1>{t('courses.title')}</h1>
      <p>{t('courses.description')}</p>
    </div>
  )
}
```

#### Exemplo 3: Metadata (SEO)

**ANTES**:
```tsx
export async function generateMetadata() {
  return {
    title: 'Sign up — Organization Name',
  }
}
```

**DEPOIS**:
```tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'auth.signup' });

  return {
    title: `${t('title')} — Organization Name`,
  }
}
```

#### Exemplo 4: Toast Notifications

**ANTES**:
```tsx
toast.success('Activity created successfully')
toast.error('Failed to create activity')
```

**DEPOIS**:
```tsx
import { useTranslations } from 'next-intl';

const MyComponent = () => {
  const t = useTranslations('activities.success');
  const tError = useTranslations('errors');

  const handleCreate = async () => {
    try {
      await createActivity();
      toast.success(t('created'));
    } catch (error) {
      toast.error(tError('createFailed'));
    }
  }
}
```

#### Exemplo 5: Diálogos de Confirmação

**ANTES**:
```tsx
<Dialog
  dialogTitle="Delete Activity ?"
  confirmationMessage="Are you sure you want to delete this activity ?"
  confirmationButtonText="Delete Activity"
/>
```

**DEPOIS**:
```tsx
const t = useTranslations('activities.confirmations');

<Dialog
  dialogTitle={t('deleteTitle', { name: activity.name })}
  confirmationMessage={t('deleteMessage')}
  confirmationButtonText={t('deleteButton')}
/>
```

#### Exemplo 6: Formulários com Placeholders

**ANTES**:
```tsx
<Input
  placeholder="Enter activity name"
  label="Activity Name"
/>
```

**DEPOIS**:
```tsx
const t = useTranslations('activities');

<Input
  placeholder={t('activityName')}
  label={t('activityName')}
/>
```

### 7. Padrões de Uso das Traduções

#### Uso Básico
```tsx
const t = useTranslations('namespace');
<div>{t('key')}</div>
```

#### Com Interpolação
```tsx
// Em pt-BR.json: "welcome": "Bem-vindo, {name}!"
const t = useTranslations();
<div>{t('welcome', { name: user.name })}</div>
```

#### Com Plurais
```tsx
// Em pt-BR.json:
// "items": "{count, plural, =0 {nenhum item} =1 {1 item} other {# itens}}"
const t = useTranslations();
<div>{t('items', { count: items.length })}</div>
```

#### Rich Text
```tsx
const t = useTranslations();
<div>
  {t.rich('message', {
    b: (chunks) => <b>{chunks}</b>,
    link: (chunks) => <a href="/link">{chunks}</a>
  })}
</div>
```

### 8. Testando a Implementação

1. **Iniciar o servidor de desenvolvimento**:
```bash
cd apps/web
pnpm dev
```

2. **Acessar URLs**:
- `http://localhost:3000` - Português (padrão)
- `http://localhost:3000/en` - Inglês

3. **Verificar traduções**:
- Navegue pelas páginas
- Verifique se todos os textos estão traduzidos
- Teste formulários e validações
- Teste mensagens de erro/sucesso

### 9. Checklist de Migração por Componente

Use este checklist ao migrar cada componente:

- [ ] Importar `useTranslations` (client) ou `getTranslations` (server)
- [ ] Substituir strings hardcoded por chamadas `t()`
- [ ] Atualizar validações de formulários
- [ ] Atualizar mensagens de toast
- [ ] Atualizar diálogos de confirmação
- [ ] Atualizar metadata e SEO
- [ ] Testar o componente
- [ ] Verificar no browser que as traduções aparecem

### 10. Ordem Recomendada de Migração

**Fase 1 - Fundação** (1-2 dias):
1. ✅ Instalar next-intl
2. ✅ Criar estrutura de pastas `[locale]`
3. ✅ Atualizar layout root
4. ✅ Atualizar middleware
5. ✅ Testar que o app ainda funciona

**Fase 2 - Componentes Core** (3-5 dias):
1. **Autenticação**:
   - [ ] `apps/web/app/[locale]/auth/login/login.tsx`
   - [ ] `apps/web/app/[locale]/auth/signup/*.tsx`
   - [ ] `apps/web/app/[locale]/auth/forgot/*.tsx`

2. **Menu e Navegação**:
   - [ ] `apps/web/components/Dashboard/Menus/DashLeftMenu.tsx`
   - [ ] `apps/web/components/Dashboard/Menus/DashMobileMenu.tsx`

3. **Dashboard Home**:
   - [ ] `apps/web/app/[locale]/orgs/[orgslug]/dash/page.tsx`

**Fase 3 - Features** (5-10 dias):
4. **Cursos**:
   - [ ] `apps/web/components/Dashboard/Pages/Course/*.tsx`
   - [ ] Editor de curso e atividades

5. **Usuários**:
   - [ ] `apps/web/components/Dashboard/Pages/Users/*.tsx`
   - [ ] Roles e UserGroups

6. **Organização**:
   - [ ] Settings da organização
   - [ ] Scripts e configurações

7. **Pagamentos**:
   - [ ] Produtos e Stripe

**Fase 4 - Componentes Compartilhados** (3-5 dias):
8. **Forms e UI**:
   - [ ] `apps/web/components/Objects/Forms/*.tsx`
   - [ ] Botões e inputs compartilhados

9. **Editor Rich Text**:
   - [ ] Toolbar e botões do Tiptap
   - [ ] Componentes de bloco

**Fase 5 - Refinamento** (2-3 dias):
10. Revisar todas as traduções
11. Testar fluxos completos
12. Corrigir inconsistências
13. Otimizar performance

### 11. Comandos Úteis Durante a Migração

```bash
# Encontrar textos hardcoded que ainda não foram traduzidos
grep -r "className.*['\"].*[A-Z]" apps/web/app/\[locale\] --include="*.tsx" | grep -v "t("

# Contar quantos arquivos ainda têm textos hardcoded
grep -r "Login\|Sign up\|Email\|Password" apps/web/app --include="*.tsx" | wc -l

# Encontrar todos os useTranslations/getTranslations
grep -r "useTranslations\|getTranslations" apps/web/app --include="*.tsx"

# Build para verificar erros de tipo
pnpm build
```

### 12. Troubleshooting

#### Problema: "Cannot read properties of undefined"
**Solução**: Verifique se a chave existe no arquivo pt-BR.json

#### Problema: Texto aparece em inglês mesmo com pt-BR
**Solução**:
1. Limpe o cache: `rm -rf .next`
2. Reinicie o servidor: `pnpm dev`
3. Verifique se a rota está dentro de `[locale]`

#### Problema: Build falha com erros de tipo
**Solução**:
1. Execute `pnpm build` para ver erros específicos
2. Verifique se todas as chaves de tradução existem
3. Adicione type-safety com TypeScript

### 13. Type Safety (Opcional mas Recomendado)

Crie `apps/web/types/i18n.d.ts`:

```typescript
import type pt_BR from '../messages/pt-BR.json';

type Messages = typeof pt_BR;

declare global {
  interface IntlMessages extends Messages {}
}
```

Isso dará autocomplete e type checking para suas chaves de tradução!

### 14. Próximos Passos Após Implementação

1. **Adicionar seletor de idioma** na UI
2. **Armazenar preferência do usuário** no banco de dados
3. **Adicionar mais idiomas** conforme necessário
4. **Otimizar bundle size** - carregar apenas o idioma necessário
5. **SEO multi-idioma** - configurar hreflang tags
6. **Datas e números** - usar Intl.DateTimeFormat e Intl.NumberFormat

## Recursos Adicionais

- [Documentação oficial next-intl](https://next-intl-docs.vercel.app/)
- [Exemplos de uso](https://github.com/amannn/next-intl/tree/main/examples)
- [Best practices](https://next-intl-docs.vercel.app/docs/usage/best-practices)

## Suporte

Se encontrar problemas durante a implementação, consulte:
1. Este documento
2. `TRADUCAO_PT_BR.md` para estratégia completa
3. `apps/web/messages/pt-BR.json` para chaves de tradução
4. Documentação oficial do next-intl
