# Diagrama Lógico do Banco de Dados - Papelaria Amor e Arte

## Visão Geral do Sistema

O banco de dados foi projetado para suportar um e-commerce completo de papelaria com funcionalidades avançadas de gestão de produtos, pedidos, pagamentos e relacionamento com clientes.

## Estrutura das Tabelas

### 1. Tabelas de Usuários e Autenticação

#### `users` - Tabela Principal de Usuários
```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ name             VARCHAR(255) NOT NULL                      │
│ email            VARCHAR(255) NOT NULL UNIQUE              │
│ phone            VARCHAR(20)                                │
│ cpf              VARCHAR(14) UNIQUE                         │
│ password         VARCHAR(255) NOT NULL                      │
│ birth_date       DATE                                       │
│ active           BOOLEAN DEFAULT TRUE                       │
│ email_verified   BOOLEAN DEFAULT FALSE                      │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `admin_users` - Administradores do Sistema
```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN_USERS                             │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ name             VARCHAR(255) NOT NULL                      │
│ email            VARCHAR(255) NOT NULL UNIQUE              │
│ password         VARCHAR(255) NOT NULL                      │
│ role             ENUM('super_admin','admin','manager',      │
│                  'support') DEFAULT 'admin'                 │
│ active           BOOLEAN DEFAULT TRUE                       │
│ last_login       TIMESTAMP NULL                             │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

### 2. Tabelas de Endereços

#### `addresses` - Endereços de Entrega
```
┌─────────────────────────────────────────────────────────────┐
│                      ADDRESSES                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ user_id (FK)     INT NOT NULL → users.id                    │
│ street           VARCHAR(255) NOT NULL                      │
│ number           VARCHAR(20) NOT NULL                       │
│ complement       VARCHAR(255)                               │
│ neighborhood     VARCHAR(255) NOT NULL                      │
│ city             VARCHAR(255) NOT NULL                      │
│ state            VARCHAR(2) NOT NULL                        │
│ zip_code         VARCHAR(10) NOT NULL                       │
│ country          VARCHAR(100) DEFAULT 'Brasil'              │
│ is_default       BOOLEAN DEFAULT FALSE                      │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

### 3. Tabelas de Produtos e Categorias

#### `categories` - Categorias de Produtos
```
┌─────────────────────────────────────────────────────────────┐
│                     CATEGORIES                             │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ name             VARCHAR(255) NOT NULL                      │
│ slug             VARCHAR(255) NOT NULL UNIQUE              │
│ description      TEXT                                       │
│ parent_id (FK)   INT NULL → categories.id (self-reference)  │
│ image            VARCHAR(500)                               │
│ active           BOOLEAN DEFAULT TRUE                       │
│ display_order    INT DEFAULT 0                              │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `products` - Produtos
```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTS                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ name             VARCHAR(255) NOT NULL                      │
│ slug             VARCHAR(255) NOT NULL UNIQUE              │
│ description      TEXT                                       │
│ short_description VARCHAR(500)                              │
│ price            DECIMAL(10,2) NOT NULL                     │
│ promotional_price DECIMAL(10,2)                             │
│ sku              VARCHAR(100) UNIQUE                        │
│ category_id (FK) INT → categories.id                        │
│ brand            VARCHAR(100)                               │
│ weight           DECIMAL(10,2)                              │
│ dimensions       VARCHAR(100)                               │
│ stock            INT DEFAULT 0                              │
│ min_stock        INT DEFAULT 5                              │
│ active           BOOLEAN DEFAULT TRUE                       │
│ featured         BOOLEAN DEFAULT FALSE                      │
│ views            INT DEFAULT 0                              │
│ sales_count      INT DEFAULT 0                              │
│ rating           DECIMAL(3,2) DEFAULT 0.00                  │
│ rating_count     INT DEFAULT 0                              │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `product_images` - Imagens de Produtos
```
┌─────────────────────────────────────────────────────────────┐
│                  PRODUCT_IMAGES                            │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ product_id (FK)  INT NOT NULL → products.id                 │
│ image_url        VARCHAR(500) NOT NULL                      │
│ alt_text         VARCHAR(255)                               │
│ is_primary       BOOLEAN DEFAULT FALSE                      │
│ display_order    INT DEFAULT 0                              │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
└─────────────────────────────────────────────────────────────┘
```

#### `stock_movements` - Movimentação de Estoque
```
┌─────────────────────────────────────────────────────────────┐
│                 STOCK_MOVEMENTS                            │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ product_id (FK)  INT NOT NULL → products.id                 │
│ quantity         INT NOT NULL                               │
│ movement_type    ENUM('entrada','saida','ajuste',          │
│                  'devolucao') NOT NULL                       │
│ reason           VARCHAR(255)                               │
│ reference_id     INT NULL                                   │
│ reference_type   VARCHAR(50) NULL                           │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
└─────────────────────────────────────────────────────────────┘
```

### 4. Tabelas de Carrinho de Compras

#### `carts` - Carrinhos
```
┌─────────────────────────────────────────────────────────────┐
│                        CARTS                                │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ user_id (FK)     INT NULL → users.id                        │
│ session_id       VARCHAR(255) NULL                          │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `cart_items` - Itens do Carrinho
```
┌─────────────────────────────────────────────────────────────┐
│                     CART_ITEMS                             │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ cart_id (FK)     INT NOT NULL → carts.id                    │
│ product_id (FK)  INT NOT NULL → products.id                 │
│ quantity         INT NOT NULL DEFAULT 1                     │
│ unit_price       DECIMAL(10,2) NOT NULL                    │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

### 5. Tabelas de Pedidos

#### `orders` - Pedidos
```
┌─────────────────────────────────────────────────────────────┐
│                       ORDERS                               │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ order_number     VARCHAR(50) UNIQUE NOT NULL               │
│ user_id (FK)     INT NOT NULL → users.id                    │
│ address_id (FK)  INT NOT NULL → addresses.id                │
│ subtotal         DECIMAL(10,2) NOT NULL                     │
│ shipping_cost    DECIMAL(10,2) DEFAULT 0                   │
│ discount         DECIMAL(10,2) DEFAULT 0                   │
│ total            DECIMAL(10,2) NOT NULL                     │
│ status           ENUM('pendente','confirmado',              │
│                  'processando','enviado','entregue',       │
│                  'cancelado','devolvido')                   │
│ payment_status   ENUM('pendente','processando',             │
│                  'pago','falha','cancelado',                │
│                  'reembolsado')                            │
│ payment_method   VARCHAR(50)                               │
│ notes            TEXT                                       │
│ whatsapp_message TEXT                                       │
│ tracking_code    VARCHAR(100)                               │
│ estimated_delivery DATE                                    │
│ delivered_at     TIMESTAMP NULL                             │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `order_items` - Itens do Pedido
```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER_ITEMS                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ order_id (FK)    INT NOT NULL → orders.id                   │
│ product_id (FK)  INT NOT NULL → products.id                 │
│ product_name     VARCHAR(255) NOT NULL                      │
│ product_sku      VARCHAR(100)                               │
│ quantity         INT NOT NULL                               │
│ unit_price       DECIMAL(10,2) NOT NULL                    │
│ subtotal         DECIMAL(10,2) NOT NULL                     │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
└─────────────────────────────────────────────────────────────┘
```

### 6. Tabelas de Pagamentos

#### `payments` - Pagamentos
```
┌─────────────────────────────────────────────────────────────┐
│                      PAYMENTS                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ order_id (FK)    INT NOT NULL → orders.id                   │
│ payment_method   ENUM('credit_card','debit_card',           │
│                  'pix','boleto','paypal',                   │
│                  'whatsapp') NOT NULL                       │
│ amount           DECIMAL(10,2) NOT NULL                    │
│ status           ENUM('pendente','processando',            │
│                  'aprovado','recusado',                     │
│                  'cancelado','reembolsado')                 │
│ transaction_id   VARCHAR(255)                               │
│ payment_date     TIMESTAMP NULL                             │
│ payment_data     JSON                                       │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

### 7. Tabelas de Avaliações e Interação

#### `product_reviews` - Avaliações de Produtos
```
┌─────────────────────────────────────────────────────────────┐
│                  PRODUCT_REVIEWS                           │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ product_id (FK)  INT NOT NULL → products.id                 │
│ user_id (FK)     INT NOT NULL → users.id                    │
│ order_id (FK)    INT NULL → orders.id                       │
│ rating           INT NOT NULL (1-5)                         │
│ title            VARCHAR(255)                               │
│ comment          TEXT                                       │
│ approved         BOOLEAN DEFAULT FALSE                      │
│ helpful_count    INT DEFAULT 0                              │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `wishlist` - Lista de Desejos
```
┌─────────────────────────────────────────────────────────────┐
│                      WISHLIST                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ user_id (FK)     INT NOT NULL → users.id                    │
│ product_id (FK)  INT NOT NULL → products.id                 │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
└─────────────────────────────────────────────────────────────┘
```

### 8. Tabelas de Cupons e Promoções

#### `coupons` - Cupons de Desconto
```
┌─────────────────────────────────────────────────────────────┐
│                       COUPONS                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ code             VARCHAR(50) UNIQUE NOT NULL                │
│ description      VARCHAR(255)                               │
│ discount_type    ENUM('percentage','fixed') NOT NULL         │
│ discount_value   DECIMAL(10,2) NOT NULL                     │
│ min_purchase     DECIMAL(10,2) DEFAULT 0                   │
│ max_discount     DECIMAL(10,2) NULL                         │
│ usage_limit      INT NULL                                   │
│ used_count       INT DEFAULT 0                              │
│ valid_from       TIMESTAMP NOT NULL                         │
│ valid_until      TIMESTAMP NOT NULL                         │
│ active           BOOLEAN DEFAULT TRUE                       │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

#### `coupon_usage` - Registro de Uso de Cupons
```
┌─────────────────────────────────────────────────────────────┐
│                    COUPON_USAGE                            │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ coupon_id (FK)   INT NOT NULL → coupons.id                  │
│ order_id (FK)    INT NOT NULL → orders.id                   │
│ user_id (FK)     INT NOT NULL → users.id                    │
│ discount_amount  DECIMAL(10,2) NOT NULL                    │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
└─────────────────────────────────────────────────────────────┘
```

### 9. Tabelas de Sistema e Auditoria

#### `activity_logs` - Logs de Atividades
```
┌─────────────────────────────────────────────────────────────┐
│                   ACTIVITY_LOGS                            │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ user_id (FK)     INT NULL → users.id                        │
│ admin_id (FK)    INT NULL → admin_users.id                  │
│ action           VARCHAR(100) NOT NULL                      │
│ entity_type      VARCHAR(50)                                │
│ entity_id        INT                                        │
│ details          JSON                                       │
│ ip_address       VARCHAR(45)                                │
│ user_agent       TEXT                                       │
│ created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP        │
└─────────────────────────────────────────────────────────────┘
```

#### `system_settings` - Configurações do Sistema
```
┌─────────────────────────────────────────────────────────────┐
│                  SYSTEM_SETTINGS                           │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT                         │
│ setting_key      VARCHAR(100) UNIQUE NOT NULL               │
│ setting_value    TEXT                                       │
│ description      TEXT                                       │
│ updated_at       TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       │
└─────────────────────────────────────────────────────────────┘
```

## Relacionamentos Entre Tabelas

### Relacionamentos Principais

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     USERS    │────────▶│  ADDRESSES   │────────▶│    ORDERS    │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                    │
       │                                                    │
       ▼                                                    ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  CART_ITEMS  │◀────────│    CARTS     │         │ ORDER_ITEMS  │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                    │
       │                                                    │
       ▼                                                    ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  PRODUCTS    │────────▶PRODUCT_IMAGES│         │  PAYMENTS    │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                    │
       │                                                    │
       ▼                                                    ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ CATEGORIES   │         │STOCK_MOVEMENT│         │COUPON_USAGE  │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                    ▲
       │                                                    │
       ▼                                                    │
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  WISHLIST    │         │PRODUCT_REVIEWS│         │   COUPONS    │
└──────────────┘         └──────────────┘         └──────────────┘
```

### Detalhes dos Relacionamentos

#### 1. Usuários → Endereços (1:N)
- Um usuário pode ter múltiplos endereços
- Cada endereço pertence a um usuário
- **CASCADE DELETE**: Se usuário for deletado, endereços são deletados

#### 2. Usuários → Pedidos (1:N)
- Um usuário pode fazer múltiplos pedidos
- Cada pedido pertence a um usuário
- **RESTRICT DELETE**: Não permite deletar usuário com pedidos

#### 3. Usuários → Carrinhos (1:1)
- Um usuário pode ter um carrinho ativo
- Carrinho pode existir sem usuário (session_id)

#### 4. Categorias → Produtos (1:N)
- Uma categoria pode ter múltiplos produtos
- Cada produto pertence a uma categoria
- **SET NULL**: Se categoria for deletada, produto fica sem categoria

#### 5. Categorias → Categorias (Self-Reference)
- Categorias podem ter subcategorias
- **SET NULL**: Se categoria pai for deletada, filhos ficam sem pai

#### 6. Produtos → Imagens (1:N)
- Um produto pode ter múltiplas imagens
- Cada imagem pertence a um produto
- **CASCADE DELETE**: Se produto for deletado, imagens são deletadas

#### 7. Produtos → Movimentação de Estoque (1:N)
- Um produto pode ter múltiplas movimentações
- Cada movimentação pertence a um produto
- **CASCADE DELETE**: Se produto for deletado, movimentações são deletadas

#### 8. Pedidos → Itens do Pedido (1:N)
- Um pedido pode ter múltiplos itens
- Cada item pertence a um pedido
- **CASCADE DELETE**: Se pedido for deletado, itens são deletados

#### 9. Pedidos → Pagamentos (1:N)
- Um pedido pode ter múltiplos pagamentos
- Cada pagamento pertence a um pedido
- **CASCADE DELETE**: Se pedido for deletado, pagamentos são deletados

#### 10. Produtos → Avaliações (1:N)
- Um produto pode ter múltiplas avaliações
- Cada avaliação pertence a um produto
- **CASCADE DELETE**: Se produto for deletado, avaliações são deletadas

#### 11. Usuários → Avaliações (1:N)
- Um usuário pode fazer múltiplas avaliações
- Cada avaliação pertence a um usuário
- **CASCADE DELETE**: Se usuário for deletado, avaliações são deletadas

#### 12. Usuários → Wishlist (1:N)
- Um usuário pode ter múltiplos itens na lista de desejos
- Cada item da wishlist pertence a um usuário
- **CASCADE DELETE**: Se usuário for deletado, wishlist é deletada

#### 13. Cupons → Uso de Cupons (1:N)
- Um cupom pode ser usado múltiplas vezes
- Cada uso pertence a um cupom
- **CASCADE DELETE**: Se cupom for deletado, usos são deletados

## Índices para Otimização

### Índices de Performance

#### Tabela `users`
- `idx_email` - Para login rápido
- `idx_cpf` - Para busca por CPF
- `idx_active` - Para filtrar usuários ativos
- `idx_created_at` - Para relatórios temporais

#### Tabela `products`
- `idx_slug` - Para URLs amigáveis
- `idx_sku` - Para busca por SKU
- `idx_category_id` - Para filtrar por categoria
- `idx_active` - Para produtos ativos
- `idx_featured` - Para produtos em destaque
- `idx_price` - Para ordenação por preço
- `idx_stock` - Para controle de estoque
- `idx_rating` - Para ordenação por avaliação
- `idx_search` - FULLTEXT para busca textual

#### Tabela `orders`
- `idx_order_number` - Para busca rápida por número
- `idx_user_id` - Para pedidos do usuário
- `idx_status` - Para filtrar por status
- `idx_payment_status` - Para filtrar por status de pagamento
- `idx_created_at` - Para relatórios temporais
- `idx_tracking_code` - Para rastreamento

#### Tabela `categories`
- `idx_slug` - Para URLs amigáveis
- `idx_parent_id` - Para subcategorias
- `idx_active` - Para categorias ativas
- `idx_display_order` - Para ordenação

### Índices Únicos

- `users.email` - Email único por usuário
- `users.cpf` - CPF único por usuário
- `categories.slug` - Slug único por categoria
- `products.slug` - Slug único por produto
- `products.sku` - SKU único por produto
- `orders.order_number` - Número do pedido único
- `coupons.code` - Código do cupom único

### Índices Compostos

- `carts.unique_cart` - (user_id, session_id) - Para evitar carrinhos duplicados
- `cart_items.unique_cart_product` - (cart_id, product_id) - Para evitar itens duplicados
- `product_reviews.unique_user_product` - (user_id, product_id, order_id) - Uma avaliação por produto por pedido

## Normalização do Banco de Dados

O banco de dados segue a **3ª Forma Normal (3NF)**:

1. **1NF**: Todos os campos são atômicos
2. **2NF**: Todos os campos não-chave dependem da chave primária
3. **3NF**: Não há dependências transitivas

### Vantagens da Normalização:
- Redução de redundância de dados
- Consistência de dados
- Facilidade de manutenção
- Melhor performance em operações de escrita

## Estratégias de Performance

### 1. Índices Estratégicos
- Índices em colunas frequentemente usadas em WHERE, JOIN e ORDER BY
- Índices FULLTEXT para busca textual
- Índices compostos para consultas complexas

### 2. Particionamento (Futuro)
- Particionar tabela de pedidos por data
- Particionar tabela de logs por data

### 3. Cache
- Implementar cache para consultas frequentes
- Cache de categorias e produtos em destaque

### 4. Otimização de Consultas
- Usar EXPLAIN para analisar queries
- Evitar SELECT *
- Usar LIMIT em consultas paginadas

## Segurança do Banco de Dados

### 1. Privilégios
- Usuário de aplicação com privilégios limitados
- Separar usuários de leitura e escrita

### 2. Senhas
- Senhas hash com bcrypt
- Nunca armazenar senhas em texto plano

### 3. SQL Injection
- Usar prepared statements
- Validar todos os inputs

### 4. Auditoria
- Tabela `activity_logs` para rastrear ações
- Log de alterações críticas

## Escalabilidade

### Vertical Scaling
- Aumentar recursos do servidor MySQL
- Otimizar configurações do MySQL

### Horizontal Scaling
- Replicação master-slave para leitura
- Sharding por categoria de produtos

### Backup e Recuperação
- Backups diários automáticos
- Binlog para point-in-time recovery
- Backups em nuvem para redundância
