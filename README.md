# Travel Notes - Organizador de Viagens PWA 📱

Uma **Progressive Web App (PWA)** moderna para organizar suas viagens com autenticação, sincronização em tempo real e funcionalidade offline completa.

## 🚀 Funcionalidades

### 📱 **PWA Features**
- ✅ **Instalável** - Funciona como app nativo em qualquer dispositivo
- ✅ **Offline First** - Funciona completamente sem internet
- ✅ **Cache Inteligente** - Carregamento rápido e eficiente
- ✅ **Atualizações Automáticas** - Sempre na versão mais recente
- ✅ **Responsivo** - Interface adaptada para mobile, tablet e desktop
- ✅ **Compartilhamento** - Web Share API integrada

### 🎯 **Core Features**
- ✨ **Autenticação segura** com Supabase Auth
- 📁 **Organização hierárquica** de pastas e notas
- 📝 **Editor de texto rico** para suas notas
- 🔄 **Sincronização em tempo real** entre dispositivos
- 🎨 **Interface moderna** com shadcn/ui
- 🌐 **Funcionalidade offline** com sincronização automática

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **PWA**: Service Worker + Web App Manifest + Cache API
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Editor**: TipTap (Rich Text Editor)
- **Icons**: Lucide React + Custom PWA Icons

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

- [PWA Features](./PWA-README.md) - **Guia completo da Progressive Web App**
- [Configuração do Supabase](./SUPABASE_SETUP.md) - Guia completo de configuração
- [Schema do banco de dados](./supabase-schema.sql) - Estrutura das tabelas
- [Troubleshooting](./TROUBLESHOOTING.md) - Solução de problemas comuns

## 🔧 Scripts disponíveis

### **Desenvolvimento**
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run lint` - Executa o linter

### **Build e Deploy**
- `npm run build` - Build padrão de produção
- `npm run build:pwa` - Build completo da PWA (com ícones e screenshots)
- `npm run preview` - Visualiza o build de produção

### **PWA Tools**
- `npm run generate:icons` - Gera ícones PWA em diferentes tamanhos
- `npm run generate:screenshots` - Gera screenshots para app stores
- `npm run pwa:setup` - Setup completo da PWA (ícones + screenshots)

## 🏗️ Estrutura do projeto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticação
│   ├── pwa/           # 🆕 Componentes PWA (PWAManager)
│   ├── travel/        # Componentes da aplicação
│   └── ui/            # Componentes UI (shadcn/ui)
├── hooks/             # Hooks customizados
│   └── usePWA.ts      # 🆕 Hook para funcionalidades PWA
├── lib/               # Configurações e utilitários
├── pages/             # Páginas da aplicação
└── types/             # Definições de tipos TypeScript

public/
├── icons/             # 🆕 Ícones PWA (72x72 até 512x512)
├── screenshots/       # 🆕 Screenshots para app stores
├── manifest.json      # 🆕 Manifesto da PWA
└── sw.js             # 🆕 Service Worker
```

## 🔐 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Autenticação** baseada em JWT
- **Políticas de acesso** garantem que usuários vejam apenas seus dados
- **Validação** de entrada em todos os formulários

## 📱 Deploy

### 🚀 **PWA Deploy**
A aplicação é uma PWA completa e pode ser deployada em qualquer plataforma:

```bash
npm run build:pwa  # Build com todos os assets PWA
```

### **Platforms**

#### **Vercel (Recomendado)**
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Build Command: `npm run build:pwa`
4. Deploy automático com PWA otimizada

#### **Netlify**
1. Conecte seu repositório
2. Build Command: `npm run build:pwa`
3. Publish Directory: `dist`
4. Configure variáveis de ambiente

#### **GitHub Pages**
1. Use GitHub Actions para build automático
2. Deploy da pasta `dist` 
3. Configure domínio personalizado (opcional)

### **Funcionalidades Pós-Deploy**
- ✅ Instalação como app nativo
- ✅ Funcionamento offline
- ✅ Atualizações automáticas
- ✅ Push notifications (se configuradas)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
