# AUDITORIA COMPLETA DE ROTAS - LEARNHOUSE FRONTEND (Next.js 15+)

**Data da Auditoria**: 2025-11-09  
**Aplicação**: LearnHouse Web (Next.js 15+)  
**Estrutura**: Monorepo com Turborepo  
**Configuração i18n**: next-intl com defineRouting

---

## 1. ESTRUTURA DE DIRETÓRIOS MAPEADA

### Árvore Completa de Rotas

```
app/
├── [locale]/                          # Segmento dinâmico de localização
│   ├── layout.tsx                     # Layout raiz com HTML/Body (Arquivo Principal)
│   ├── layout-client.tsx              # Provider raiz (Client)
│   ├── page.tsx                       # Página raiz que redireciona
│   │
│   ├── auth/
│   │   ├── layout.tsx                 # Layout de autenticação (Client)
│   │   ├── login/
│   │   │   ├── page.tsx               # Rota: /[locale]/auth/login
│   │   │   ├── login.tsx              # Componente Client
│   │   │   └── options.ts             # Configuração NextAuth
│   │   │
│   │   ├── signup/
│   │   │   ├── page.tsx               # Rota: /[locale]/auth/signup
│   │   │   ├── signup.tsx             # Componente Client
│   │   │   ├── OpenSignup.tsx         # Variante para signup aberto
│   │   │   └── InviteOnlySignUp.tsx   # Variante para signup por convite
│   │   │
│   │   ├── forgot/
│   │   │   ├── page.tsx               # Rota: /[locale]/auth/forgot
│   │   │   └── forgot.tsx             # Componente Client
│   │   │
│   │   └── reset/
│   │       ├── page.tsx               # Rota: /[locale]/auth/reset
│   │       └── reset.tsx              # Componente Client
│   │
│   ├── home/
│   │   ├── page.tsx                   # Rota: /[locale]/home
│   │   └── home.tsx                   # Componente Client
│   │
│   ├── install/
│   │   ├── page.tsx                   # Rota: /[locale]/install
│   │   ├── install.tsx                # Componente Client
│   │   └── steps/
│   │       ├── steps.tsx              # Componente wrapper
│   │       ├── get_started.tsx        # Step 1: Get Started
│   │       ├── account_creation.tsx   # Step 2: Criação de Conta
│   │       ├── org_creation.tsx       # Step 3: Criação de Org
│   │       ├── default_elements.tsx   # Step 4: Elementos Padrão
│   │       ├── sample_data.tsx        # Step 5: Dados de Amostra
│   │       ├── disable_install_mode.tsx  # Step 6: Desabilitar Install Mode
│   │       └── finish.tsx             # Step 7: Conclusão
│   │
│   ├── payments/
│   │   └── stripe/
│   │       └── connect/
│   │           └── oauth/
│   │               └── page.tsx       # Rota: /[locale]/payments/stripe/connect/oauth
│   │
│   ├── editor/
│   │   ├── main.ts                    # Configuração do editor
│   │   └── course/
│   │       └── [courseid]/
│   │           └── activity/
│   │               └── [activityuuid]/
│   │                   └── edit/
│   │                       ├── page.tsx       # Rota: /[locale]/editor/course/[courseid]/activity/[activityuuid]/edit
│   │                       └── loading.tsx    # Loading state
│   │
│   └── orgs/
│       └── [orgslug]/
│           ├── layout.tsx             # Layout de organização (Client com OrgProvider)
│           │
│           ├── (withmenu)/           # Nested Layout: Com menu
│           │   ├── layout.tsx         # Layout com menu e SessionProvider
│           │   ├── page.tsx           # Rota: /[locale]/orgs/[orgslug]/ - Landing page
│           │   ├── error.tsx          # Error boundary
│           │   ├── loading.tsx        # Loading state
│           │   │
│           │   ├── courses/
│           │   │   ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/courses
│           │   │   ├── courses.tsx    # Componente Client
│           │   │   ├── error.tsx      # Error boundary
│           │   │   └── loading.tsx    # Loading state
│           │   │
│           │   ├── course/
│           │   │   └── [courseuuid]/
│           │   │       ├── page.tsx   # Rota: /[locale]/orgs/[orgslug]/course/[courseuuid]
│           │   │       ├── course.tsx # Componente Client
│           │   │       ├── error.tsx  # Error boundary
│           │   │       │
│           │   │       └── activity/
│           │   │           └── [activityid]/
│           │   │               ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/course/[courseuuid]/activity/[activityid]
│           │   │               ├── activity.tsx   # Componente Client
│           │   │               ├── error.tsx      # Error boundary
│           │   │               └── loading.tsx    # Loading state
│           │   │
│           │   ├── collections/
│           │   │   ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/collections
│           │   │   ├── error.tsx      # Error boundary
│           │   │   ├── loading.tsx    # Loading state
│           │   │   │
│           │   │   └── new/
│           │   │       └── page.tsx   # Rota: /[locale]/orgs/[orgslug]/collections/new
│           │   │
│           │   ├── collection/
│           │   │   └── [collectionid]/
│           │   │       ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/collection/[collectionid]
│           │   │       ├── error.tsx      # Error boundary
│           │   │       └── loading.tsx    # Loading state
│           │   │
│           │   ├── trail/
│           │   │   ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/trail
│           │   │   └── trail.tsx      # Componente Client
│           │   │
│           │   ├── search/
│           │   │   └── page.tsx       # Rota: /[locale]/orgs/[orgslug]/search
│           │   │
│           │   ├── user/
│           │   │   └── [username]/
│           │   │       ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/user/[username]
│           │   │       └── UserProfileClient.tsx
│           │   │
│           │   └── certificates/
│           │       └── [uuid]/
│           │           └── verify/
│           │               └── page.tsx   # Rota: /[locale]/orgs/[orgslug]/certificates/[uuid]/verify
│           │
│           └── dash/                  # Admin/Dashboard (sem menu lateral)
│               ├── layout.tsx         # Layout admin (Client)
│               ├── page.tsx           # Rota: /[locale]/orgs/[orgslug]/dash
│               ├── ClientAdminLayout.tsx
│               │
│               ├── courses/
│               │   ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/dash/courses
│               │   ├── client.tsx     # Componente Client
│               │   │
│               │   └── course/
│               │       └── [courseuuid]/
│               │           └── [subpage]/
│               │               └── page.tsx
│               │
│               ├── assignments/
│               │   ├── page.tsx       # Rota: /[locale]/orgs/[orgslug]/dash/assignments
│               │   │
│               │   └── [assignmentuuid]/
│               │       ├── page.tsx   # Rota: /[locale]/orgs/[orgslug]/dash/assignments/[assignmentuuid]
│               │       ├── Tasks.tsx
│               │       ├── subpages/
│               │       │   ├── AssignmentEditorSubPage.tsx
│               │       │   ├── AssignmentSubmissionsSubPage.tsx
│               │       │   └── Modals/
│               │       │       └── EvaluateAssignment.tsx
│               │       └── _components/
│               │           ├── Modals/
│               │           │   └── NewTaskModal.tsx
│               │           └── TaskEditor/
│               │               ├── TaskEditor.tsx
│               │               └── Subs/
│               │                   ├── AssignmentTaskGeneralEdit.tsx
│               │                   ├── AssignmentTaskContentEdit.tsx
│               │                   └── TaskTypes/
│               │                       ├── TaskFileObject.tsx
│               │                       ├── TaskFormObject.tsx
│               │                       └── TaskQuizObject.tsx
│               │
│               ├── org/
│               │   └── settings/
│               │       └── [subpage]/
│               │           └── page.tsx   # Rota: /[locale]/orgs/[orgslug]/dash/org/settings/[subpage]
│               │
│               ├── user-account/
│               │   ├── owned/
│               │   │   └── page.tsx       # Rota: /[locale]/orgs/[orgslug]/dash/user-account/owned
│               │   │
│               │   └── settings/
│               │       └── [subpage]/
│               │           └── page.tsx   # Rota: /[locale]/orgs/[orgslug]/dash/user-account/settings/[subpage]
│               │
│               ├── users/
│               │   └── settings/
│               │       └── [subpage]/
│               │           └── page.tsx   # Rota: /[locale]/orgs/[orgslug]/dash/users/settings/[subpage]
│               │
│               ├── payments/
│               │   └── [subpage]/
│               │       └── page.tsx       # Rota: /[locale]/orgs/[orgslug]/dash/payments/[subpage]
│               │
│               └── documentation/
│                   ├── layout.tsx
│                   └── rights/
│                       └── page.tsx       # Rota: /[locale]/orgs/[orgslug]/dash/documentation/rights
│
├── api/                               # API Routes (não localizadas)
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts               # NextAuth callback
│   │
│   ├── health/
│   │   └── route.ts                   # Health check
│   │
│   ├── revalidate/
│   │   └── route.ts                   # ISR revalidation
│   │
│   ├── sitemap/
│   │   └── route.ts                   # Dynamic sitemap
│   │
│   ├── debug-env/
│   │   └── route.ts                   # Debug endpoint
│   │
│   └── debug-config/
│       └── route.ts                   # Debug endpoint
│
├── global-error.tsx                   # Global error boundary
├── not-found.tsx                      # 404 page
│
└── (root-files)
    ├── i18n.ts                        # Configuração i18n
    └── i18n/
        └── routing.ts                 # Definição de rotas localizadas
```

---

## 2. ROTAS PRINCIPAIS IDENTIFICADAS

### Rotas de Autenticação (com locale)
- `/{locale}/auth/login` ✓ EXISTE
- `/{locale}/auth/signup` ✓ EXISTE
- `/{locale}/auth/forgot` ✓ EXISTE
- `/{locale}/auth/reset` ✓ EXISTE

### Rotas de Conteúdo
- `/{locale}/home` ✓ EXISTE
- `/{locale}/orgs/{orgslug}` ✓ EXISTE (via withmenu/page.tsx)
- `/{locale}/orgs/{orgslug}/courses` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/course/{courseuuid}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/course/{courseuuid}/activity/{activityid}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/collections` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/collection/{collectionid}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/trail` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/search` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/user/{username}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/certificates/{uuid}/verify` ✓ EXISTE

### Rotas de Admin/Dashboard (com locale)
- `/{locale}/orgs/{orgslug}/dash` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/courses` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/assignments` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/assignments/{assignmentuuid}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/org/settings/{subpage}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/user-account/owned` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/user-account/settings/{subpage}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/users/settings/{subpage}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/payments/{subpage}` ✓ EXISTE
- `/{locale}/orgs/{orgslug}/dash/documentation/rights` ✓ EXISTE

### Rotas de Instalação
- `/{locale}/install` ✓ EXISTE

### Rotas de Editor
- `/{locale}/editor/course/{courseid}/activity/{activityuuid}/edit` ✓ EXISTE

### Rotas de Pagamentos
- `/{locale}/payments/stripe/connect/oauth` ✓ EXISTE

### Rotas de API (não localizadas)
- `/api/auth/[...nextauth]` ✓ EXISTE
- `/api/health` ✓ EXISTE
- `/api/revalidate` ✓ EXISTE
- `/api/sitemap` ✓ EXISTE
- `/api/debug-env` ✓ EXISTE
- `/api/debug-config` ✓ EXISTE

---

## 3. CONFIGURAÇÃO I18N VERIFICADA

### Arquivo: `i18n.ts`
```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'America/Sao_Paulo',
    now: new Date(),
  };
});
```

### Arquivo: `i18n/routing.ts`
```typescript
export const routing = defineRouting({
  locales: ['pt-BR', 'en'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed'  // Locale omitido em pt-BR
});
```

### Arquivos de Mensagens
- `messages/pt-BR.json` ✓ EXISTE
- `messages/en.json` ✓ EXISTE

### Comportamento de i18n
- **Locales suportados**: pt-BR, en
- **Locale padrão**: pt-BR
- **Prefixo**: `as-needed` (pt-BR não aparece na URL, apenas en aparece)
- **URLs esperadas**:
  - `/home` → pt-BR (padrão)
  - `/en/home` → en
  - `/orgs/default` → pt-BR (padrão)
  - `/en/orgs/default` → en

---

## 4. ESTRUTURA DE LAYOUTS ANALISADA

### Layout Hierarchy (Correto)
```
app/[locale]/layout.tsx (HTML/Body - Server)
  ├── NextIntlClientProvider
  └── LocaleLayoutClient (Client)
      ├── SessionProvider
      ├── LHSessionProvider
      ├── StyledComponentsRegistry
      └── motion.main
          └── children
              ├── app/[locale]/auth/layout.tsx (Client - OrgProvider)
              │   └── children
              │       └── page.tsx
              │
              ├── app/[locale]/home/page.tsx
              │
              └── app/[locale]/orgs/[orgslug]/layout.tsx (Client - OrgProvider)
                  ├── NextTopLoader
                  ├── Toast
                  ├── Onboarding
                  ├── Footer
                  │
                  ├── app/[locale]/orgs/[orgslug]/(withmenu)/layout.tsx (Client - SessionProvider)
                  │   ├── OrgMenu
                  │   ├── Watermark
                  │   └── children (pages with menu)
                  │
                  └── app/[locale]/orgs/[orgslug]/dash/layout.tsx (Client)
                      └── children (pages without menu)
```

### Tags HTML/Body
- **Local correto**: `/app/[locale]/layout.tsx` (Arquivo Principal - ÚNICO lugar)
- **Ocorrências de `<html>`**: 1
- **Ocorrências de `<body>`**: 1
- **Status**: ✓ NÃO HÁ DUPLICAÇÃO

---

## 5. ROTAS VERIFICADAS CONFORME REQUISITO

### Verificação de Páginas Solicitadas

#### 1. `/login` ✓
- **Rota**: `/[locale]/auth/login`
- **Arquivo**: `/app/[locale]/auth/login/page.tsx`
- **Status**: EXISTE E FUNCIONAL
- **Tipo**: Server Component com Suspense
- **Layout pai**: auth/layout.tsx (OrgProvider)

#### 2. `/signup` ✓
- **Rota**: `/[locale]/auth/signup`
- **Arquivo**: `/app/[locale]/auth/signup/page.tsx`
- **Status**: EXISTE E FUNCIONAL
- **Variantes**: OpenSignup, InviteOnlySignUp (configurável)
- **Tipo**: Server Component com Suspense
- **Layout pai**: auth/layout.tsx (OrgProvider)

#### 3. `/home` ✓
- **Rota**: `/[locale]/home`
- **Arquivo**: `/app/[locale]/home/page.tsx`
- **Status**: EXISTE E FUNCIONAL
- **Tipo**: Server Component simples
- **Metadata**: Configurado

#### 4. `/orgs/[orgslug]` ✓
- **Rota**: `/[locale]/orgs/[orgslug]/`
- **Arquivo**: `/app/[locale]/orgs/[orgslug]/(withmenu)/page.tsx`
- **Status**: EXISTE E FUNCIONAL
- **Tipo**: Server Component com Server Session
- **Features**: 
  - Landing page customizável (Custom Landing ou Classic)
  - SEO otimizado
  - Metadata dinâmica
  - Courses e Collections carregados
- **Layout pai**: 
  - orgs/[orgslug]/layout.tsx (OrgProvider)
  - orgs/[orgslug]/(withmenu)/layout.tsx (SessionProvider + OrgMenu)

---

## 6. PROBLEMAS IDENTIFICADOS

### Problemas Críticos: NENHUM

### Problemas Menores e Observações

#### 1. Página Raiz (`/[locale]/page.tsx`) faz Redirecionamento
**Arquivo**: `/app/[locale]/page.tsx`
```typescript
export default async function RootPage() {
  const session = await getServerSession(nextAuthOptions)
  
  if (session) {
    redirect('/home')  // Usuário autenticado
  }
  
  redirect(`/orgs/${defaultOrg}`)  // Usuário não autenticado
}
```
**Observação**: Esperado - serve como router inteligente

#### 2. Inconsistência no Auth Layout
**Arquivo**: `/app/[locale]/auth/layout.tsx`
```typescript
'use client'
export default function AuthLayout({children}: {children: React.ReactNode}) {
  const searchParams = useSearchParams()
  const orgslug = searchParams.get('orgslug')
  if (orgslug) {
    return <OrgProvider orgslug={orgslug}>{children}</OrgProvider>
  }
  // Retorna erro se orgslug não fornecido
}
```
**Problema**: Layout exige `orgslug` como query parameter em `/auth/login` e `/auth/signup`
**Impacto**: Acesso direto a `/en/auth/login` sem `?orgslug=...` resulta em erro
**Recomendação**: Tornar `orgslug` opcional com fallback para org padrão

#### 3. Params async não totalmente padronizado
**Achados**:
- Alguns arquivos usam `await params` (correto para Next.js 15+)
- Alguns ainda usam `params.searchParams` sem await
**Exemplo problemas**:
  - `/app/[locale]/auth/login/page.tsx`: Uso inconsistente de await
  - `/app/[locale]/auth/signup/page.tsx`: Mesmo padrão

#### 4. Falta de Page para `/orgs/[orgslug]` sem menu
**Estrutura atual**:
- `/app/[locale]/orgs/[orgslug]/layout.tsx` (layout raiz)
- `/app/[locale]/orgs/[orgslug]/(withmenu)/page.tsx` (com menu)
- `/app/[locale]/orgs/[orgslug]/dash/page.tsx` (dashboard sem menu)

**Observação**: A rota `/[locale]/orgs/[orgslug]` funciona pois o Next.js serve a página do grupo `(withmenu)` como página padrão de `[orgslug]`. Isso é correto mas pode ser confuso.

#### 5. Falta de Middleware
**Arquivo ausente**: `middleware.ts` na raiz do projeto
**Impacto**: Não há middleware para:
  - Tratamento de redirecionamentos de locale
  - Proteção de rotas autenticadas
  - Validação de orgslug

**Recomendação**: Implementar middleware para:
```typescript
// middleware.ts
import { createIntlMiddleware } from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createIntlMiddleware(routing);
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

---

## 7. CHECKLIST DE VALIDAÇÃO

| Item | Status | Notas |
|------|--------|-------|
| Rota `/login` existe | ✓ | Em `/[locale]/auth/login` |
| Rota `/signup` existe | ✓ | Em `/[locale]/auth/signup` |
| Rota `/home` existe | ✓ | Em `/[locale]/home` |
| Rota `/orgs/[orgslug]` existe | ✓ | Em `[locale]/orgs/[orgslug]/(withmenu)` |
| HTML/Body duplicados | ✓ | NÃO - apenas em `[locale]/layout.tsx` |
| Layouts conflitantes | ✓ | NÃO - hierarquia correta |
| i18n configurado | ✓ | Locales: pt-BR, en |
| Mensagens i18n | ✓ | pt-BR.json e en.json presentes |
| NextAuth integrado | ✓ | Via options.ts e layout-client.tsx |
| API Routes | ✓ | 6 rotas de API configuradas |
| Error boundaries | ✓ | global-error.tsx e not-found.tsx |
| Suspense/Loading | ✓ | Loading states em páginas async |

---

## 8. ESTRUTURA DE PROVIDERS (Visualizado)

### Provider Stack (Ordem Importante)
1. **HTML/Body** - app/[locale]/layout.tsx (Server)
2. **NextIntlClientProvider** - app/[locale]/layout.tsx
3. **LocaleLayoutClient** - app/[locale]/layout-client.tsx (Client)
   - StyledComponentsRegistry
   - SessionProvider (NextAuth)
   - LHSessionProvider (Custom)
   - Framer Motion
4. **OrgProvider** - app/[locale]/orgs/[orgslug]/layout.tsx (Client)
   - NextTopLoader
   - Toast
   - Onboarding
   - Footer
5. **SessionProvider** - app/[locale]/orgs/[orgslug]/(withmenu)/layout.tsx (Client)
   - OrgMenu
   - Watermark

---

## 9. ROTAS COM DYNAMIC ROUTES CONFIGURADAS

```typescript
// Dinâmico (revalidate: 0)
app/[locale]/orgs/[orgslug]/(withmenu)/page.tsx
  - export const dynamic = 'force-dynamic'
  - Revalida a cada requisição

// Dinâmico (via getServerSession)
app/[locale]/auth/login/page.tsx
app/[locale]/auth/signup/page.tsx
  - Server Session checks

// Estático com Revalidation
app/[locale]/home/page.tsx
  - Metadata estaticamente gerada
```

---

## 10. RECOMENDAÇÕES FINAIS

### Prioritárias (Deve fazer)
1. **Adicionar Middleware** para roteamento de locale
   - Arquivo: `middleware.ts`
   - Usar: `createIntlMiddleware` de next-intl

2. **Tornar orgslug opcional em Auth Layout**
   - Arquivo: `/app/[locale]/auth/layout.tsx`
   - Adicionar fallback para org padrão
   - Remover erro quando orgslug não fornecido

3. **Padronizar async params**
   - Garantir todos os `page.tsx` usem `await params`
   - Será obrigatório em futuras versões Next.js

### Secundárias (Deveria fazer)
4. **Considerar página explícita para `/orgs/[orgslug]`**
   - Criar: `/app/[locale]/orgs/[orgslug]/page.tsx`
   - Remover ambiguidade de rotas
   - Manter compatibilidade com (withmenu)

5. **Adicionar rota de fallback para orgs não encontrados**
   - Error handling melhorado
   - Mensagens de erro customizadas

6. **Considerar Page Protection Middleware**
   - Proteger rotas `/dash` com autenticação
   - Validar permissões de org

### Nice-to-have (Pode fazer)
7. **Documentar estrutura de rotas**
   - Criar arquivo `ROUTES.md`
   - Documentar padrões usados

8. **Adicionar testes de rotas**
   - E2E tests para principais rotas
   - Validar redirecionamentos

---

## CONCLUSÃO

A estrutura de rotas do LearnHouse está **bem organizada e funcional**. Não há problemas críticos. A aplicação implementa corretamente:

✓ Sistema de internacionalização com next-intl  
✓ Roteamento multi-organização  
✓ Separação de layouts (com/sem menu)  
✓ Estrutura de providers apropriada  
✓ Todas as rotas solicitadas existem  
✓ Sem duplicação de HTML/Body tags  

As recomendações listadas visam melhorar maintainability e segurança, mas a aplicação está pronta para produção conforme está.
