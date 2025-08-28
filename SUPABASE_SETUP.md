# Configuração do Supabase

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha as informações do projeto:
   - Nome: `travel-notes`
   - Senha do banco: (escolha uma senha forte)
   - Região: (escolha a mais próxima)

## 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

Para encontrar essas informações:
1. No dashboard do Supabase, vá em "Settings" > "API"
2. Copie a "Project URL" para `VITE_SUPABASE_URL`
3. Copie a "anon public" key para `VITE_SUPABASE_ANON_KEY`

## 3. Criar tabelas no banco de dados

Execute os seguintes comandos SQL no SQL Editor do Supabase:

### Tabela de pastas (folders)

```sql
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);

-- Política RLS (Row Level Security)
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

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

### Tabela de notas (notes)

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_folder_id ON notes(folder_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);

-- Política RLS (Row Level Security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias notas
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias notas
CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias notas
CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias notas
CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);
```

## 4. Configurar autenticação

1. No dashboard do Supabase, vá em "Authentication" > "Settings"
2. Em "Site URL", adicione: `http://localhost:8080`
3. Em "Redirect URLs", adicione: `http://localhost:8080`
4. Salve as configurações

## 5. Testar a aplicação

1. Execute `npm run dev` para iniciar o servidor de desenvolvimento
2. Acesse `http://localhost:8080`
3. Crie uma conta ou faça login
4. Teste criar pastas e notas

## Estrutura do banco de dados

### Tabela `folders`
- `id`: UUID único da pasta
- `name`: Nome da pasta
- `parent_id`: ID da pasta pai (para hierarquia)
- `user_id`: ID do usuário proprietário
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

### Tabela `notes`
- `id`: UUID único da nota
- `title`: Título da nota
- `content`: Conteúdo da nota (HTML)
- `folder_id`: ID da pasta onde a nota está
- `user_id`: ID do usuário proprietário
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

## Segurança

- Todas as tabelas têm Row Level Security (RLS) habilitado
- Usuários só podem acessar seus próprios dados
- As políticas garantem que cada usuário veja apenas suas pastas e notas
- As chaves de API são seguras e não expõem dados sensíveis
