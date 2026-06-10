# Papelaria Amor e Arte - Full Stack Application

## Descrição

Sistema de e-commerce completo para a Papelaria Amor e Arte com backend em Node.js/Express e banco de dados MySQL.

## Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome (ícones)
- Google Fonts

### Backend
- Node.js
- Express.js
- MySQL
- JWT (autenticação)
- bcryptjs (hash de senhas)
- CORS

## Estrutura do Projeto

```
Papelaria Amor e Arte/
├── backend/              # Backend API
│   ├── config/          # Configurações
│   │   └── database.js # Conexão com MySQL
│   ├── middleware/      # Middlewares
│   │   └── auth.js     # Autenticação JWT
│   ├── routes/         # Rotas da API
│   │   ├── auth.js     # Autenticação de usuários
│   │   ├── products.js # Produtos
│   │   ├── orders.js   # Pedidos
│   │   ├── users.js    # Usuários
│   │   ├── categories.js # Categorias
│   │   └── admin.js    # Admin
│   ├── server.js       # Servidor principal
│   ├── package.json    # Dependências
│   └── .env            # Variáveis de ambiente
├── database/           # Banco de dados
│   └── schema.sql      # Schema do banco de dados
├── css/                # Estilos
├── img/                # Imagens
├── js/                 # JavaScript
│   ├── api.js          # Cliente API
│   ├── data-api.js     # Gerenciador de dados com API
│   ├── auth-api.js     # Autenticação com API
│   └── cart-api.js     # Carrinho com API
├── pages/              # Páginas adicionais
└── *.html             # Páginas HTML
```

## Instalação e Configuração

### Pré-requisitos

- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)
- Navegador web moderno

### Passo 1: Instalar MySQL

1. Baixe e instale o MySQL: https://dev.mysql.com/downloads/mysql/
2. Durante a instalação, defina uma senha para o usuário root
3. Anote a senha, você precisará dela depois

### Passo 2: Configurar o Banco de Dados

1. Abra o MySQL Command Line Client ou MySQL Workbench
2. Execute o script do banco de dados:

```bash
mysql -u root -p < database/schema.sql
```

Ou no MySQL Workbench:
- Abra uma nova query
- Carregue o arquivo `database/schema.sql`
- Execute o script

### Passo 3: Configurar Variáveis de Ambiente

1. Abra o arquivo `backend/.env`
2. Configure as variáveis de ambiente:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=papelaria_amor_arte
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@papelaria.com
ADMIN_PASSWORD=admin123
```

**Importante:** Substitua `sua_senha_aqui` pela senha do MySQL que você definiu na instalação.

### Passo 4: Instalar Dependências do Backend

1. Abra o terminal na pasta do projeto
2. Navegue até a pasta backend:

```bash
cd backend
```

3. Instale as dependências:

```bash
npm install
```

### Passo 5: Iniciar o Servidor

1. Na pasta backend, execute:

```bash
npm start
```

Ou para desenvolvimento (com auto-reload):

```bash
npm run dev
```

2. O servidor estará rodando em: http://localhost:3000

### Passo 6: Acessar a Aplicação

1. Abra o navegador e acesse: http://localhost:3000
2. A aplicação estará funcionando com o banco de dados MySQL

## Credenciais de Acesso

### Admin
- Email: admin@papelaria.com
- Senha: admin123

### Usuário de Teste
- Cadastre um novo usuário através da página de cadastro

## Funcionalidades

### Clientes
- ✅ Cadastro de usuários
- ✅ Login e logout
- ✅ Visualização de produtos
- ✅ Carrinho de compras
- ✅ Finalização de pedidos via WhatsApp
- ✅ Histórico de pedidos

### Admin
- ✅ Login administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Gerenciamento de categorias
- ✅ Visualização de pedidos
- ✅ Atualização de status de pedidos

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter usuário atual

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter produto por ID
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/my-orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter pedido por ID

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Obter categoria por ID
- `POST /api/categories` - Criar categoria (admin)
- `PUT /api/categories/:id` - Atualizar categoria (admin)
- `DELETE /api/categories/:id` - Deletar categoria (admin)

### Admin
- `POST /api/admin/login` - Login admin
- `GET /api/admin/stats` - Estatísticas do dashboard
- `GET /api/admin/orders` - Listar todos os pedidos
- `PUT /api/admin/orders/:id/status` - Atualizar status do pedido

## Migração do LocalStorage para API

O projeto foi migrado de localStorage para API com banco de dados MySQL. Os arquivos JavaScript foram atualizados:

- `js/data.js` → `js/data-api.js` (gerenciamento de dados via API)
- `js/auth.js` → `js/auth-api.js` (autenticação via API)
- `js/cart.js` → `js/cart-api.js` (carrinho com pedidos via API)
- `js/api.js` (novo cliente API)

Para usar a versão com API, atualize os scripts nos arquivos HTML:

```html
<!-- Antes -->
<script src="js/data.js"></script>
<script src="js/auth.js"></script>
<script src="js/cart.js"></script>

<!-- Depois -->
<script src="js/api.js"></script>
<script src="js/data-api.js"></script>
<script src="js/auth-api.js"></script>
<script src="js/cart-api.js"></script>
```

## Solução de Problemas

### Erro de Conexão com Banco de Dados

Se aparecer erro de conexão:
1. Verifique se o MySQL está rodando
2. Verifique as credenciais no arquivo `.env`
3. Certifique-se de que o banco de dados foi criado

### Erro de Porta Ocupada

Se a porta 3000 estiver ocupada:
1. Altere a porta no arquivo `.env`
2. Ou pare o processo que está usando a porta 3000

### Produtos Não Aparecem

1. Verifique se o banco de dados foi populado corretamente
2. Execute o script `schema.sql` novamente
3. Verifique o console do navegador para erros

## Desenvolvimento

### Adicionar Novas Rotas

1. Crie o arquivo de rota em `backend/routes/`
2. Adicione a rota em `backend/server.js`
3. Adicione os métodos correspondentes no cliente API (`js/api.js`)

### Modificar o Banco de Dados

1. Faça as alterações no arquivo `database/schema.sql`
2. Execute o script novamente no MySQL
3. Reinicie o servidor

## Segurança

⚠️ **Importante para Produção:**

1. Altere o `JWT_SECRET` no arquivo `.env`
2. Altere a senha do admin no banco de dados
3. Use HTTPS em produção
4. Configure firewall adequado
5. Faça backups regulares do banco de dados

## Suporte

Para problemas ou dúvidas, verifique:
1. Console do navegador para erros de frontend
2. Terminal para erros de backend
3. Logs do MySQL para erros de banco de dados

## Licença

© 2025 Papelaria Amor e Arte. Todos os direitos reservados.
