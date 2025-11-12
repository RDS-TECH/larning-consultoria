# 🚀 Quick Start - Deploy LearnHouse no Railway

## ⚡ Deploy em 10 Minutos - Arquitetura Multi-Serviço

### 📋 O que você vai criar

4 serviços independentes no Railway:
- **Backend (API)** - FastAPI + Python
- **Frontend (Web)** - Next.js + React
- **PostgreSQL** - Banco de dados
- **Redis** - Cache

---

## 🎯 Passo a Passo Rápido

### 1️⃣ Criar Projeto no Railway

```bash
# Via Dashboard
1. Acesse railway.app/dashboard
2. Click "New Project" → "Empty Project"
3. Nome: "learnhouse"

# OU via CLI
npm i -g @railway/cli
railway login
railway init
```

---

### 2️⃣ Adicionar Databases

**PostgreSQL:**
```
+ New → Database → Add PostgreSQL
```

**Redis:**
```
+ New → Database → Add Redis
```

✅ Aguarde ambos ficarem online (~1 minuto)

---

### 3️⃣ Deploy Backend (API)

**Adicionar Serviço:**
```
+ New → GitHub Repo → Selecione o repositório
```

**Configurar:**
- **Service Name:** `learnhouse-api`
- **Root Directory:** `apps/api`
- **Dockerfile Path:** `apps/api/Dockerfile`

**Variáveis (copie tudo):**
```bash
LEARNHOUSE_SQL_CONNECTION_STRING=${{Postgres.DATABASE_URL}}
LEARNHOUSE_REDIS_CONNECTION_STRING=${{Redis.REDIS_URL}}
LEARNHOUSE_AUTH_JWT_SECRET_KEY=MUDE_ESTE_SECRET_AQUI
LEARNHOUSE_DEVELOPMENT_MODE=false
LEARNHOUSE_INSTALL_MODE=false
RUN_MIGRATIONS=true
LEARNHOUSE_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
LEARNHOUSE_COOKIE_DOMAIN=.${{RAILWAY_PUBLIC_DOMAIN}}
LEARNHOUSE_ALLOWED_ORIGINS=*
LEARNHOUSE_CONTENT_DELIVERY_TYPE=filesystem
```

**Settings → Networking:**
- Port: `9000`
- Public Networking: ✅ ON

**Deploy!** Aguarde migrations completarem (~2-3 min)

---

### 4️⃣ Deploy Frontend (Web)

**Adicionar Serviço:**
```
+ New → GitHub Repo → Mesmo repositório
```

**Configurar:**
- **Service Name:** `learnhouse-web`
- **Root Directory:** `apps/web`
- **Dockerfile Path:** `apps/web/Dockerfile`

**Variáveis (copie tudo):**
```bash
NEXTAUTH_SECRET=GERE_SECRET_AQUI
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG=false
NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG=default
NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_LEARNHOUSE_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_LEARNHOUSE_API_URL=https://${{learnhouse-api.RAILWAY_PUBLIC_DOMAIN}}/api/v1/
NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL=https://${{learnhouse-api.RAILWAY_PUBLIC_DOMAIN}}/
LEARNHOUSE_COOKIE_DOMAIN=.${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

**Settings → Networking:**
- Port: `3000`
- Public Networking: ✅ ON

**Deploy!** Aguarde build Next.js (~5-7 min)

---

### 5️⃣ Gerar Secrets

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Copie o resultado e cole na variável `NEXTAUTH_SECRET` do frontend.

**JWT Secret (opcional, mas recomendado):**
```bash
openssl rand -base64 32
```
Copie e cole em `LEARNHOUSE_AUTH_JWT_SECRET_KEY` do backend.

**Redeploy depois de atualizar!**

---

## ✅ Verificação Rápida

### Backend (API)
```bash
# Verifique URL em: learnhouse-api → Settings → Domains
# Acesse no navegador:
https://<api-url>/docs

# Deve mostrar: FastAPI Swagger UI
```

### Frontend (Web)
```bash
# Verifique URL em: learnhouse-web → Settings → Domains
# Acesse no navegador:
https://<web-url>/

# Deve carregar: LearnHouse homepage
```

### Logs
```bash
# Verifique em cada serviço → Logs

Backend deve mostrar:
✅ "Migrations completed successfully"
✅ "Uvicorn running on..."

Frontend deve mostrar:
✅ "Ready in XXXms"
✅ "Local: http://0.0.0.0:3000"
```

---

## 🌐 Domínio Customizado (Opcional)

### Adicionar Domínio

**Frontend (URL principal):**
```
learnhouse-web → Settings → Domains → Add Domain
Digite: app.seudominio.com
```

**Backend (opcional):**
```
learnhouse-api → Settings → Domains → Add Domain
Digite: api.seudominio.com
```

### Configurar DNS

No seu provedor (Cloudflare, GoDaddy, etc):

```
Tipo: CNAME
Nome: app (ou api)
Valor: <url-fornecida-pelo-railway>
```

### Atualizar Variáveis

**Frontend:**
```bash
NEXTAUTH_URL=https://app.seudominio.com
NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN=seudominio.com
NEXT_PUBLIC_LEARNHOUSE_DOMAIN=app.seudominio.com
LEARNHOUSE_COOKIE_DOMAIN=.seudominio.com
```

**Backend:**
```bash
LEARNHOUSE_DOMAIN=api.seudominio.com
LEARNHOUSE_ALLOWED_ORIGINS=https://app.seudominio.com
```

**Redeploy ambos!**

---

## 🔧 Serviços Opcionais

### Email (Resend)

Cadastre em [resend.com](https://resend.com) e adicione no **backend**:
```bash
LEARNHOUSE_RESEND_API_KEY=re_xxxxx
LEARNHOUSE_SYSTEM_EMAIL_ADDRESS=noreply@seudominio.com
```

### Pagamentos (Stripe)

Pegue keys em [stripe.com/dashboard](https://dashboard.stripe.com) e adicione no **backend**:
```bash
LEARNHOUSE_STRIPE_SECRET_KEY=sk_live_xxxxx
LEARNHOUSE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
LEARNHOUSE_STRIPE_WEBHOOK_STANDARD_SECRET=whsec_xxxxx
```

### IA (OpenAI)

Pegue key em [platform.openai.com](https://platform.openai.com) e adicione no **backend**:
```bash
LEARNHOUSE_OPENAI_API_KEY=sk-xxxxx
LEARNHOUSE_IS_AI_ENABLED=true
```

---

## 🐛 Troubleshooting Rápido

### ❌ Backend não inicia
```
Erro: Database connection failed

Solução:
1. Aguarde PostgreSQL estar online
2. Verifique variável LEARNHOUSE_SQL_CONNECTION_STRING
3. Redeploy backend
```

### ❌ Frontend não conecta ao Backend
```
Erro: 504 Gateway Timeout ou CORS

Solução:
1. Confirme que backend está rodando
2. Verifique NEXT_PUBLIC_LEARNHOUSE_API_URL
3. Deve apontar para: https://<api-url>/api/v1/
4. Backend deve ter: LEARNHOUSE_ALLOWED_ORIGINS=*
```

### ❌ Migrations falham
```
Erro: Failed to connect to database

Solução:
1. Aguarde 2 minutos após criar PostgreSQL
2. Vá em learnhouse-api → Deploy → Redeploy
3. Verifique logs para "Migrations completed"
```

### ❌ NextAuth error
```
Erro: NEXTAUTH_SECRET must be provided

Solução:
1. Gere: openssl rand -base64 32
2. Adicione em frontend Variables
3. Redeploy frontend
```

---

## 📊 Arquitetura de Serviços

```
┌─────────────────────────────────────────┐
│         Railway Project                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐   ┌─────────────┐    │
│  │ PostgreSQL  │   │    Redis    │    │
│  │  (Database) │   │   (Cache)   │    │
│  └──────┬──────┘   └──────┬──────┘    │
│         │                 │            │
│         ▼                 ▼            │
│  ┌─────────────────────────────┐      │
│  │   Backend (learnhouse-api)  │      │
│  │   FastAPI - Port 9000       │◄──┐  │
│  │   https://api-xxx.up.railway│   │  │
│  └─────────────┬───────────────┘   │  │
│                │                   │  │
│                │ API Calls         │  │
│                ▼                   │  │
│  ┌─────────────────────────────┐  │  │
│  │  Frontend (learnhouse-web)  │  │  │
│  │   Next.js - Port 3000       │──┘  │
│  │   https://web-xxx.up.railway│     │
│  └─────────────────────────────┘     │
│                                       │
└───────────────────────────────────────┘
         │
         ▼
    👤 Usuários
```

---

## 📁 Arquivos do Projeto

```
learnhouse/
├── apps/
│   ├── api/
│   │   ├── Dockerfile          ← Usado pelo Railway
│   │   ├── nixpacks.toml       ← Config build
│   │   ├── railway-migrate.sh  ← Script migrations
│   │   └── app.py              ← Entry point
│   └── web/
│       ├── Dockerfile          ← Usado pelo Railway
│       ├── nixpacks.toml       ← Config build
│       └── package.json        ← Dependencies
├── railway.json                ← Config global
├── RAILWAY_DEPLOY.md          ← Guia completo
└── RAILWAY_QUICK_START.md     ← Este arquivo
```

---

## 💰 Custos Estimados

**Railway - Hobby Plan ($5/mês):**
- 500 horas de execução
- Adequado para: testes, projetos pequenos

**Estimativa LearnHouse:**
- Backend: ~$8/mês
- Frontend: ~$4/mês
- **Total: ~$12-15/mês**

**Railway - Pro Plan ($20/mês + uso):**
- Execução ilimitada
- Recomendado para produção

---

## 📚 Próximos Passos

1. ✅ **Configure domínio customizado**
2. ✅ **Adicione serviços opcionais** (email, pagamentos, IA)
3. ✅ **Configure S3 para uploads** (em vez de filesystem)
4. ✅ **Configure monitoring** (Logfire ou outro)
5. ✅ **Teste funcionalidades** (registro, login, cursos)

---

## 🆘 Precisa de Ajuda?

**Documentação Completa:**
- Leia: `RAILWAY_DEPLOY.md`

**Variáveis de Ambiente:**
- Veja: `.env.railway.example`

**Suporte Railway:**
- Docs: [docs.railway.app](https://docs.railway.app/)
- Discord: [discord.gg/railway](https://discord.gg/railway)

**Suporte LearnHouse:**
- GitHub: [github.com/learnhouse/learnhouse](https://github.com/learnhouse/learnhouse)
- Issues: [github.com/learnhouse/learnhouse/issues](https://github.com/learnhouse/learnhouse/issues)

---

## ✅ Checklist Rápido

- [ ] PostgreSQL criado
- [ ] Redis criado
- [ ] Backend deployed (migrations OK)
- [ ] Frontend deployed (build OK)
- [ ] NEXTAUTH_SECRET gerado
- [ ] Frontend acessível via browser
- [ ] API docs acessível (/docs)
- [ ] Login funcionando
- [ ] (Opcional) Domínio configurado
- [ ] (Opcional) Email configurado
- [ ] (Opcional) Pagamentos configurados

---

**Pronto! LearnHouse no ar! 🎉**

**Sua URL do Frontend:**
```
https://<seu-projeto>.up.railway.app
```

**Primeira ação:** Acesse e crie sua conta de admin!
