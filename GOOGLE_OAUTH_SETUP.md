# Configuração da Autenticação Google OAuth no Supabase

Este guia explica como configurar a autenticação do Google OAuth no seu projeto Supabase para o aplicativo Travel Notes.

## 1. Configuração no Google Cloud Console

### 1.1 Criar um Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ (se necessário)

### 1.2 Configurar Credenciais OAuth 2.0

1. No menu lateral, vá para **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**
3. Selecione **Web application** como tipo de aplicativo
4. Configure as URLs autorizadas:

#### URLs de Redirecionamento Autorizadas:
```
https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
```

**Nota:** Substitua `[SEU_PROJECT_ID]` pelo ID do seu projeto Supabase.

### 1.3 Obter as Credenciais

Após criar as credenciais, você receberá:
- **Client ID**
- **Client Secret**

Guarde essas informações para usar na configuração do Supabase.

## 2. Configuração no Supabase Dashboard

### 2.1 Acessar Configurações de Autenticação

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication** > **Providers**

### 2.2 Configurar o Google Provider

1. Encontre o **Google** na lista de provedores
2. Clique em **Edit** (ícone de lápis)
3. Ative o toggle **Enable**
4. Preencha os campos:
   - **Client ID**: Cole o Client ID do Google Cloud Console
   - **Client Secret**: Cole o Client Secret do Google Cloud Console

### 2.3 Configurar URLs de Redirecionamento

No Supabase Dashboard, vá para **Authentication** > **URL Configuration** e configure:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173/auth/callback
https://[SEU_DOMINIO_PRODUCAO]/auth/callback
```

## 3. Configuração de Variáveis de Ambiente

Certifique-se de que suas variáveis de ambiente estão configuradas corretamente:

```env
VITE_SUPABASE_URL=https://[SEU_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
```

## 4. Testando a Implementação

### 4.1 Teste Local

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:5173`
3. Clique no botão "Continuar com Google"
4. Você deve ser redirecionado para o Google para autenticação
5. Após o login, você será redirecionado de volta para a aplicação

### 4.2 Verificação no Supabase

1. No Supabase Dashboard, vá para **Authentication** > **Users**
2. Você deve ver o novo usuário criado via Google OAuth
3. O usuário terá um provedor "google" listado

## 5. Solução de Problemas Comuns

### 5.1 Erro "redirect_uri_mismatch"

**Causa:** A URL de redirecionamento não está configurada corretamente no Google Cloud Console.

**Solução:** Verifique se todas as URLs de redirecionamento estão listadas corretamente no Google Cloud Console.

### 5.2 Erro "invalid_client"

**Causa:** Client ID ou Client Secret incorretos no Supabase.

**Solução:** Verifique se as credenciais foram copiadas corretamente do Google Cloud Console.

### 5.3 Usuário não é criado no Supabase

**Causa:** Configuração incorreta do provedor ou permissões.

**Solução:** 
1. Verifique se o Google provider está ativado no Supabase
2. Confirme se as URLs de redirecionamento estão corretas
3. Verifique os logs de erro no Supabase Dashboard

## 6. Configuração para Produção

### 6.1 URLs de Produção

Quando for para produção, atualize as URLs no Google Cloud Console:

```
https://[SEU_DOMINIO_PRODUCAO]/auth/callback
```

### 6.2 Configuração no Supabase

Atualize as URLs de redirecionamento no Supabase Dashboard para incluir seu domínio de produção.

## 7. Segurança

### 7.1 Boas Práticas

- Nunca compartilhe o Client Secret
- Use variáveis de ambiente para credenciais
- Configure URLs de redirecionamento específicas
- Monitore logs de autenticação regularmente

### 7.2 Configurações Adicionais

No Supabase, você pode configurar:
- **Email confirmations**: Requer confirmação de email
- **Phone confirmations**: Requer confirmação de telefone
- **MFA**: Autenticação de dois fatores

## 8. Recursos Adicionais

- [Documentação oficial do Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

---

**Nota:** Este guia assume que você já tem um projeto Supabase configurado. Se não tiver, siga a [documentação oficial do Supabase](https://supabase.com/docs/guides/getting-started) para criar um projeto primeiro.
