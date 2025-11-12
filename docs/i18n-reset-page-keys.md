# Chaves de Tradução - Página Reset Password

Este documento lista todas as chaves de tradução necessárias para a página de reset de senha (`reset.tsx`).

## Namespace: `auth.reset`

### Chaves principais

```json
{
  "auth": {
    "reset": {
      "title": "Reset Password",
      "description": "Enter your email and reset code to reset your password",
      "email": "Email",
      "resetCode": "Reset Code",
      "newPassword": "New Password",
      "confirmPassword": "Confirm Password",
      "loading": "Loading...",
      "changePasswordButton": "Change Password",
      "loginPrompt": ", please login",
      "loginAgainPrompt": "Please login again with your new password"
    }
  }
}
```

### Chaves de validação

```json
{
  "auth": {
    "reset": {
      "validation": {
        "required": "Required",
        "invalidEmail": "Invalid email address",
        "passwordRequired": "Required",
        "confirmPasswordRequired": "Required",
        "passwordsMismatch": "Passwords do not match",
        "resetCodeRequired": "Required"
      }
    }
  }
}
```

## Arquivo completo para en.json

```json
{
  "auth": {
    "reset": {
      "title": "Reset Password",
      "description": "Enter your email and reset code to reset your password",
      "email": "Email",
      "resetCode": "Reset Code",
      "newPassword": "New Password",
      "confirmPassword": "Confirm Password",
      "loading": "Loading...",
      "changePasswordButton": "Change Password",
      "loginPrompt": ", please login",
      "loginAgainPrompt": "Please login again with your new password",
      "validation": {
        "required": "Required",
        "invalidEmail": "Invalid email address",
        "passwordRequired": "Required",
        "confirmPasswordRequired": "Required",
        "passwordsMismatch": "Passwords do not match",
        "resetCodeRequired": "Required"
      }
    }
  }
}
```

## Arquivo completo para pt.json

```json
{
  "auth": {
    "reset": {
      "title": "Redefinir Senha",
      "description": "Digite seu e-mail e código de redefinição para alterar sua senha",
      "email": "E-mail",
      "resetCode": "Código de Redefinição",
      "newPassword": "Nova Senha",
      "confirmPassword": "Confirmar Senha",
      "loading": "Carregando...",
      "changePasswordButton": "Alterar Senha",
      "loginPrompt": ", por favor faça login",
      "loginAgainPrompt": "Por favor, faça login novamente com sua nova senha",
      "validation": {
        "required": "Obrigatório",
        "invalidEmail": "Endereço de e-mail inválido",
        "passwordRequired": "Obrigatório",
        "confirmPasswordRequired": "Obrigatório",
        "passwordsMismatch": "As senhas não coincidem",
        "resetCodeRequired": "Obrigatório"
      }
    }
  }
}
```

## Mudanças implementadas no código

### 1. Import adicionado (linha 19)
```typescript
import { useTranslations } from 'next-intl'
```

### 2. Hook no componente (linha 23)
```typescript
const t = useTranslations('auth.reset')
```

### 3. Função validate movida para dentro do componente
A função `validate` foi movida de fora do componente (linhas 20-44 do original) para dentro do componente (linhas 32-57) para ter acesso ao hook `useTranslations`.

### 4. Todas as strings hardcoded substituídas
- Título: `{t('title')}`
- Descrição: `{t('description')}`
- Labels dos campos: `{t('email')}`, `{t('resetCode')}`, `{t('newPassword')}`, `{t('confirmPassword')}`
- Botão: `{isSubmitting ? t('loading') : t('changePasswordButton')}`
- Mensagens: `{t('loginPrompt')}`, `{t('loginAgainPrompt')}`
- Validações: todas usando `t('validation.*')`

## Próximos passos

1. Adicionar as chaves de tradução aos arquivos de tradução existentes em `apps/web/messages/`
2. Testar a página em ambos os idiomas (en e pt)
3. Verificar se todas as mensagens de validação aparecem corretamente
4. Garantir que a mensagem de sucesso aparece corretamente formatada
