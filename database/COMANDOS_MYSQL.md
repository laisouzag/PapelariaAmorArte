# Comandos para Criação do Banco de Dados MySQL

## Pré-requisitos

- MySQL Server 5.7+ ou 8.0+ instalado
- Usuário MySQL com privilégios de CREATE DATABASE
- Acesso ao terminal/linha de comando

## Método 1: Via Linha de Comando MySQL

### Passo 1: Acessar o MySQL
```bash
mysql -u root -p
```
Será solicitada a senha do usuário root.

### Passo 2: Executar o Script SQL
```bash
source c:/Users/alais/Desktop/Papelaria\ Amor\ e\ Arte/database/schema_completo.sql
```

Ou em uma linha:
```bash
mysql -u root -p < "c:\Users\alais\Desktop\Papelaria Amor e Arte\database\schema_completo.sql"
```

### Passo 3: Verificar Criação
```sql
USE papelaria_amor_arte_completo;
SHOW TABLES;
```

## Método 2: Via Script Node.js

### Passo 1: Atualizar o Script de Inicialização
O arquivo `backend/init-db.js` já foi criado. Atualize-o para usar o novo schema:

```javascript
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('Conectando ao MySQL...');
        
        // Conectar ao servidor MySQL (sem banco de dados)
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '' // Altere se definiu uma senha
        });

        console.log('Conectado ao servidor MySQL');
        
        // Ler e executar schema_completo.sql
        const schemaPath = path.join(__dirname, '../database/schema_completo.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Dividir por ponto e vírgula e executar cada statement
        const statements = schema.split(';').filter(s => s.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await connection.execute(statement);
                    console.log('Statement executado com sucesso');
                } catch (error) {
                    if (!error.message.includes('already exists')) {
                        console.error('Erro ao executar statement:', error.message);
                    }
                }
            }
        }

        console.log('Banco de dados inicializado com sucesso!');
        await connection.end();
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error.message);
        process.exit(1);
    }
}

initializeDatabase();
```

### Passo 2: Executar o Script
```bash
cd backend
node init-db.js
```

## Método 3: Via phpMyAdmin (XAMPP/WAMP)

### Passo 1: Acessar phpMyAdmin
Abra o navegador e acesse: `http://localhost/phpmyadmin`

### Passo 2: Importar o Script
1. Clique na aba "Importar"
2. Clique em "Escolher arquivo"
3. Selecione `database/schema_completo.sql`
4. Clique em "Executar"

### Passo 3: Verificar
1. No menu lateral, selecione o banco `papelaria_amor_arte_completo`
2. Clique na aba "Estrutura" para ver as tabelas criadas

## Método 4: Via MySQL Workbench

### Passo 1: Abrir MySQL Workbench
Inicie o MySQL Workbench e conecte-se ao seu servidor MySQL.

### Passo 2: Criar Nova Query
1. Clique em "File" → "New Query Tab"
2. Copie o conteúdo de `database/schema_completo.sql`
3. Cole no editor de query
4. Clique no ícone de raio (Execute)

### Passo 3: Verificar
No painel "Schemas", você verá o banco `papelaria_amor_arte_completo` com todas as tabelas.

## Método 5: Via Docker

### Passo 1: Criar Dockerfile
```dockerfile
FROM mysql:8.0
COPY database/schema_completo.sql /docker-entrypoint-initdb.d/
ENV MYSQL_ROOT_PASSWORD=
ENV MYSQL_DATABASE=papelaria_amor_arte_completo
```

### Passo 2: Construir e Executar Container
```bash
docker build -t papelaria-mysql .
docker run -d -p 3306:3306 --name papelaria-db papelaria-mysql
```

### Passo 3: Verificar
```bash
docker exec -it papelaria-db mysql -u root -p
```

## Verificação da Instalação

### Verificar Tabelas Criadas
```sql
USE papelaria_amor_arte_completo;
SHOW TABLES;
```

Saída esperada:
```
+-----------------------------------+
| Tables_in_papelaria_amor_arte_completo |
+-----------------------------------+
| activity_logs                     |
| addresses                         |
| admin_users                       |
| cart_items                        |
| carts                             |
| categories                        |
| coupon_usage                      |
| coupons                           |
| order_items                       |
| orders                            |
| payments                          |
| product_images                    |
| product_reviews                   |
| products                          |
| stock_movements                   |
| system_settings                   |
| users                             |
| wishlist                          |
+-----------------------------------+
```

### Verificar Dados de Exemplo
```sql
-- Verificar categorias
SELECT COUNT(*) FROM categories;

-- Verificar produtos
SELECT COUNT(*) FROM products;

-- Verificar administrador
SELECT * FROM admin_users;

-- Verificar cupons
SELECT * FROM coupons;
```

### Verificar Relacionamentos
```sql
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    TABLE_SCHEMA = 'papelaria_amor_arte_completo'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Verificar Índices
```sql
SHOW INDEX FROM products;
SHOW INDEX FROM orders;
SHOW INDEX FROM users;
```

## Atualizar Configuração do Backend

### Atualizar backend/.env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=  # Sua senha do MySQL
DB_NAME=papelaria_amor_arte_completo
DB_PORT=3306
```

### Atualizar backend/config/database.js (se necessário)
```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'papelaria_amor_arte_completo',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

## Testar Conexão

### Testar via Node.js
```bash
cd backend
node -e "const mysql = require('mysql2/promise'); mysql.createConnection({host:'localhost',user:'root',password:'',database:'papelaria_amor_arte_completo'}).then(conn => {console.log('Conexão bem-sucedida!'); conn.end();}).catch(err => console.error('Erro:', err.message));"
```

### Testar via Backend
```bash
cd backend
node server.js
```

Se aparecer "Database connected successfully", a configuração está correta.

## Comandos Úteis de Manutenção

### Backup do Banco de Dados
```bash
mysqldump -u root -p papelaria_amor_arte_completo > backup_papelaria.sql
```

### Restaurar Backup
```bash
mysql -u root -p papelaria_amor_arte_completo < backup_papelaria.sql
```

### Limpar Banco de Dados (Cuidado!)
```sql
DROP DATABASE papelaria_amor_arte_completo;
```

### Recriar Banco de Dados
```sql
DROP DATABASE IF EXISTS papelaria_amor_arte_completo;
CREATE DATABASE papelaria_amor_arte_completo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Verificar Tamanho do Banco
```sql
SELECT 
    table_name AS 'Tabela',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)'
FROM 
    information_schema.TABLES
WHERE 
    table_schema = 'papelaria_amor_arte_completo'
ORDER BY 
    (data_length + index_length) DESC;
```

### Verificar Conexões Ativas
```sql
SHOW PROCESSLIST;
```

### Otimizar Tabelas
```sql
USE papelaria_amor_arte_completo;
OPTIMIZE TABLE products;
OPTIMIZE TABLE orders;
OPTIMIZE TABLE users;
```

## Solução de Problemas

### Erro: "Access denied for user 'root'@'localhost'"
**Solução:**
- Verifique a senha no arquivo `.env`
- Tente conectar manualmente: `mysql -u root -p`

### Erro: "Unknown database 'papelaria_amor_arte_completo'"
**Solução:**
- Execute o script de criação do banco
- Verifique se o banco foi criado: `SHOW DATABASES;`

### Erro: "Can't connect to MySQL server"
**Solução:**
- Verifique se o serviço MySQL está rodando
- Windows: Services.msc → MySQL → Start
- Linux: `sudo systemctl start mysql`

### Erro: "Table 'papelaria_amor_arte_completo.users' doesn't exist"
**Solução:**
- Verifique se o script foi executado completamente
- Reexecute o script SQL

### Erro: "Foreign key constraint fails"
**Solução:**
- Verifique a ordem de inserção dos dados
- Certifique-se que as tabelas referenciadas existem
- Use `SET FOREIGN_KEY_CHECKS=0;` antes da inserção e `SET FOREIGN_KEY_CHECKS=1;` depois

## Próximos Passos

Após criar o banco de dados:

1. ✅ Atualize `backend/.env` com as credenciais corretas
2. ✅ Teste a conexão com o backend
3. ✅ Inicie o servidor: `node backend/server.js`
4. ✅ Teste as APIs
5. ✅ Acesse a aplicação: `http://localhost:3000`

## Credenciais de Teste

### Administrador
- Email: admin@papelaria.com
- Senha: admin123

### Usuário de Teste
- Registre um novo usuário através da interface

## Documentação Adicional

- [Diagrama Lógico](./DIAGRAMA_LOGICO.md) - Estrutura detalhada das tabelas
- [Schema SQL](./schema_completo.sql) - Script completo de criação
- [Guia de Instalação MySQL](../INSTALAR_MYSQL.md) - Como instalar MySQL
