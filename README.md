# Travel Notes - Organizador de Viagens

Uma aplicação moderna para organizar suas viagens com autenticação e sincronização em tempo real usando Supabase.

## 🚀 Funcionalidades

- ✨ **Autenticação segura** com Supabase Auth
- 📁 **Organização hierárquica** de pastas e notas
- 📝 **Editor de texto rico** para suas notas
- 🔄 **Sincronização em tempo real** entre dispositivos
- 🎨 **Interface moderna** com shadcn/ui
- 📱 **Responsivo** para todos os dispositivos

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Editor**: TipTap (Rich Text Editor)

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no [Supabase](https://supabase.com)

## 🚀 Configuração

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd travel
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase-schema.sql` no SQL Editor
3. Configure as variáveis de ambiente (veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 5. Execute a aplicação

```bash
npm run dev
```

Acesse `http://localhost:8080` no seu navegador.

## 📖 Documentação

- [Configuração do Supabase](./SUPABASE_SETUP.md) - Guia completo de configuração
- [Schema do banco de dados](./supabase-schema.sql) - Estrutura das tabelas

## 🔧 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🏗️ Estrutura do projeto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticação
│   ├── travel/        # Componentes da aplicação
│   └── ui/            # Componentes UI (shadcn/ui)
├── hooks/             # Hooks customizados
├── lib/               # Configurações e utilitários
├── pages/             # Páginas da aplicação
└── types/             # Definições de tipos TypeScript
```

## 🔐 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Autenticação** baseada em JWT
- **Políticas de acesso** garantem que usuários vejam apenas seus dados
- **Validação** de entrada em todos os formulários

## 📱 Deploy

### Lovable
Para fazer deploy via Lovable, acesse o [projeto](https://lovable.dev/projects/baf03ba3-b1ed-407d-b860-b85bb7a70466) e clique em Share -> Publish.

### Vercel/Netlify
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
