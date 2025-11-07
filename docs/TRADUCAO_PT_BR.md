# Estratégia de Tradução para Português (pt-BR)

## Análise Atual

**Status**: O frontend não possui sistema de internacionalização (i18n). Todos os textos estão hardcoded em inglês.

**Tipos de texto encontrados**:
- Labels de formulários: "Email", "Password", "Username"
- Botões de ação: "Login", "Sign up", "Sign in with Google"
- Mensagens de erro: "Required", "Invalid email address", "Wrong Email or password"
- Títulos de páginas: "Courses", "Users", "Organization", "Dashboard"
- Tooltips: "Back to Home", "Your Organization"
- Descrições: "Create and manage courses, chapters and activities"
- Navegação: "Home", "Settings", "Profile"
- Mensagens de validação: "Password must be at least 8 characters"

## Estratégia Recomendada: next-intl

### Por que next-intl?

1. ✅ **Compatibilidade total** com Next.js 14+ e App Router
2. ✅ **Type-safe** - TypeScript completo
3. ✅ **Server Components** - Suporte nativo
4. ✅ **Performance** - Otimizado para SSR/SSG
5. ✅ **API simples** - Fácil migração
6. ✅ **Namespace support** - Organização modular

## Implementação Passo a Passo

### 1. Instalar Dependências

```bash
cd apps/web
pnpm add next-intl
```

### 2. Estrutura de Arquivos

```
apps/web/
├── messages/
│   ├── pt-BR.json    # Traduções em Português
│   └── en.json       # Traduções em Inglês (opcional)
├── i18n.ts           # Configuração do i18n
├── middleware.ts     # Middleware para detectar idioma
└── app/
    └── [locale]/     # Rotas com locale
```

### 3. Criar Arquivos de Tradução

**messages/pt-BR.json**:
```json
{
  "auth": {
    "login": {
      "title": "Entrar em",
      "email": "E-mail",
      "password": "Senha",
      "forgotPassword": "Esqueceu a senha?",
      "loginButton": "Entrar",
      "loading": "Carregando...",
      "or": "OU",
      "signUp": "Criar conta",
      "signInWithGoogle": "Entrar com Google",
      "errors": {
        "required": "Campo obrigatório",
        "invalidEmail": "E-mail inválido",
        "passwordTooShort": "A senha deve ter pelo menos 8 caracteres",
        "wrongCredentials": "E-mail ou senha incorretos"
      }
    },
    "signup": {
      "title": "Criar conta"
    }
  },
  "dashboard": {
    "home": {
      "courses": {
        "title": "Cursos",
        "description": "Criar e gerenciar cursos, capítulos e atividades"
      },
      "organization": {
        "title": "Organização",
        "description": "Configurar as definições gerais da sua Organização"
      },
      "users": {
        "title": "Usuários",
        "description": "Gerenciar os usuários e funções da sua Organização"
      },
      "accountSettings": {
        "title": "Configurações da Conta",
        "description": "Configure suas definições pessoais, senhas e e-mail"
      }
    },
    "menu": {
      "home": "Início",
      "courses": "Cursos",
      "users": "Usuários",
      "organization": "Organização",
      "settings": "Configurações",
      "logout": "Sair",
      "backToHome": "Voltar ao Início",
      "yourOrganization": "Sua Organização"
    }
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "edit": "Editar",
    "create": "Criar",
    "search": "Pesquisar",
    "close": "Fechar",
    "submit": "Enviar",
    "loading": "Carregando...",
    "welcome": "Bem-vindo",
    "profile": "Perfil",
    "about": "Sobre",
    "noBiography": "Nenhuma biografia fornecida"
  }
}
```

### 4. Configuração do i18n

**i18n.ts**:
```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['pt-BR', 'en'] as const;
export const defaultLocale = 'pt-BR' as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

### 5. Atualizar next.config.js

**next.config.js**:
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

### 6. Criar Middleware

**middleware.ts** (na raiz de apps/web):
```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // pt-BR será o padrão sem prefixo
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt-BR|en)/:path*']
};
```

### 7. Atualizar Estrutura de Rotas

**IMPORTANTE**: Com next-intl, você precisa criar uma pasta `[locale]` e mover suas rotas para dentro dela:

```
apps/web/app/
├── [locale]/
│   ├── layout.tsx      # Root layout com NextIntlClientProvider
│   ├── page.tsx
│   ├── auth/
│   │   ├── login/
│   │   └── signup/
│   └── orgs/
│       └── [orgslug]/
└── api/                # API routes ficam fora do [locale]
```

### 8. Exemplo de Uso - Login Component

**ANTES (apps/web/app/auth/login/login.tsx)**:
```tsx
<FormLabelAndMessage
  label="Email"
  message={formik.errors.email}
/>
```

**DEPOIS (apps/web/app/[locale]/auth/login/login.tsx)**:
```tsx
'use client'
import { useTranslations } from 'next-intl';

const LoginClient = (props: LoginClientProps) => {
  const t = useTranslations('auth.login');

  // Validação com traduções
  const validate = (values: any) => {
    const errors: any = {}

    if (!values.email) {
      errors.email = t('errors.required')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = t('errors.invalidEmail')
    }

    if (!values.password) {
      errors.password = t('errors.required')
    } else if (values.password.length < 8) {
      errors.password = t('errors.passwordTooShort')
    }

    return errors
  }

  return (
    <div className="grid grid-flow-col justify-stretch h-screen">
      <div className="right-login-part">
        <div className="ml-10 h-4/6 flex flex-row text-white">
          <div className="m-auto flex space-x-4 items-center flex-wrap">
            <div>{t('title')} </div>
            {/* Logo aqui */}
          </div>
        </div>
      </div>
      <div className="left-login-part bg-white flex flex-row">
        <div className="login-form m-auto w-72">
          {error && (
            <div className="flex justify-center bg-red-200 rounded-md text-red-950 space-x-2 items-center p-4">
              <AlertTriangle size={18} />
              <div className="font-bold text-sm">{error}</div>
            </div>
          )}
          <FormLayout onSubmit={formik.handleSubmit}>
            <FormField name="email">
              <FormLabelAndMessage
                label={t('email')}
                message={formik.errors.email}
              />
              <Form.Control asChild>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  type="email"
                />
              </Form.Control>
            </FormField>

            <FormField name="password">
              <FormLabelAndMessage
                label={t('password')}
                message={formik.errors.password}
              />
              <Form.Control asChild>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  type="password"
                />
              </Form.Control>
            </FormField>

            <div>
              <Link
                href={{ pathname: getUriWithoutOrg('/forgot'), query: props.org.slug ? { orgslug: props.org.slug } : null }}
                className="text-xs text-gray-500 hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <div className="flex py-4">
              <Form.Submit asChild>
                <button className="w-full bg-black text-white font-bold text-center p-2 rounded-md shadow-md hover:cursor-pointer">
                  {isSubmitting ? t('loading') : t('loginButton')}
                </button>
              </Form.Submit>
            </div>
          </FormLayout>

          <div className='flex h-0.5 rounded-2xl bg-slate-100 mt-5 mx-10'></div>
          <div className='flex justify-center py-5 mx-auto'>{t('or')}</div>
          <div className='flex flex-col space-y-4'>
            <Link href={{ pathname: getUriWithoutOrg('/signup'), query: props.org.slug ? { orgslug: props.org.slug } : null }}
                  className="flex justify-center items-center py-3 text-md w-full bg-gray-800 text-gray-300 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:cursor-pointer">
              <UserRoundPlus size={17} />
              <span>{t('signUp')}</span>
            </Link>
            <button onClick={() => signIn('google', { callbackUrl: '/redirect_from_auth' })}
                    className="flex justify-center py-3 text-md w-full bg-white text-slate-600 space-x-3 font-semibold text-center p-2 rounded-md shadow-sm hover:cursor-pointer">
              <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="" />
              <span>{t('signInWithGoogle')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 9. Exemplo - Dashboard Menu

**ANTES**:
```tsx
<ToolTip content={'Home'} slateBlack sideOffset={8} side="right">
  <Link href={`/dash`}>
    <Home size={18} />
  </Link>
</ToolTip>
```

**DEPOIS**:
```tsx
'use client'
import { useTranslations } from 'next-intl';

function DashLeftMenu() {
  const t = useTranslations('dashboard.menu');

  return (
    <ToolTip content={t('home')} slateBlack sideOffset={8} side="right">
      <Link href={`/dash`}>
        <Home size={18} />
      </Link>
    </ToolTip>
  )
}
```

### 10. Server Components

Para Server Components, use `getTranslations`:

```tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('auth.login');

  return {
    title: t('title') + ` — ${org.name}`,
  }
}

async function LoginPage() {
  const t = await getTranslations('auth.login');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  )
}
```

## Plano de Migração

### Fase 1: Setup (1-2 dias)
1. ✅ Instalar next-intl
2. ✅ Criar estrutura de pastas e arquivos
3. ✅ Configurar middleware e i18n
4. ✅ Atualizar next.config.js
5. ✅ Mover rotas para dentro de `[locale]`

### Fase 2: Traduções Core (3-5 dias)
1. **Autenticação** (login, signup, forgot password)
2. **Dashboard Home** (menu lateral, página inicial)
3. **Navegação Global** (headers, footers, menus)

### Fase 3: Traduções de Conteúdo (5-7 dias)
1. **Gerenciamento de Cursos**
2. **Gerenciamento de Usuários**
3. **Configurações da Organização**
4. **Profile Pages**

### Fase 4: Traduções de Features (5-7 dias)
1. **Editor de Curso** (Tiptap)
2. **Atividades e Assignments**
3. **Certificados**
4. **Payments**
5. **AI Features**

### Fase 5: Validação e Refinamento (2-3 dias)
1. Revisar todas as traduções
2. Testar fluxos completos
3. Ajustar termos técnicos
4. Garantir consistência

## Checklist de Arquivos a Traduzir

### Autenticação
- [x] `apps/web/app/auth/login/login.tsx`
- [x] `apps/web/app/auth/signup/OpenSignup.tsx`
- [x] `apps/web/app/auth/signup/InviteOnlySignUp.tsx`
- [ ] `apps/web/app/auth/forgot/page.tsx`
- [ ] `apps/web/app/auth/reset/page.tsx`

### Dashboard
- [x] `apps/web/app/orgs/[orgslug]/dash/page.tsx`
- [x] `apps/web/components/Dashboard/Menus/DashLeftMenu.tsx`
- [ ] `apps/web/components/Dashboard/Menus/DashMobileMenu.tsx`
- [ ] `apps/web/components/Dashboard/Pages/Course/*`
- [ ] `apps/web/components/Dashboard/Pages/Payments/*`
- [ ] `apps/web/components/Dashboard/Pages/Users/*`

### Componentes Compartilhados
- [ ] `apps/web/components/Objects/Forms/*`
- [ ] `apps/web/components/Objects/Courses/*`
- [ ] `apps/web/components/Pages/*`

## Dicas de Tradução

### Termos Técnicos
- **Course** → **Curso**
- **Activity** → **Atividade**
- **Assignment** → **Tarefa/Trabalho**
- **Dashboard** → **Painel** (ou manter Dashboard)
- **Settings** → **Configurações**
- **Organization** → **Organização**
- **User** → **Usuário**
- **Profile** → **Perfil**
- **Chapter** → **Capítulo**
- **Collection** → **Coleção**
- **Certificate** → **Certificado**

### Boas Práticas
1. **Mantenha consistência** nos termos escolhidos
2. **Use tratamento formal** (você) no contexto educacional
3. **Evite anglicismos** quando houver termo equivalente em português
4. **Contexto é importante** - mesma palavra pode ter traduções diferentes
5. **Revise com falantes nativos** para garantir naturalidade

## Comandos Úteis

```bash
# Instalar dependências
cd apps/web
pnpm add next-intl

# Executar em desenvolvimento
pnpm dev

# Build com i18n
pnpm build

# Verificar se todos os textos usam traduções
grep -r "className.*['\"].*[A-Z]" apps/web/app --include="*.tsx" | grep -v "t("
```

## Estrutura Final Esperada

```
apps/web/
├── messages/
│   ├── pt-BR.json          # ~2000-3000 linhas
│   └── en.json             # Opcional
├── i18n.ts
├── middleware.ts
├── next.config.js          # Atualizado
└── app/
    ├── [locale]/
    │   ├── layout.tsx      # Com NextIntlClientProvider
    │   ├── auth/
    │   ├── orgs/
    │   └── ...
    └── api/                # Sem tradução
```

## Próximos Passos

1. Revisar e aprovar esta estratégia
2. Começar pela Fase 1 (Setup)
3. Criar PR com estrutura básica
4. Migrar componentes gradualmente
5. Testar em ambiente de desenvolvimento
6. Deploy incremental

## Considerações de Multi-Organização

Como o LearnHouse suporta multi-organizações, considere:
- Permitir que cada organização defina seu idioma padrão
- Armazenar preferência de idioma por usuário
- Adicionar seletor de idioma na UI
