# Backend Internationalization (i18n)

Este diretório contém as traduções para mensagens do backend da API LearnHouse.

## Estrutura

```
locales/
├── pt-BR/
│   └── messages.json
├── en/
│   └── messages.json
└── README.md
```

## Idiomas Suportados

- **pt-BR**: Português Brasileiro (padrão)
- **en**: Inglês

## Como Usar

### 1. Em Routers FastAPI

```python
from fastapi import APIRouter, Request, HTTPException
from src.utils.i18n import get_translator

router = APIRouter()

@router.post("/exemplo")
async def exemplo(request: Request):
    # Criar tradutor a partir da requisição
    t = get_translator(request)

    # Usar traduções
    return {"message": t("auth.login_successful")}

    # Com variáveis
    raise HTTPException(
        status_code=400,
        detail=t("validation.min_length", min=8)
    )
```

### 2. Detecção de Idioma

O sistema detecta o idioma automaticamente usando:

1. **Header `Accept-Language`** (padrão HTTP)
   ```
   Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8
   ```

2. **Header customizado `X-Language`**
   ```
   X-Language: en
   ```

### 3. Adicionar Novas Traduções

Para adicionar uma nova mensagem:

1. Adicione a chave em `pt-BR/messages.json`:
   ```json
   {
     "novo_modulo": {
       "mensagem": "Nova mensagem em português"
     }
   }
   ```

2. Adicione a tradução em `en/messages.json`:
   ```json
   {
     "novo_modulo": {
       "mensagem": "New message in English"
     }
   }
   ```

3. Use no código:
   ```python
   t("novo_modulo.mensagem")
   ```

### 4. Interpolação de Variáveis

Use placeholders `{variavel}` nas mensagens:

```json
{
  "validation": {
    "min_length": "Must be at least {min} characters"
  }
}
```

E passe as variáveis ao traduzir:

```python
t("validation.min_length", min=8)
# Output: "Must be at least 8 characters"
```

## Estrutura das Mensagens

### Categorias Disponíveis

- **auth**: Autenticação (login, logout, OAuth, tokens)
- **users**: Usuários (criação, atualização, permissões)
- **courses**: Cursos (CRUD, publicação, acesso)
- **organizations**: Organizações
- **roles**: Funções e permissões
- **assignments**: Tarefas e submissões
- **payments**: Pagamentos e Stripe
- **media**: Upload e gerenciamento de arquivos
- **validation**: Validação de formulários
- **errors**: Mensagens de erro genéricas
- **success**: Mensagens de sucesso genéricas

## Exemplos de Uso

### Exemplo 1: Mensagem de Erro com HTTPException

```python
from fastapi import HTTPException, Request
from src.utils.i18n import get_translator

async def minha_rota(request: Request):
    t = get_translator(request)

    if not user:
        raise HTTPException(
            status_code=404,
            detail=t("users.user_not_found")
        )
```

### Exemplo 2: Resposta de Sucesso

```python
async def criar_curso(request: Request):
    t = get_translator(request)

    # ... lógica de criação ...

    return {
        "message": t("courses.course_created"),
        "course": curso
    }
```

### Exemplo 3: Validação com Variáveis

```python
async def validar_senha(request: Request, senha: str):
    t = get_translator(request)

    if len(senha) < 8:
        raise HTTPException(
            status_code=400,
            detail=t("validation.min_length", min=8)
        )
```

## Testes

Para testar traduções em diferentes idiomas:

```bash
# Português (padrão)
curl -X POST http://localhost:8000/api/v1/auth/login

# Inglês
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Accept-Language: en"

# Ou usando header customizado
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "X-Language: en"
```

## Convenções

1. Use dot notation para chaves: `"categoria.subcategoria.mensagem"`
2. Mantenha as chaves em inglês (mesmo nas traduções)
3. Use snake_case para nomes de chaves
4. Mantenha as traduções curtas e claras
5. Use placeholders `{variavel}` para conteúdo dinâmico
6. Sempre adicione traduções em TODOS os idiomas suportados

## Fallback

Se uma tradução não for encontrada:
1. Sistema tenta buscar no idioma solicitado
2. Se não existir, busca em pt-BR (padrão)
3. Se ainda não existir, retorna a própria chave

## Adicionar Novo Idioma

Para adicionar um novo idioma (ex: espanhol):

1. Crie o diretório: `locales/es/`
2. Crie o arquivo: `locales/es/messages.json`
3. Copie a estrutura de `pt-BR/messages.json`
4. Traduza todas as mensagens
5. Adicione `"es"` em `SUPPORTED_LOCALES` no arquivo `src/utils/i18n.py`

```python
SUPPORTED_LOCALES = ["pt-BR", "en", "es"]
```

## Utilitários Disponíveis

### `get_translator(request)`
Cria um tradutor a partir de uma requisição FastAPI.

### `translate(key, locale, **kwargs)`
Traduz uma chave diretamente especificando o idioma.

### `Translator(request, locale)`
Classe tradutora para uso avançado.

### `get_locale_from_request(request)`
Extrai o idioma preferido da requisição.

## Manutenção

- **Manter Sincronizado**: Todas as chaves devem existir em todos os idiomas
- **Revisar Traduções**: Periodicamente revisar traduções com falantes nativos
- **Documentar Contexto**: Adicionar comentários para mensagens ambíguas
- **Testar**: Sempre testar em ambos idiomas após adicionar novas mensagens

## Contribuindo

Ao adicionar novas rotas ou mensagens de erro:

1. ✅ Sempre use o sistema de i18n
2. ✅ Adicione traduções em TODOS os idiomas
3. ✅ Teste em múltiplos idiomas
4. ✅ Use chaves descritivas
5. ❌ Nunca hardcode mensagens em inglês ou português

## Exemplos de Má Prática vs Boa Prática

### ❌ Má Prática
```python
# Hardcoded em inglês
raise HTTPException(status_code=404, detail="User not found")

# Hardcoded em português
return {"message": "Usuário criado com sucesso"}
```

### ✅ Boa Prática
```python
t = get_translator(request)

# Com i18n
raise HTTPException(
    status_code=404,
    detail=t("users.user_not_found")
)

return {"message": t("users.user_created")}
```
