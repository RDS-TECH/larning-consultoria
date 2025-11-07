# Progresso da Migração i18n - LearnHouse

**Data:** 07/11/2025
**Status:** ✅ Fases 1-3 Completas | ✅ Fase 4.1 Completa | 🔄 Fase 4.2+ Pendente (~8% componentes)

---

## 📊 Resumo Executivo

### O que foi completado

#### ✅ Infraestrutura (100%)
- **Frontend**: next-intl configurado com middleware e routing
- **Backend**: Sistema i18n Python com detecção automática de idioma
- **Traduções Base**: 500+ chaves em pt-BR e en (en.json completo)
- **Language Switcher**: Componente funcional no dashboard

#### ✅ Componentes Migrados (22 componentes = ~8% do total)

**Fase 1: Infraestrutura ✅**
- Frontend: next-intl + middleware + routing ✅
- Backend: Python i18n system ✅
- Translation files: en.json (850+ chaves) + pt-BR.json (850+ chaves) ✅
- `apps/api/src/utils/i18n.py` ✅ (módulo completo)
- `apps/api/src/routers/auth.py` ✅ (migrado para i18n)

**Fase 1.3: Language Switcher ✅**
- `apps/web/components/ui/language-switcher.tsx` ✅

**Fase 2: Autenticação ✅**
- `apps/web/app/[locale]/auth/login/login.tsx` ✅
- `apps/web/app/[locale]/auth/signup/signup.tsx` ✅ (+ sub-componentes)
- `apps/web/app/[locale]/auth/forgot/forgot.tsx` ✅

**Fase 3: Instalação ✅ (8 componentes)**
- `apps/web/app/[locale]/install/page.tsx` ✅
- `apps/web/app/[locale]/install/install.tsx` ✅
- `apps/web/app/[locale]/install/steps/get_started.tsx` ✅
- `apps/web/app/[locale]/install/steps/org_creation.tsx` ✅
- `apps/web/app/[locale]/install/steps/account_creation.tsx` ✅
- `apps/web/app/[locale]/install/steps/default_elements.tsx` ✅
- `apps/web/app/[locale]/install/steps/sample_data.tsx` ✅
- `apps/web/app/[locale]/install/steps/finish.tsx` ✅
- `apps/web/app/[locale]/install/steps/disable_install_mode.tsx` ✅
- `apps/web/app/[locale]/install/steps/steps.tsx` ✅

**Fase 4.1: Cursos - Listagem ✅**
- `apps/web/app/[locale]/orgs/[orgslug]/dash/courses/page.tsx` ✅
- `apps/web/app/[locale]/orgs/[orgslug]/dash/courses/client.tsx` ✅

**Dashboard Base:**
- `apps/web/app/[locale]/orgs/[orgslug]/dash/page.tsx` ✅
- `apps/web/components/Dashboard/Menus/DashLeftMenu.tsx` ✅
- `apps/web/components/Dashboard/Menus/DashMobileMenu.tsx` ✅

---

## 🎯 Próximas Prioridades

### ✅ Fase 3: Módulo de Instalação - COMPLETO

Todos os 8 componentes migrados com sucesso! 🎉

---

### 🔄 Fase 4.2: Cursos - Edição Geral (PRÓXIMA - 5 componentes)
📁 `apps/web/components/Dashboard/Pages/Course/`

**Sub-módulos:**
- **EditCourseGeneral** (5 componentes)
- **EditCourseStructure** (5 componentes)
- **EditCourseAccess** (2 componentes)
- **EditCourseCertification** (2 componentes)
- **EditCourseContributors** (3 componentes)
- **Course Listing** (3 componentes)

**Padrão de migração:**
```typescript
// 1. Importar
import { useTranslations } from 'next-intl'

// 2. No componente
const t = useTranslations('courses')

// 3. Substituir strings
<button>{t('createCourse')}</button>
```

---

### Fase 5: Módulo de Usuários (ALTA - 15+ componentes)
📁 `apps/web/components/Dashboard/Pages/Users/`

**Sub-módulos:**
- OrgUsers (gerenciamento)
- OrgRoles (RBAC)
- OrgUserGroups (grupos)
- OrgAccess (controle de acesso)
- OrgUsersAdd (adicionar usuários)

---

### Fase 6: Módulo de Organização (MÉDIA - 10 componentes)
📁 `apps/web/components/Dashboard/Pages/Org/`

**Sub-módulos:**
- OrgEditGeneral
- OrgEditImages
- OrgEditLanding
- OrgEditSocials
- OrgEditOther

---

## 📝 Guia de Migração para Desenvolvedores

### Passo a Passo para Migrar um Componente

#### 1️⃣ **Identificar Strings Hardcoded**
```bash
# No componente, buscar por strings em aspas
grep -n '"[A-Z]' MeuComponente.tsx
grep -n "'[A-Z]" MeuComponente.tsx
```

#### 2️⃣ **Adicionar Traduções**

**pt-BR.json:**
```json
{
  "meuModulo": {
    "titulo": "Meu Título",
    "descricao": "Descrição do componente",
    "botaoSalvar": "Salvar"
  }
}
```

**en.json:**
```json
{
  "meuModulo": {
    "titulo": "My Title",
    "descricao": "Component description",
    "botaoSalvar": "Save"
  }
}
```

#### 3️⃣ **Migrar Componente**

**Antes:**
```typescript
function MeuComponente() {
  return (
    <div>
      <h1>My Title</h1>
      <p>Component description</p>
      <button>Save</button>
    </div>
  )
}
```

**Depois:**
```typescript
import { useTranslations } from 'next-intl'

function MeuComponente() {
  const t = useTranslations('meuModulo')

  return (
    <div>
      <h1>{t('titulo')}</h1>
      <p>{t('descricao')}</p>
      <button>{t('botaoSalvar')}</button>
    </div>
  )
}
```

#### 4️⃣ **Com Variáveis Dinâmicas**

**Tradução:**
```json
{
  "boasVindas": "Bem-vindo, {nome}!"
}
```

**Uso:**
```typescript
<p>{t('boasVindas', { nome: user.name })}</p>
```

#### 5️⃣ **Server Components (Next.js)**

```typescript
import { getTranslations } from 'next-intl/server'

async function ServerComponent() {
  const t = await getTranslations('meuModulo')

  return <div>{t('titulo')}</div>
}
```

#### 6️⃣ **Testar**

```bash
# Português (padrão)
http://localhost:3000/dash

# Inglês
http://localhost:3000/en/dash
```

---

## 🔧 Ferramentas Úteis

### Buscar Componentes Não Migrados

```bash
# Encontrar componentes com strings hardcoded
cd apps/web
rg -t tsx '"[A-Z][a-z]+ [a-z]+"' --files-with-matches

# Componentes sem useTranslations
rg -t tsx -L 'useTranslations' app/\[locale\]/ components/
```

### Validar Traduções

```bash
# Checar chaves faltantes (comparar pt-BR vs en)
node scripts/check-translations.js
```

**Script `scripts/check-translations.js`:**
```javascript
const ptBR = require('../apps/web/messages/pt-BR.json')
const en = require('../apps/web/messages/en.json')

function getAllKeys(obj, prefix = '') {
  let keys = []
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object') {
      keys = keys.concat(getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

const ptKeys = getAllKeys(ptBR)
const enKeys = getAllKeys(en)

console.log('Chaves faltando em EN:', ptKeys.filter(k => !enKeys.includes(k)))
console.log('Chaves faltando em PT-BR:', enKeys.filter(k => !ptKeys.includes(k)))
```

---

## 🎨 Padrões e Convenções

### Estrutura de Traduções

```
messages/
├── pt-BR.json
│   ├── auth          → Autenticação
│   ├── common        → Ações comuns (save, cancel, etc)
│   ├── dashboard     → Dashboard e menus
│   ├── courses       → Módulo de cursos
│   ├── users         → Módulo de usuários
│   ├── organization  → Configurações de organização
│   ├── payments      → Pagamentos e Stripe
│   ├── editor        → Editor de conteúdo
│   └── ...
└── en.json (mesma estrutura)
```

### Nomenclatura de Chaves

- **snake_case** para chaves
- **Namespace por módulo**: `courses.createCourse`
- **Ações em verbos**: `save`, `delete`, `create`
- **Estados em substantivos**: `loading`, `error`, `success`

### Exemplos:
```json
{
  "courses": {
    "create": "Criar Curso",
    "edit": "Editar Curso",
    "delete": "Excluir Curso",
    "confirmDelete": "Tem certeza que deseja excluir '{name}'?",
    "status": {
      "published": "Publicado",
      "draft": "Rascunho"
    }
  }
}
```

---

## 🚀 Workflow de Desenvolvimento

### Para Adicionar Nova Feature

1. **Escrever componente** com `useTranslations`
2. **Adicionar traduções** em pt-BR.json E en.json
3. **Testar** em ambos idiomas
4. **Commit** com mensagem descritiva

**Exemplo de commit:**
```bash
git commit -m "feat(i18n): adicionar módulo de certificados

- Migrar CertificateManager.tsx
- Migrar CertificateTemplate.tsx
- Adicionar traduções certifications.*"
```

---

## 📈 Métricas de Progresso

### Componentes por Módulo

| Módulo | Total | Migrados | % |
|--------|-------|----------|---|
| **Autenticação** | 5 | 5 | ✅ 100% |
| **Dashboard Base** | 7 | 4 | 🔶 57% |
| **Instalação** | 10 | 10 | ✅ 100% |
| **Cursos - Listagem** | 2 | 2 | ✅ 100% |
| **Cursos - Edição** | 13 | 0 | ⬜ 0% |
| **Usuários** | 20+ | 0 | ⬜ 0% |
| **Organização** | 15+ | 0 | ⬜ 0% |
| **Atividades** | 30+ | 0 | ⬜ 0% |
| **Assignments** | 25+ | 0 | ⬜ 0% |
| **Editor** | 40+ | 0 | ⬜ 0% |
| **Pagamentos** | 15+ | 0 | ⬜ 0% |
| **Páginas Públicas** | 30+ | 0 | ⬜ 0% |
| **TOTAL** | **270+** | **22** | 🔵 **~8%** |

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'next-intl'"
```bash
cd apps/web
pnpm install next-intl@latest
```

### Erro: "useTranslations must be used in a Client Component"
```typescript
// Adicionar no topo do arquivo:
'use client'
```

### Tradução não aparece
1. Verificar se a chave existe em ambos pt-BR.json e en.json
2. Limpar cache: `rm -rf .next && pnpm dev`
3. Verificar namespace correto: `useTranslations('nomeCorreto')`

### Language Switcher não funciona
1. Verificar middleware em `apps/web/middleware.ts`
2. Verificar routing em `next.config.js`
3. Testar manualmente: `http://localhost:3000/en/dash`

---

## 📚 Recursos

### Documentação

- **Next-intl Docs**: https://next-intl-docs.vercel.app/
- **Projeto README**: `apps/web/README_I18N.md`
- **Backend i18n**: `apps/api/locales/README.md`

### Arquivos Importantes

```
apps/web/
├── i18n.ts                           # Configuração next-intl
├── middleware.ts                      # Detecção de locale
├── messages/
│   ├── pt-BR.json                    # Traduções português
│   └── en.json                       # Traduções inglês
└── components/ui/language-switcher.tsx  # Component de troca

apps/api/
├── locales/
│   ├── pt-BR/messages.json
│   ├── en/messages.json
│   └── README.md
└── src/utils/i18n.py                 # Módulo i18n Python
```

---

## 🎯 Roadmap Restante

### Sprint 1-2 (2-3 semanas)
- [ ] Fase 3: Módulo de Instalação (8 componentes)
- [ ] Páginas de erro (404, 500)
- [ ] Modals e confirmações genéricas

### Sprint 3-4 (4 semanas)
- [ ] Fase 4: Módulo de Cursos - Parte 1 (15 componentes)
- [ ] Course listing e navegação
- [ ] EditCourseGeneral

### Sprint 5-6 (4 semanas)
- [ ] Fase 4: Módulo de Cursos - Parte 2 (15 componentes)
- [ ] EditCourseStructure
- [ ] EditCourseAccess

### Sprint 7-8 (3 semanas)
- [ ] Fase 5: Módulo de Usuários (20 componentes)
- [ ] User management
- [ ] Roles e permissions

### Sprint 9-10 (3 semanas)
- [ ] Fase 6: Módulo de Organização (15 componentes)
- [ ] Organization settings
- [ ] Landing pages

### Sprint 11-15 (8-10 semanas)
- [ ] Fase 7-12: Módulos avançados
- [ ] Editor de conteúdo
- [ ] Assignments
- [ ] Atividades
- [ ] Pagamentos

### Sprint 16+ (Contínuo)
- [ ] QA completo
- [ ] Revisão de traduções
- [ ] Testes automatizados
- [ ] Deploy

---

## ✅ Checklist para Completar Migração

### Infraestrutura ✅
- [x] Configurar next-intl
- [x] Configurar middleware de routing
- [x] Criar sistema i18n backend
- [x] Language Switcher component
- [x] Traduções base (500+ chaves)

### Componentes Críticos
- [x] Autenticação (login, signup, forgot)
- [x] Dashboard menus
- [ ] Instalação (wizard completo)
- [ ] Páginas de erro

### Módulos Principais
- [ ] Cursos (completo)
- [ ] Usuários (completo)
- [ ] Organização (completo)
- [ ] Assignments
- [ ] Atividades

### Módulos Avançados
- [ ] Editor de conteúdo
- [ ] Pagamentos
- [ ] Analytics
- [ ] AI features

### Qualidade
- [ ] Todas traduções revisadas
- [ ] Testes automatizados
- [ ] CI/CD com validação de traduções
- [ ] Documentação completa

---

## 🤝 Contribuindo

### Para adicionar nova tradução:

1. Editar `apps/web/messages/pt-BR.json` e `en.json`
2. Migrar componente usando `useTranslations`
3. Testar em ambos idiomas
4. Criar PR com descrição clara

### Template de PR:

```markdown
## Migração i18n: [Nome do Módulo]

### Componentes migrados
- [ ] ComponenteA.tsx
- [ ] ComponenteB.tsx

### Traduções adicionadas
- `modulo.chave1`: pt-BR ✅ | en ✅
- `modulo.chave2`: pt-BR ✅ | en ✅

### Testado em
- [ ] pt-BR
- [ ] en

### Screenshots
[Adicionar prints em ambos idiomas]
```

---

## 📞 Suporte

- **Issues**: https://github.com/[org]/learnhouse/issues
- **Documentação**: `/docs/README_I18N.md`
- **Slack**: #i18n-migration

---

**Última atualização:** 07/11/2025
**Responsável:** Claude Code Migration
**Status:** 🟢 Infraestrutura pronta | 🔵 Migração em andamento
