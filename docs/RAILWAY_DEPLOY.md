# Deploy LearnHouse no Railway - Arquitetura Multi-Serviço

Este guia fornece instruções detalhadas para fazer deploy do LearnHouse na plataforma Railway usando arquitetura de múltiplos serviços separados.

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app/)
- CLI do Railway instalado (opcional): `npm i -g @railway/cli`
- Repositório Git conectado ao Railway

## 🏗️ Arquitetura do Deploy

O LearnHouse é composto por **4 serviços independentes**:

1. **Backend (API)** - FastAPI (Python) - Porta 9000
2. **Frontend (Web)** - Next.js - Porta 3000
3. **PostgreSQL** - Banco de dados
4. **Redis** - Cache e sessões

## 🚀 Passo a Passo Completo

### 1. Criar Novo Projeto no Railway

#### Opção A: Via Dashboard (Recomendado)

1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Clique em "New Project"
3. Selecione "Empty Project"
4. Nomeie o projeto: "learnhouse"

#### Opção B: Via CLI

```bash
npm i -g @railway/cli
railway login
railway init
```

---

### 2. Adicionar Banco de Dados PostgreSQL

1. No projeto, clique em "+ New"
2. Selecione "Database" → "Add PostgreSQL"
3. Anote o nome do serviço (geralmente "Postgres")
4. A variável `DATABASE_URL` será gerada automaticamente

**Configuração:**
- **Name:** Postgres
- **Região:** Escolha mais próxima aos usuários

---

### 3. Adicionar Redis

1. Clique em "+ New"
2. Selecione "Database" → "Add Redis"
3. Anote o nome do serviço (geralmente "Redis")
4. A variável `REDIS_URL` será gerada automaticamente

**Configuração:**
- **Name:** Redis
- **Região:** Mesma do PostgreSQL

---

### 4. Adicionar Backend (API)

1. Clique em "+ New"
2. Selecione "GitHub Repo"
3. Escolha o repositório do LearnHouse
4. Configure:

**Settings → General:**
- **Service Name:** learnhouse-api
- **Root Directory:** `apps/api`
- **Build Command:** (deixe vazio - usa nixpacks.toml)
- **Start Command:** `uv run app.py`

**Settings → Deploy:**
- **Custom Build Path:** `apps/api/Dockerfile`
- **Use Dockerfile:** ✅ Habilitado

**Settings → Networking:**
- **Port:** 9000
- **Public Networking:** ✅ Habilitado (gera URL pública)

#### Variáveis de Ambiente - API

Vá em **Variables** e adicione:

```bash
# Database & Cache
LEARNHOUSE_SQL_CONNECTION_STRING=${{Postgres.DATABASE_URL}}
LEARNHOUSE_REDIS_CONNECTION_STRING=${{Redis.REDIS_URL}}

# Security
LEARNHOUSE_AUTH_JWT_SECRET_KEY=<gere-secret-seguro>

# Configuration
LEARNHOUSE_DEVELOPMENT_MODE=false
LEARNHOUSE_INSTALL_MODE=false

# Migrations
RUN_MIGRATIONS=true

# Domain (será atualizado depois)
LEARNHOUSE_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
LEARNHOUSE_COOKIE_DOMAIN=.${{RAILWAY_PUBLIC_DOMAIN}}

# CORS - Aceita todas as origens durante setup
LEARNHOUSE_ALLOWED_ORIGINS=*

# Content Delivery
LEARNHOUSE_CONTENT_DELIVERY_TYPE=filesystem
```

**Variáveis Opcionais:**

```bash
# Email (Resend)
LEARNHOUSE_RESEND_API_KEY=re_xxxxx
LEARNHOUSE_SYSTEM_EMAIL_ADDRESS=noreply@seudominio.com

# Payments (Stripe)
LEARNHOUSE_STRIPE_SECRET_KEY=sk_live_xxxxx
LEARNHOUSE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
LEARNHOUSE_STRIPE_WEBHOOK_STANDARD_SECRET=whsec_xxxxx

# AI (OpenAI)
LEARNHOUSE_OPENAI_API_KEY=sk-xxxxx
LEARNHOUSE_IS_AI_ENABLED=true

# Monitoring
LEARNHOUSE_LOGFIRE_ENABLED=false
```

---

### 5. Adicionar Frontend (Web)

1. Clique em "+ New"
2. Selecione "GitHub Repo"
3. Escolha o mesmo repositório
4. Configure:

**Settings → General:**
- **Service Name:** learnhouse-web
- **Root Directory:** `apps/web`
- **Build Command:** `pnpm run build`
- **Start Command:** `node server.js`

**Settings → Deploy:**
- **Custom Build Path:** `apps/web/Dockerfile`
- **Use Dockerfile:** ✅ Habilitado

**Settings → Networking:**
- **Port:** 3000
- **Public Networking:** ✅ Habilitado (esta será a URL principal)

#### Variáveis de Ambiente - Frontend

Vá em **Variables** e adicione:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=<gere-com: openssl rand -base64 32>
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# LearnHouse Configuration
NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG=false
NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG=default
NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_LEARNHOUSE_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}

# API URLs - Aponta para o serviço de API
NEXT_PUBLIC_LEARNHOUSE_API_URL=https://${{learnhouse-api.RAILWAY_PUBLIC_DOMAIN}}/api/v1/
NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL=https://${{learnhouse-api.RAILWAY_PUBLIC_DOMAIN}}/

# Cookie Domain
LEARNHOUSE_COOKIE_DOMAIN=.${{RAILWAY_PUBLIC_DOMAIN}}

# Node Configuration
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

---

### 6. Conectar Serviços

Railway permite que serviços referenciem uns aos outros usando template variables:

**Sintaxe:**
- `${{ServiceName.VARIABLE_NAME}}`
- `${{Postgres.DATABASE_URL}}`
- `${{learnhouse-api.RAILWAY_PUBLIC_DOMAIN}}`

**Exemplo de Conexão:**

No frontend, para apontar para o backend:
```bash
NEXT_PUBLIC_LEARNHOUSE_API_URL=https://${{learnhouse-api.RAILWAY_PUBLIC_DOMAIN}}/api/v1/
```

---

### 7. Ordem de Deploy

É importante seguir esta ordem:

1. ✅ PostgreSQL (já criado)
2. ✅ Redis (já criado)
3. ✅ **Backend (API)** - Deploy primeiro
   - Aguarde migrations completarem
   - Verifique logs: "Migrations completed successfully"
4. ✅ **Frontend (Web)** - Deploy depois
   - Aguarde build Next.js
   - Verifica conexão com API

---

### 8. Executar Migrations

As migrations rodam automaticamente no startup do backend se `RUN_MIGRATIONS=true`.

**Para executar manualmente:**

Via Railway CLI:
```bash
railway link  # Conecta ao projeto
cd apps/api
railway run bash railway-migrate.sh
```

Via Dashboard:
1. Vá para o serviço `learnhouse-api`
2. Clique em "Deploy" → "Re-deploy"

---

### 9. Verificar Deploy

Após todos os serviços estarem online:

#### Backend (API)
```bash
# Health check
curl https://<api-url>/

# API docs
https://<api-url>/docs
```

#### Frontend (Web)
```bash
# Acesse via navegador
https://<web-url>/
```

#### Logs
No Railway Dashboard:
- **Backend:** learnhouse-api → Logs
- **Frontend:** learnhouse-web → Logs

---

## 🔧 Configuração de Domínio Customizado

### 1. Adicionar Domínio no Frontend

1. Vá para `learnhouse-web` → Settings → Domains
2. Clique em "Add Domain"
3. Digite: `app.seudominio.com` ou `seudominio.com`
4. Copie os registros DNS fornecidos

### 2. Configurar DNS

No seu provedor DNS (Cloudflare, GoDaddy, etc):

**Tipo CNAME:**
```
Nome: app (ou @)
Valor: <railway-url-fornecida>
```

**OU Tipo A:**
```
Nome: @ ou app
Valor: <IP fornecido pelo Railway>
```

### 3. Adicionar Domínio no Backend (Opcional)

Para um domínio separado para API (ex: `api.seudominio.com`):

1. Vá para `learnhouse-api` → Settings → Domains
2. Adicione: `api.seudominio.com`
3. Configure DNS similar ao frontend

### 4. Atualizar Variáveis de Ambiente

**Frontend (learnhouse-web):**
```bash
NEXTAUTH_URL=https://app.seudominio.com
NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN=seudominio.com
NEXT_PUBLIC_LEARNHOUSE_DOMAIN=app.seudominio.com
LEARNHOUSE_COOKIE_DOMAIN=.seudominio.com

# Se API tem domínio próprio
NEXT_PUBLIC_LEARNHOUSE_API_URL=https://api.seudominio.com/api/v1/
NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL=https://api.seudominio.com/
```

**Backend (learnhouse-api):**
```bash
LEARNHOUSE_DOMAIN=api.seudominio.com
LEARNHOUSE_COOKIE_DOMAIN=.seudominio.com

# CORS - Permitir frontend
LEARNHOUSE_ALLOWED_ORIGINS=https://app.seudominio.com
```

### 5. Redeploy

Após atualizar variáveis:
1. Redeploy backend primeiro
2. Depois redeploy frontend

---

## 📊 Monitoramento

### Logs em Tempo Real

**Via Dashboard:**
1. Selecione o serviço
2. Clique em "Logs"
3. Use filtros: Error, Warning, Info

**Via CLI:**
```bash
railway logs -s learnhouse-api
railway logs -s learnhouse-web
```

### Métricas

Railway fornece:
- **CPU Usage** - Uso de processador
- **Memory Usage** - Uso de memória RAM
- **Network** - Tráfego entrada/saída
- **Request Rate** - Requisições por segundo

### Health Checks

Configure health checks em Settings → Deploy:

**Backend:**
```
Healthcheck Path: /
Healthcheck Timeout: 300
```

**Frontend:**
```
Healthcheck Path: /
Healthcheck Timeout: 300
```

---

## 🐛 Troubleshooting

### Backend não inicia

**Problema:** Logs mostram erro de conexão com banco

**Solução:**
1. Verifique `LEARNHOUSE_SQL_CONNECTION_STRING`
2. Confirme que PostgreSQL está online
3. Teste conexão:
   ```bash
   railway run python -c "from src.core.events.database import engine; engine.connect()"
   ```

### Frontend não consegue conectar ao Backend

**Problema:** Erro 504 ou CORS

**Solução:**
1. Verifique se `NEXT_PUBLIC_LEARNHOUSE_API_URL` aponta para URL correta
2. Confirme que backend está rodando
3. Verifique CORS no backend:
   ```bash
   LEARNHOUSE_ALLOWED_ORIGINS=https://<frontend-url>
   ```

### Migrations falham

**Problema:** "Failed to connect to database"

**Solução:**
1. Aguarde PostgreSQL estar completamente online (1-2 min)
2. Verifique connection string
3. Execute migrations manualmente:
   ```bash
   railway run -s learnhouse-api bash apps/api/railway-migrate.sh
   ```

### Build timeout

**Problema:** Build excede tempo limite

**Solução:**
1. Railway Free tem limite de 10min
2. Upgrade para Railway Pro
3. Ou use Dockerfile pre-built

### NextAuth configuration error

**Problema:** "NEXTAUTH_SECRET must be provided"

**Solução:**
```bash
# Gere novo secret
openssl rand -base64 32

# Adicione em Variables
NEXTAUTH_SECRET=<secret-gerado>
```

### 502 Bad Gateway

**Problema:** Nginx/Railway retorna 502

**Solução:**
1. Aguarde 2-3 minutos após deploy
2. Verifique se serviço está escutando na porta correta
3. Confirme variável PORT está definida
4. Verifique logs para erros de startup

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] `NEXTAUTH_SECRET` forte e único (32+ caracteres)
- [ ] `LEARNHOUSE_AUTH_JWT_SECRET_KEY` diferente de dev
- [ ] Variáveis sensíveis não commitadas no Git
- [ ] HTTPS habilitado (automático no Railway)
- [ ] CORS configurado apenas para domínios autorizados
- [ ] Cookies com domínio correto
- [ ] PostgreSQL com senha forte
- [ ] Redis protegido (sem acesso público)
- [ ] API keys em variáveis de ambiente
- [ ] Logs não expõem dados sensíveis

### CORS em Produção

Durante desenvolvimento, você pode usar:
```bash
LEARNHOUSE_ALLOWED_ORIGINS=*
```

**⚠️ Em produção**, restrinja:
```bash
LEARNHOUSE_ALLOWED_ORIGINS=https://app.seudominio.com,https://seudominio.com
```

Ou use regex pattern no `config.yaml`:
```yaml
allowed_regexp: '^https?://(app\.)?seudominio\.com$'
```

---

## 💾 Volumes e Persistência

### Conteúdo Gerado por Usuários

**Opção 1: Filesystem (Padrão)**

Configure volume no Railway:
1. Vá para `learnhouse-api` → Settings
2. Em "Volumes", clique "Add Volume"
3. Configure:
   - **Mount Path:** `/app/content`
   - **Size:** 10GB (ajuste conforme necessário)

**⚠️ Limitação:** Railway pode resetar volumes em redeploys.

**Opção 2: S3 (Recomendado para Produção)**

Configure variáveis:
```bash
LEARNHOUSE_CONTENT_DELIVERY_TYPE=s3api
LEARNHOUSE_S3_BUCKET_NAME=learnhouse-content
LEARNHOUSE_S3_ENDPOINT_URL=https://s3.amazonaws.com
AWS_ACCESS_KEY_ID=<seu-access-key>
AWS_SECRET_ACCESS_KEY=<seu-secret-key>
```

Providers suportados:
- AWS S3
- DigitalOcean Spaces
- Cloudflare R2
- MinIO
- Backblaze B2

---

## 💰 Estimativa de Custos

### Railway Pricing (Março 2024)

**Hobby Plan: $5/mês**
- 500 horas de execução
- $0.000231/GB-hora para memória
- $0.000463/vCPU-hora

**Estimativa para LearnHouse:**
- **Backend:** ~512MB RAM, 0.5 vCPU = ~$8/mês
- **Frontend:** ~256MB RAM, 0.25 vCPU = ~$4/mês
- **PostgreSQL:** Incluído (5GB storage)
- **Redis:** Incluído
- **Total:** ~$12-15/mês + tráfego

**Pro Plan: $20/mês + uso**
- Uso ilimitado
- Prioridade no build
- Suporte prioritário

### Otimização de Custos

1. **Use Sleep Mode:** Desabilite em horários de baixo uso
2. **Optimize Images:** Use Docker multi-stage builds
3. **Cache:** Configure Railway cache para builds
4. **Combine Services:** Considere combinar se tráfego é baixo

---

## 🚀 Otimizações de Performance

### Backend (API)

**Variáveis de otimização:**
```bash
LEARNHOUSE_DEVELOPMENT_MODE=false
LEARNHOUSE_LOGFIRE_ENABLED=false  # Desabilite se não usar

# Uvicorn workers
WORKERS=2  # 2x número de CPUs
```

**Database Connection Pool:**
Já configurado em `src/core/events/database.py`:
- Pool size: 20
- Max overflow: 10
- Pool recycle: 300s

### Frontend (Web)

**Next.js optimizations:**
```bash
NEXT_TELEMETRY_DISABLED=1  # Desabilita telemetria
```

Já configurado no `next.config.js`:
- Output: standalone (reduz tamanho)
- Image optimization
- Bundle analyzer

### Caching

**Redis configuration:**
Configure TTL apropriado para cache no código.

**CDN:**
Para assets estáticos, considere:
- Cloudflare (free tier disponível)
- Vercel Edge Network (para Next.js)

---

## 📚 Estrutura de Arquivos Criados

```
.
├── railway.json                    # Configuração global Railway
├── apps/
│   ├── api/
│   │   ├── Dockerfile             # Container API (já existente)
│   │   ├── nixpacks.toml          # Config Nixpacks API
│   │   └── railway-migrate.sh     # Script migrations Railway
│   └── web/
│       ├── Dockerfile             # Container Web (já existente)
│       └── nixpacks.toml          # Config Nixpacks Web
├── RAILWAY_DEPLOY.md              # Este arquivo
├── RAILWAY_QUICK_START.md         # Guia rápido
└── .env.railway.example           # Template variáveis
```

---

## 🔄 CI/CD e Automação

### Deploy Automático

Railway faz deploy automático quando:
1. Push para branch configurada (main/dev)
2. PR merged
3. Tag criada

**Desabilitar auto-deploy:**
Settings → Deploy → Auto Deploy: OFF

### Deploy Manual

**Via CLI:**
```bash
railway up -s learnhouse-api
railway up -s learnhouse-web
```

**Via Dashboard:**
Deployments → New Deployment

### Environments

Configure múltiplos ambientes:

1. **Production:** main branch
2. **Staging:** staging branch
3. **Development:** dev branch

Cada environment tem variáveis isoladas.

---

## 🧪 Testing

### Testar Localmente com Railway

```bash
# Conecta ao projeto
railway link

# Lista variáveis
railway variables

# Roda comando com variáveis do Railway
railway run python apps/api/app.py
railway run npm start --prefix apps/web
```

### Testing em Staging

Crie environment de staging:
1. Settings → Environments → New Environment
2. Nome: "Staging"
3. Configure variáveis separadas
4. Deploy branch `staging`

---

## 📖 Recursos Adicionais

- [Railway Docs](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
- [Railway Discord](https://discord.gg/railway)
- [LearnHouse Docs](https://github.com/learnhouse/learnhouse)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## ✅ Checklist Final de Deploy

### Pré-Deploy
- [ ] PostgreSQL criado e online
- [ ] Redis criado e online
- [ ] Variáveis de ambiente configuradas (Backend)
- [ ] Variáveis de ambiente configuradas (Frontend)
- [ ] NEXTAUTH_SECRET gerado
- [ ] JWT secret configurado

### Deploy Backend
- [ ] Serviço backend criado
- [ ] Root directory: `apps/api`
- [ ] Dockerfile configurado
- [ ] Porta 9000 exposta
- [ ] Migrations executadas com sucesso
- [ ] Logs sem erros
- [ ] Health check respondendo

### Deploy Frontend
- [ ] Serviço frontend criado
- [ ] Root directory: `apps/web`
- [ ] Dockerfile configurado
- [ ] Porta 3000 exposta
- [ ] Build Next.js completo
- [ ] Logs sem erros
- [ ] Site acessível

### Pós-Deploy
- [ ] Frontend carrega corretamente
- [ ] Login/logout funcionando (NextAuth)
- [ ] API respondendo em `/api/v1/`
- [ ] Uploads funcionando (ou S3 configurado)
- [ ] Email configurado (se necessário)
- [ ] Pagamentos configurados (se necessário)
- [ ] Domínio customizado (se aplicável)
- [ ] SSL/HTTPS ativo
- [ ] CORS configurado corretamente
- [ ] Monitoramento configurado

---

## 🆘 Suporte

### Railway Support
- **Docs:** [docs.railway.app](https://docs.railway.app/)
- **Discord:** [discord.gg/railway](https://discord.gg/railway)
- **Status:** [status.railway.app](https://status.railway.app/)

### LearnHouse Support
- **GitHub:** [github.com/learnhouse/learnhouse](https://github.com/learnhouse/learnhouse)
- **Issues:** [github.com/learnhouse/learnhouse/issues](https://github.com/learnhouse/learnhouse/issues)
- **Email:** hi@learnhouse.app

---

**Deployment bem-sucedido! 🎉**

Agora você tem LearnHouse rodando no Railway com arquitetura escalável e resiliente!
