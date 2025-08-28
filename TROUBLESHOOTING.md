# Solução de Problemas - Erro 400

## Problema
Erro 400 ao tentar criar uma viagem (pasta) no Supabase.

## Possíveis Causas e Soluções

### 1. Variáveis de Ambiente Não Configuradas

**Sintoma:** Erro "Missing Supabase environment variables"

**Solução:**
1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

3. Reinicie o servidor de desenvolvimento: `npm run dev`

### 2. Tabelas Não Criadas no Supabase

**Sintoma:** Erro "relation 'folders' does not exist"

**Solução:**
1. Acesse o dashboard do Supabase
2. Vá em "SQL Editor"
3. Execute o script completo em `supabase-schema.sql`

### 3. Políticas RLS Não Configuradas

**Sintoma:** Erro de permissão ou acesso negado

**Solução:**
Execute estas políticas no SQL Editor:

```sql
-- Política para usuários verem apenas suas próprias pastas
CREATE POLICY "Users can view own folders" ON folders
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias pastas
CREATE POLICY "Users can insert own folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias pastas
CREATE POLICY "Users can update own folders" ON folders
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias pastas
CREATE POLICY "Users can delete own folders" ON folders
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Usuário Não Autenticado

**Sintoma:** Erro "Usuário não autenticado" no console

**Solução:**
1. Verifique se está logado na aplicação
2. Tente fazer logout e login novamente
3. Verifique se o email foi confirmado no Supabase

### 5. Configuração de Autenticação

**Sintoma:** Problemas de autenticação

**Solução:**
1. No dashboard do Supabase, vá em "Authentication" > "Settings"
2. Em "Site URL", adicione: `http://localhost:8080`
3. Em "Redirect URLs", adicione: `http://localhost:8080`
4. Salve as configurações

## Debug

Para diagnosticar o problema:

1. Acesse `http://localhost:8080/debug` após fazer login
2. Verifique se todas as configurações estão corretas
3. Execute o teste de conexão
4. Verifique os logs no console do navegador

## Logs Úteis

Abra o console do navegador (F12) e procure por:

- "Criando pasta:" - mostra os dados sendo enviados
- "Erro do Supabase:" - mostra o erro específico
- "Usuário não autenticado" - indica problema de autenticação

## Verificação Rápida

1. **Variáveis de ambiente configuradas?**
   ```bash
   # Verifique se o arquivo .env existe e tem as variáveis
   cat .env
   ```

2. **Tabelas criadas no Supabase?**
   - Dashboard > Table Editor > Verificar se existem as tabelas `folders` e `notes`

3. **Usuário autenticado?**
   - Verificar se está logado na aplicação
   - Verificar se o email foi confirmado

4. **Políticas RLS ativas?**
   - Dashboard > Authentication > Policies > Verificar se as políticas estão criadas

## Contato

Se o problema persistir, verifique:
- Logs do console do navegador
- Logs do Supabase (Dashboard > Logs)
- Configuração das variáveis de ambiente
