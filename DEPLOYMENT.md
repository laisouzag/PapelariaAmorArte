# Guia de Deploy no Render (Hospedagem Gratuita)

## Passo 1: Criar Banco de Dados no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **New** → **Database**
3. Selecione **MySQL**
4. Preencha:
   - **Name**: `papelaria-amor-arte-db`
   - **Region**: Escolha a mais próxima (ex: Oregon)
5. Clique em **Create Database**
6. **IMPORTANTE**: Anote as credenciais fornecidas (Host, Database, User, Password)

## Passo 2: Configurar Variáveis de Ambiente

No seu repositório GitHub, vá em **Settings** → **Secrets and variables** → **Actions** (se usar GitHub Actions) ou configure diretamente no Render:

Adicione as seguintes variáveis de ambiente no Render:
```
DB_HOST=seu-host-do-render
DB_USER=seu-usuario-do-render
DB_PASSWORD=sua-senha-do-render
DB_NAME=seu-nome-do-banco
DB_PORT=3306
PORT=3000
NODE_ENV=production
JWT_SECRET=uma-chave-secreta-muito-longa-e-segura
ADMIN_EMAIL=admin@papelaria.com
ADMIN_PASSWORD=sua-senha-admin
```

## Passo 3: Criar Web Service no Render

1. No Render, clique em **New** → **Web Service**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `papelaria-amor-arte`
   - **Region**: Mesma região do banco de dados
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Adicione as variáveis de ambiente (mesmas do passo 2)
5. Clique em **Create Web Service**

## Passo 4: Executar Migrations no Banco de Dados

1. No Render, acesse seu banco de dados
2. Clique em **Connect** → **External Connection**
3. Use as credenciais para conectar via MySQL Workbench ou DBeaver
4. Execute o script SQL: `database/schema_completo.sql`

## Passo 5: Testar a Aplicação

Após o deploy, acesse a URL fornecida pelo Render:
- Frontend: `https://papelaria-amor-arte.onrender.com`
- Admin: `https://papelaria-amor-arte.onrender.com/admin.html`
- API: `https://papelaria-amor-arte.onrender.com/api`

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que o banco de dados está na mesma região do web service

### Erro de CORS
- O CORS já está configurado no server.js
- Verifique se a URL do frontend está correta

### Imagens não carregam
- As imagens estão na pasta `img/` e são servidas como arquivos estáticos
- Verifique se os caminhos das imagens estão corretos
