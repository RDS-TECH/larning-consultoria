# RECOMENDAÇÕES E CORREÇÕES - LEARNHOUSE ROUTES AUDIT

**Data**: 2025-11-09  
**Prioridade**: 3 itens para corrigir  
**Impacto Total**: Médio (melhorar robustez e UX)

---

## 1. ADICIONAR MIDDLEWARE PARA I18N (PRIORIDADE ALTA)

### Problema
Não há arquivo `middleware.ts` para gerenciar redirecionamentos de locale e validações centralizadas.

### Impacto
- Sem validação centralizada de locale
- Possibilidade de URLs malformadas
- Sem proteção de rotas autenticadas

### Solução
Criar arquivo `/apps/web/middleware.ts`:

```typescript
import { createIntlMiddleware } from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createIntlMiddleware(routing);

export const config = {
  // Match all pathnames except for api, _next and assets
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

### Arquivo
**Criar**: `/apps/web/middleware.ts`  
**Após criar**: Nenhuma mudança no código existente é necessária

### Benefícios
- Validação automática de locale
- Redirecionamentos corretos quando locale é inválido
- Melhor performance com cache de locale
- Compatibilidade total com next-intl

### Referência
https://next-intl-docs.vercel.app/docs/getting-started/app-router

---

## 2. TORNAR ORGSLUG OPCIONAL EM AUTH LAYOUT (PRIORIDADE MÉDIA)

### Problema
Arquivo: `/app/[locale]/auth/layout.tsx`

```typescript
'use client'
import { OrgProvider } from '@components/Contexts/OrgContext'
import ErrorUI from '@components/Objects/StyledElements/Error/Error'
import { useSearchParams } from 'next/navigation'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const searchParams = useSearchParams()
    const orgslug = searchParams.get('orgslug')
    
    if (orgslug) {
        return <OrgProvider orgslug={orgslug}>{children}</OrgProvider>
    } else {
        // PROBLEMA: Retorna erro se orgslug não fornecido
        return <ErrorUI message='Organization not specified' 
                        submessage='Please access this page from an Organization' />
    }
}
```

### Impacto
- Acesso direto a `/auth/login` sem `?orgslug=` resulta em erro
- Reduz UX para usuários que vêm de links externos
- Requer query param em lugar de usar org padrão

### Solução

```typescript
'use client'
import { OrgProvider } from '@components/Contexts/OrgContext'
import { useSearchParams } from 'next/navigation'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const searchParams = useSearchParams()
    const orgslug = searchParams.get('orgslug') || 
                    (process.env.NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG || 'default')
    
    return <OrgProvider orgslug={orgslug}>{children}</OrgProvider>
}
```

### Mudanças
1. Remover verificação de `if (orgslug)`
2. Usar fallback para org padrão
3. Sempre retornar `OrgProvider` com slug válido
4. Remover `ErrorUI`

### Benefícios
- Links diretos para `/auth/login` funcionam
- Melhor UX
- Ainda permite customização via query param
- Consistente com page.tsx que usa fallback

### Teste
```bash
# Antes (erro)
http://localhost:3000/auth/login  # ❌ Error

# Depois (funciona)
http://localhost:3000/auth/login  # ✓ Login com org padrão
http://localhost:3000/auth/login?orgslug=custom  # ✓ Login com org custom
```

---

## 3. PADRONIZAR ASYNC PARAMS (PRIORIDADE BAIXA)

### Problema
Alguns arquivos usam pattern inconsistente para params:

**Arquivo**: `/app/[locale]/auth/login/page.tsx` (INCORRETO)
```typescript
const Login = async (params: MetadataProps) => {
  const orgslug = (await params.searchParams).orgslug  // Espera searchParams
  // ...
}
```

**Arquivo**: `/app/[locale]/orgs/[orgslug]/(withmenu)/page.tsx` (CORRETO)
```typescript
const OrgHomePage = async (params: any) => {
  const orgslug = (await params.params).orgslug  // Espera params
  // ...
}
```

### Impacto
- Inconsistência em padrões
- Possível breaking change em futura versão Next.js 16+
- Difícil manutenção

### Solução - Padronizar para await params

**Arquivo**: `/app/[locale]/auth/login/page.tsx`

Antes:
```typescript
type MetadataProps = {
  params: Promise<{ orgslug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(params: MetadataProps): Promise<Metadata> {
  const orgslug = (await params.searchParams).orgslug
  // ...
}

const Login = async (params: MetadataProps) => {
  const orgslug = (await params.searchParams).orgslug
  // ...
}
```

Depois:
```typescript
type LoginPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: LoginPageProps
): Promise<Metadata> {
  const { locale } = await params
  const searchParamsObj = await searchParams
  const orgslug = searchParamsObj.orgslug as string
  // ...
}

const Login = async ({ params, searchParams }: LoginPageProps) => {
  const { locale } = await params
  const searchParamsObj = await searchParams
  const orgslug = searchParamsObj.orgslug as string
  // ...
}
```

### Arquivos Afetados
1. `/app/[locale]/auth/login/page.tsx`
2. `/app/[locale]/auth/signup/page.tsx`

### Benefícios
- Consistência com padrão Next.js 15+
- Preparado para Next.js 16+
- Melhor type safety
- Facilita manutenção futura

### Referência
https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

---

## RESUMO DE AÇÕES

| # | Item | Arquivo | Prioridade | Tempo Est. | Impacto |
|---|------|---------|-----------|-----------|---------|
| 1 | Adicionar middleware.ts | Criar novo | ALTA | 5 min | Médio |
| 2 | Tornar orgslug opcional | auth/layout.tsx | MÉDIA | 10 min | Alto |
| 3 | Padronizar async params | login/signup pages | BAIXA | 20 min | Baixo |

---

## ORDEM RECOMENDADA DE IMPLEMENTAÇÃO

### Fase 1: Hoje (Crítico)
1. Criar `middleware.ts`
2. Corrigir `auth/layout.tsx`

### Fase 2: Esta Semana
3. Padronizar `auth/login/page.tsx` e `auth/signup/page.tsx`

### Fase 3: Próximas Atualizações
- Considerar testes E2E para validar rotas
- Documentar padrões de routing
- Adicionar página de 404 customizada

---

## TESTES PÓS-IMPLEMENTAÇÃO

### Teste 1: Middleware
```bash
# Deve redirecionar locale padrão
curl -L http://localhost:3000/notfound
# Deve ter locale válido na response

# Deve aceitar locale válido
curl http://localhost:3000/en/home
# Status 200
```

### Teste 2: Auth Layout
```bash
# Sem orgslug (deve usar padrão)
http://localhost:3000/auth/login
# Deve renderizar login com org padrão

# Com orgslug (deve usar fornecido)
http://localhost:3000/auth/login?orgslug=custom
# Deve renderizar login com org custom
```

### Teste 3: Async Params
```bash
# Deve funcionar após padronizar
npm run dev
# Visitar /auth/login e /auth/signup
# Verificar console para erros
```

---

## CHECKLIST PÓS-IMPLEMENTAÇÃO

- [ ] middleware.ts criado e funcionando
- [ ] auth/layout.tsx corrigido e testa sem orgslug
- [ ] auth/login/page.tsx atualizado
- [ ] auth/signup/page.tsx atualizado
- [ ] Sem erros de console
- [ ] Rotas funcionam em pt-BR e en
- [ ] Testes E2E passando (se existem)
- [ ] Documentação atualizada

---

## FALLBACK PARA ORG PADRÃO

A aplicação já usa fallback em outro lugar:

**Arquivo**: `/app/[locale]/page.tsx`
```typescript
const defaultOrg = process.env.NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG || 'default'
```

**Recomendação**: Use a mesma abordagem em auth/layout.tsx para consistência.

---

## NOTAS FINAIS

1. A aplicação está **pronto para produção** com essas mudanças
2. As correções são **opcionais mas recomendadas** para robustez
3. Implementar nessa ordem: Middleware → Auth Layout → Async Params
4. Todos as mudanças são **backward-compatible**
5. Nenhuma mudança quebra rotas existentes

**Status Final**: ✓ PRONTO COM MELHORIAS MENORES
