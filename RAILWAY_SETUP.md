# Configuração do Railway - LearnHouse

Guia completo para deploy do LearnHouse no Railway.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         Railway                             │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────────┐│
│  │   Frontend   │────▶│   Backend    │───▶│  PostgreSQL  ││
│  │   (Next.js)  │     │   (FastAPI)  │    │              ││
│  │              │     │              │    │              ││
│  │ Port: 3000   │     │ Port: 8000   │    │ Port: 5432   ││
│  └──────────────┘     └──────────────┘    └──────────────┘│
│         │                     │                    │        │
│         │                     └───────────────────▶│        │
│         │                          Redis           │        │
│         │                     ┌──────────────┐     │        │
│         └────────────────────▶│    Redis     │◀────┘        │
│                               │              │              │
│                               │ Port: 6379   │              │
│                               └──────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Serviços Necessários

1. **Frontend** (Next.js)
2. **Backend** (FastAPI)
3. **PostgreSQL** (Database)
4. **Redis** (Cache/Sessions)

---

## ⚙️ Configuração de Variáveis de Ambiente

### 1️⃣ **Backend (FastAPI)**

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_URL=redis://default:password@host:port

# Security
JWT_SECRET_KEY=seu-secret-key-aqui-mude-para-producao
AUTH_JWT_SECRET_KEY=seu-auth-secret-key-aqui-mude-para-producao

# Installation (desabilitar após primeira instalação)
INSTALL_MODE=false

# Development (desabilitar em produção)
DEVELOPMENT_MODE=false

# OpenAI (opcional)
OPENAI_API_KEY=sk-...

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Email (opcional - Resend)
RESEND_API_KEY=re_...

# AWS S3 (opcional)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=...
AWS_REGION=us-east-1
```

### 2️⃣ **Frontend (Next.js)**

⚠️ **IMPORTANTE**: Estas variáveis precisam ser configuradas como **variáveis de ambiente E build args** no Railway.

```bash
# API URLs (ajustar com suas URLs do Railway)
NEXT_PUBLIC_LEARNHOUSE_API_URL=https://seu-backend.up.railway.app/api/v1/
NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL=https://seu-backend.up.railway.app

# Domain
NEXT_PUBLIC_LEARNHOUSE_DOMAIN=seu-frontend.up.railway.app

# Protocol
NEXT_PUBLIC_LEARNHOUSE_HTTPS=true

# Organization
NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG=default

# Multi-org mode (single tenant por padrão)
NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG=false

# Top domain (apenas se multi-org = true)
# NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN=suaempresa.com
```

---

## 🚀 Passo a Passo do Deploy

### **Passo 1: Criar Projeto no Railway**

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Conecte seu repositório

### **Passo 2: Adicionar PostgreSQL**

1. No projeto, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde a criação
4. Copie a `DATABASE_URL` das variáveis

### **Passo 3: Adicionar Redis**

1. No projeto, clique em "+ New"
2. Selecione "Database" → "Redis"
3. Aguarde a criação
4. Copie a `REDIS_URL` das variáveis

### **Passo 4: Configurar Backend (API)**

1. Clique no serviço do Backend
2. Vá em "Variables"
3. Adicione todas as variáveis do Backend (seção 1️⃣)
4. Cole a `DATABASE_URL` e `REDIS_URL` que você copiou
5. Gere secrets para `JWT_SECRET_KEY` e `AUTH_JWT_SECRET_KEY`:
   ```bash
   # No seu terminal local
   openssl rand -base64 32
   ```

### **Passo 5: Configurar Frontend (Web)**

1. Clique no serviço do Frontend
2. Vá em "Variables"
3. Adicione todas as variáveis do Frontend (seção 2️⃣)
4. **IMPORTANTE**: Atualize as URLs com suas URLs do Railway:
   - `NEXT_PUBLIC_LEARNHOUSE_API_URL` → URL do backend + `/api/v1/`
   - `NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL` → URL do backend
   - `NEXT_PUBLIC_LEARNHOUSE_DOMAIN` → URL do frontend

### **Passo 6: Executar Instalação Inicial**

Após o primeiro deploy bem-sucedido:

1. Clique no serviço do **Backend**
2. Abra o terminal/shell
3. Execute:
   ```bash
   python cli.py install --short
   ```
4. **COPIE A SENHA** gerada!
   ```
   Login with the following credentials:
   email: admin@school.dev
   password: XXXXXXXX  ← COPIE ESTA SENHA!
   ```

5. Desabilite o modo de instalação:
   - Vá em "Variables" do backend
   - Mude `INSTALL_MODE=false`
   - Redeploy

### **Passo 7: Testar Acesso**

1. Acesse a URL do frontend: `https://seu-frontend.up.railway.app`
2. Faça login com:
   - Email: `admin@school.dev`
   - Senha: (a que você copiou)
3. **Troque a senha imediatamente!**

---

## 🔧 Troubleshooting

### **Erro: 404 nas rotas `/collections` e `/courses`**

**Causa:** Variáveis de ambiente do frontend não foram configuradas corretamente.

**Solução:**
1. Verifique se `NEXT_PUBLIC_LEARNHOUSE_API_URL` está correto
2. Certifique-se que termina com `/`
3. Exemplo correto: `https://learnhouse-api.up.railway.app/api/v1/`

### **Erro: `ERR_BLOCKED_BY_CLIENT` (Umami)**

**Causa:** Bloqueado por AdBlock.

**Solução:** Pode ignorar, não afeta funcionalidade.

### **Erro: Build falha com "Module not found"**

**Causa:** Dependência faltando.

**Solução:** Verifique se adicionou `@radix-ui/react-visually-hidden` ao `package.json`.

### **Erro: "Database connection failed"**

**Causa:** `DATABASE_URL` incorreta.

**Solução:**
1. Copie a `DATABASE_URL` correta do serviço PostgreSQL
2. Cole no backend
3. Redeploy

### **Erro: "OpenAI API key not configured"**

**Causa:** Feature de IA não configurada.

**Solução:**
- Se não usar IA, ignore o erro
- Se usar, adicione `OPENAI_API_KEY` nas variáveis do backend

---

## 📝 Checklist de Deploy

- [ ] PostgreSQL criado
- [ ] Redis criado
- [ ] Backend com todas variáveis configuradas
- [ ] Frontend com todas variáveis configuradas
- [ ] URLs do frontend apontando para backend correto
- [ ] Instalação inicial executada (`python cli.py install --short`)
- [ ] Senha do admin copiada
- [ ] `INSTALL_MODE=false` após instalação
- [ ] Login funcionando
- [ ] Senha trocada após primeiro login

---

## 🔐 Resetar Senha do Admin

Se esquecer a senha:

```bash
# Via Railway Shell (Backend)
railway shell -s api
python scripts/reset_admin_password.py "NovaSenha123"

# Ou via SQL
railway run psql $DATABASE_URL
UPDATE users SET password = '...' WHERE email = 'admin@school.dev';
```

Veja `apps/api/scripts/README.md` para mais detalhes.

---

## 📚 Links Úteis

- [Railway Docs](https://docs.railway.app)
- [LearnHouse Docs](https://github.com/learnhouse/learnhouse)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [FastAPI Docs](https://fastapi.tiangolo.com)
