# Guia de Configuração - Papelaria Amor e Arte

## Instalação Rápida

### 1. Instalar MySQL
```bash
# Baixe MySQL Community Server
# https://dev.mysql.com/downloads/mysql/

# Durante a instalação:
# - Defina senha para o usuário root (ou deixe em branco)
# - Configure o serviço para iniciar automaticamente
# - Anote a senha configurada
```

### 2. Iniciar MySQL
```bash
# Windows - Via Services
# Pressione Win+R, digite services.msc
# Encontre "MySQL80" (ou versão instalada)
# Clique com botão direito -> Start

# Windows - Via linha de comando (como administrador)
net start MySQL80
```

### 3. Configurar Backend
```bash
# Navegue para a pasta backend
cd backend

# Instale as dependências (se já não foram instaladas)
npm install

# Edite o arquivo .env se necessário
# Configure DB_PASSWORD se definiu uma senha durante a instalação do MySQL
```

### 4. Criar Banco de Dados
```bash
# Opção 1: Via script Node.js
cd backend
node init-db.js

# Opção 2: Via linha de comando MySQL
mysql -u root -p < ../database/schema.sql
# (será solicitada a senha do root)
```

### 5. Iniciar o Servidor
```bash
cd backend
node server.js
```

O servidor iniciará em: `http://localhost:3000`

### 6. Acessar a Aplicação
Abra o arquivo `index.html` no navegador ou acesse `http://localhost:3000`

## Solução de Problemas

### MySQL não conecta
```
Erro: Database connection failed
```
**Solução:**
1. Verifique se o serviço MySQL está rodando
2. Verifique as credenciais no arquivo `backend/.env`
3. Tente conectar via terminal: `mysql -u root -p`

### Porta 3000 já em uso
```
Erro: EADDRINUSE: address already in use :::3000
```
**Solução:**
1. Altere a PORT no arquivo `backend/.env`
2. Ou encerre o processo usando a porta 3000

### Erro de módulo não encontrado
```
Erro: Cannot find module 'express'
```
**Solução:**
```bash
cd backend
npm install
```

## Estrutura do Projeto

```
Papelaria Amor e Arte/
├── backend/
│   ├── config/
│   │   └── database.js       # Configuração MySQL
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticação
│   ├── routes/
│   │   ├── auth.js           # Rotas de autenticação
│   │   ├── products.js       # Rotas de produtos
│   │   ├── orders.js         # Rotas de pedidos
│   │   ├── categories.js     # Rotas de categorias
│   │   ├── users.js          # Rotas de usuários
│   │   └── admin.js          # Rotas admin
│   ├── .env                  # Variáveis de ambiente
│   ├── package.json          # Dependências
│   ├── server.js             # Servidor Express
│   ├── init-db.js            # Script de inicialização do DB
│   └── generate-hash.js      # Gerador de hash de senhas
├── database/
│   └── schema.sql            # Schema do banco de dados
├── js/
│   ├── api.js                # API client
│   ├── auth-api.js           # Autenticação frontend
│   ├── cart-api.js           # Carrinho frontend
│   └── admin-api.js          # Admin frontend
├── css/                      # Estilos
├── img/                      # Imagens dos produtos
├── pages/                    # Páginas do site
├── index.html                # Página inicial
├── admin.html                # Painel admin
├── admin-login.html          # Login admin
└── login.html                # Login usuário
```

## Testes Manuais

### Testar API de Produtos
```bash
# Listar produtos
curl http://localhost:3000/api/products

# Obter produto por ID
curl http://localhost:3000/api/products/1
```

### Testar Autenticação
```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Suporte

Para problemas técnicos:
1. Verifique o console do navegador para erros JavaScript
2. Verifique o terminal onde o servidor está rodando
3. Consulte o arquivo RELATORIO_IMPLEMENTACAO.md para detalhes
