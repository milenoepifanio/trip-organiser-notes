-- Schema do banco de dados para Travel Notes
-- Execute este script no SQL Editor do Supabase

-- Tabela de pastas (folders)
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);

-- Política RLS (Row Level Security)
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias pastas
DROP POLICY IF EXISTS "Users can view own folders" ON folders;
CREATE POLICY "Users can view own folders" ON folders
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias pastas
DROP POLICY IF EXISTS "Users can insert own folders" ON folders;
CREATE POLICY "Users can insert own folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias pastas
DROP POLICY IF EXISTS "Users can update own folders" ON folders;
CREATE POLICY "Users can update own folders" ON folders
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias pastas
DROP POLICY IF EXISTS "Users can delete own folders" ON folders;
CREATE POLICY "Users can delete own folders" ON folders
  FOR DELETE USING (auth.uid() = user_id);

-- Tabela de notas (notes)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);

-- Política RLS (Row Level Security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias notas
DROP POLICY IF EXISTS "Users can view own notes" ON notes;
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias notas
DROP POLICY IF EXISTS "Users can insert own notes" ON notes;
CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias notas
DROP POLICY IF EXISTS "Users can update own notes" ON notes;
CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias notas
DROP POLICY IF EXISTS "Users can delete own notes" ON notes;
CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar automaticamente o campo updated_at
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
