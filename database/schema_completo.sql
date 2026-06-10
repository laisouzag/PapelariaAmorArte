-- ============================================================================
-- BANCO DE DADOS COMPLETO - PAPELARIA AMOR E ARTE
-- E-commerce de Papelaria com Sistema Completo
-- ============================================================================

-- Limpar banco de dados existente (cuidado em produção!)
DROP DATABASE IF EXISTS papelaria_amor_arte_completo;
CREATE DATABASE papelaria_amor_arte_completo
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE papelaria_amor_arte_completo;

-- ============================================================================
-- TABELA DE USUÁRIOS
-- ============================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    password VARCHAR(255) NOT NULL,
    birth_date DATE,
    active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_cpf (cpf),
    INDEX idx_active (active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE ENDEREÇOS
-- ============================================================================
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'Brasil',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_zip_code (zip_code),
    INDEX idx_city (city),
    INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE CATEGORIAS
-- ============================================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT NULL,
    image VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id),
    INDEX idx_active (active),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE PRODUTOS
-- ============================================================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    promotional_price DECIMAL(10, 2),
    sku VARCHAR(100) UNIQUE,
    category_id INT,
    brand VARCHAR(100),
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_sku (sku),
    INDEX idx_category_id (category_id),
    INDEX idx_active (active),
    INDEX idx_featured (featured),
    INDEX idx_price (price),
    INDEX idx_stock (stock),
    INDEX idx_rating (rating),
    FULLTEXT idx_search (name, description, short_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE IMAGENS DE PRODUTOS
-- ============================================================================
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE ESTOQUE (MOVIMENTAÇÃO)
-- ============================================================================
CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    movement_type ENUM('entrada', 'saida', 'ajuste', 'devolucao') NOT NULL,
    reason VARCHAR(255),
    reference_id INT NULL,
    reference_type VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE CARRINHO
-- ============================================================================
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    session_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    UNIQUE KEY unique_cart (user_id, session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE ITENS DO CARRINHO
-- ============================================================================
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_cart_id (cart_id),
    INDEX idx_product_id (product_id),
    UNIQUE KEY unique_cart_product (cart_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE PEDIDOS
-- ============================================================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pendente', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado', 'devolvido') DEFAULT 'pendente',
    payment_status ENUM('pendente', 'processando', 'pago', 'falha', 'cancelado', 'reembolsado') DEFAULT 'pendente',
    payment_method VARCHAR(50),
    notes TEXT,
    whatsapp_message TEXT,
    tracking_code VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_tracking_code (tracking_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE ITENS DO PEDIDO
-- ============================================================================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_product_sku (product_sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE PAGAMENTOS
-- ============================================================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'pix', 'boleto', 'paypal', 'whatsapp') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pendente', 'processando', 'aprovado', 'recusado', 'cancelado', 'reembolsado') DEFAULT 'pendente',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP NULL,
    payment_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE AVALIAÇÕES DE PRODUTOS
-- ============================================================================
CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    approved BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (approved),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_product (user_id, product_id, order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE WISHLIST (LISTA DE DESEJOS)
-- ============================================================================
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE CUPONS DE DESCONTO
-- ============================================================================
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2) NULL,
    usage_limit INT NULL,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (active),
    INDEX idx_valid_from (valid_from),
    INDEX idx_valid_until (valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE USO DE CUPONS
-- ============================================================================
CREATE TABLE coupon_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE ADMINISTRADORES
-- ============================================================================
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'manager', 'support') DEFAULT 'admin',
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE LOGS DE ATIVIDADES (AUDITORIA)
-- ============================================================================
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    admin_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA DE CONFIGURAÇÕES DO SISTEMA
-- ============================================================================
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DADOS DE EXEMPLO PARA TESTES
-- ============================================================================

-- Inserir Administrador Padrão (senha: admin123)
INSERT INTO admin_users (name, email, password, role) 
VALUES ('Administrador Principal', 'admin@papelaria.com', '$2a$10$6PFBLlamGsVJhr.BI.Pk.eijDqSHpp7XKq94aC9kt2lOMu/HYNEpK', 'super_admin');

-- Inserir Categorias
INSERT INTO categories (name, slug, description, display_order) VALUES
('Cadernos e Agendas', 'cadernos-agendas', 'Agendas e cadernos personalizados para todos os gostos', 1),
('Terços', 'tercos', 'Terços artesanais e personalizados', 2),
('Cadernos de Oração', 'cadernos-oracao', 'Cadernos especiais para anotar orações', 3),
('Peças em MDF', 'pecas-mdf', 'Peças decorativas em MDF', 4),
('Calendários', 'calendarios', 'Calendários personalizados', 5),
('Blocos de Notas', 'blocos-notas', 'Blocos de notas personalizados', 6),
('Kits', 'kits', 'Kits especiais e presentes', 7),
('Canetas e Lápis', 'canetas-lapis', 'Material de escritório e escolar', 8),
('Papelaria Religiosa', 'papelaria-religiosa', 'Itens religiosos e devocionais', 9),
('Presentes', 'presentes', 'Presentes especiais para todas as ocasiões', 10);

-- Inserir Produtos
INSERT INTO products (name, slug, description, short_description, price, promotional_price, sku, category_id, stock, featured, rating, rating_count) VALUES
('Agenda com Fé 2026', 'agenda-com-fe-2026', 'Agenda personalizada com versículos e mensagens de fé para cada dia do ano. Capa dura com acabamento premium.', 'Agenda 2026 com versículos diários', 49.90, 39.90, 'AGD-2026-001', 1, 50, TRUE, 4.5, 12),
('Agenda São Bento 2026', 'agenda-sao-bento-2026', 'Agenda especial com medalha de São Bento e proteção espiritual. Design elegante e funcional.', 'Agenda com medalha São Bento', 59.90, NULL, 'AGD-2026-002', 1, 30, TRUE, 4.8, 8),
('Planner 2026 Premium', 'planner-2026-premium', 'Planner completo com seções para metas, finanças e espiritualidade. Capa em couro sintético.', 'Planner 2026 premium', 69.90, 59.90, 'PLN-2026-001', 1, 25, TRUE, 4.7, 15),
('Terço Prata 925', 'terco-prata-925', 'Terço artesanal em prata 925 com contas cristais e crucifixo detalhado. Peça de alta qualidade.', 'Terço em prata 925', 149.90, NULL, 'TRC-PR-001', 2, 15, TRUE, 5.0, 6),
('Terço Madeira Natural', 'terco-madeira-natural', 'Terço artesanal em madeira natural com contas polidas e crucifixo de madeira. Simples e elegante.', 'Terço de madeira natural', 29.90, NULL, 'TRC-MAD-001', 2, 40, FALSE, 4.3, 10),
('Terço Nossa Senhora das Graças', 'terco-ns-gracas', 'Terço artesanal com pérolas brancas, crucifixo prateado e medalhão de Nossa Senhora das Graças.', 'Terço Nossa Senhora das Graças', 39.90, NULL, 'TRC-NSG-001', 2, 25, TRUE, 4.6, 14),
('Caderno de Oração Carlos Acutis', 'caderno-oracao-carlos-acutis', 'Caderno para anotar suas orações e agradecimentos com capa ilustrada de Carlos Acutis.', 'Caderno de oração Carlos Acutis', 29.90, NULL, 'CDO-CA-001', 3, 35, TRUE, 4.9, 20),
('Caderno Nossa Senhora Auxiliadora', 'caderno-ns-auxiliadora', 'Caderno de oração com capa ilustrada de Nossa Senhora Auxiliadora, padroeira dos estudantes.', 'Caderno NS Auxiliadora', 34.90, NULL, 'CDO-NSA-001', 3, 30, FALSE, 4.4, 8),
('Chaveiro MDF Personalizado', 'chaveiro-mdf-personalizado', 'Chaveiro em MDF com nome e desenho personalizado. Diversos modelos disponíveis.', 'Chaveiro MDF personalizado', 19.90, 14.90, 'CHV-MDF-001', 4, 60, FALSE, 4.2, 25),
('Placa MDF Família', 'placa-mdf-familia', 'Placa decorativa em MDF para casa com frase sobre família. Diversos tamanhos.', 'Placa MDF família', 39.90, NULL, 'PLC-MDF-001', 4, 20, TRUE, 4.7, 12),
('Calendário de Mesa 2026', 'calendario-mesa-2026', 'Calendário de mesa com versículos mensais e imagens inspiradoras. Suporte em madeira.', 'Calendário de mesa 2026', 39.90, 29.90, 'CLD-MS-001', 5, 45, TRUE, 4.5, 18),
('Calendário Parede 2026', 'calendario-parede-2026', 'Calendário de parede com fotos de santos e versículos. Formato A3.', 'Calendário de parede 2026', 49.90, NULL, 'CLD-PR-001', 5, 30, FALSE, 4.3, 9),
('Bloco de Notas São Paulo', 'bloco-notas-sao-paulo', 'Bloco de notas com capa personalizada do São Paulo FC. 100 folhas.', 'Bloco São Paulo FC', 24.90, NULL, 'BLN-SP-001', 6, 55, FALSE, 4.1, 15),
('Bloco de Notas Corinthians', 'bloco-notas-corinthians', 'Bloco de notas com capa personalizada do Corinthians. 100 folhas.', 'Bloco Corinthians', 24.90, NULL, 'BLN-COR-001', 6, 50, FALSE, 4.0, 12),
('Bloco de Notas Palmeiras', 'bloco-notas-palmeiras', 'Bloco de notas com capa personalizada do Palmeiras. 100 folhas.', 'Bloco Palmeiras', 24.90, NULL, 'BLN-PAL-001', 6, 45, FALSE, 4.2, 10),
('Kit Presente Especial', 'kit-presente-especial', 'Kit com agenda, terço e caderno de oração. Presente perfeito para ocasiões especiais.', 'Kit presente especial', 99.90, 79.90, 'KIT-ESP-001', 7, 15, TRUE, 4.9, 7),
('Kit Primeira Comunhão', 'kit-primeira-comunhao', 'Kit especial para primeira comunhão: terço, caderno e medalha.', 'Kit primeira comunhão', 89.90, NULL, 'KIT-COM-001', 7, 20, TRUE, 5.0, 5),
('Caneta Esferográfica Premium', 'caneta-esferografica-premium', 'Caneta esferográfica de alta qualidade com design elegante. Várias cores disponíveis.', 'Caneta premium', 12.90, NULL, 'CNT-PRE-001', 8, 100, FALSE, 4.4, 30),
('Lápis de Madeira Premium', 'lapis-madeira-premium', 'Lápis de madeira premium com grafite resistente. Caixa com 12 unidades.', 'Lápis premium cx/12', 19.90, NULL, 'LPS-PRE-001', 8, 80, FALSE, 4.3, 22),
('Bíblia Pequena de Bolso', 'biblia-pequena-bolso', 'Bíblia pequena de bolso com capa em couro sintético. Ideal para levar a qualquer lugar.', 'Bíblia de bolso', 79.90, NULL, 'BBL-BOL-001', 9, 25, TRUE, 4.8, 16),
('Santinho de Proteção', 'santinho-protecao', 'Santinho laminado com oração de proteção. Diversos santos disponíveis.', 'Santinho proteção', 4.90, NULL, 'SNT-PRO-001', 9, 200, FALSE, 4.6, 45);

-- Inserir Imagens de Produtos
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES
(1, 'img/Agendas-Planners/Agenda2026Personalizada.png', 'Agenda com Fé 2026', TRUE, 0),
(2, 'img/Agendas-Planners/AgendaPersonalizadaSãoBento.png', 'Agenda São Bento 2026', TRUE, 0),
(3, 'img/Agendas-Planners/Planner2026.png', 'Planner 2026 Premium', TRUE, 0),
(4, 'img/Terços/TerçoPrata.png', 'Terço Prata 925', TRUE, 0),
(5, 'img/Terços/TerçoMadeira.png', 'Terço Madeira Natural', TRUE, 0),
(6, 'img/Terços/TerçoNossaSenhoraDasGraças.png', 'Terço Nossa Senhora das Graças', TRUE, 0),
(7, 'img/CadernoDeOração/CadernoDeOraçãoCarlosAcutis.png', 'Caderno de Oração Carlos Acutis', TRUE, 0),
(8, 'img/CadernoDeOração/CadernoNossaSenhoraDasGraças.png', 'Caderno Nossa Senhora das Graças', TRUE, 0),
(9, 'img/MDF/ChaveiroLembrança.png', 'Chaveiro MDF Personalizado', TRUE, 0),
(10, 'img/MDF/PlacaFamilia.png', 'Placa MDF Família', TRUE, 0),
(11, 'img/Calendario2026/Calendario2026CarlosAcutis.png', 'Calendário de Mesa 2026', TRUE, 0),
(12, 'img/Calendario2026/Calendario2026N.S.Aparecida.png', 'Calendário Parede 2026', TRUE, 0),
(13, 'img/BlocoDeNotas/BlocoDeNotasSãoPaulo.png', 'Bloco de Notas São Paulo', TRUE, 0),
(14, 'img/BlocoDeNotas/BlocoDeNotasPalmeiras.png', 'Bloco de Notas Palmeiras', TRUE, 0),
(15, 'img/BlocoDeNotas/BlocoDeNotasCorinthians.png', 'Bloco de Notas Corinthians', TRUE, 0),
(16, 'img/Kits/KitPresente.png', 'Kit Presente Especial', TRUE, 0),
(17, 'img/Kits/KitComunhao.png', 'Kit Primeira Comunhão', TRUE, 0),
(18, 'img/Canetas/CanetaPremium.png', 'Caneta Esferográfica Premium', TRUE, 0),
(19, 'img/Lapis/LapisPremium.png', 'Lápis de Madeira Premium', TRUE, 0),
(20, 'img/Religiosos/BibliaBolso.png', 'Bíblia Pequena de Bolso', TRUE, 0),
(21, 'img/Religiosos/Santinho.png', 'Santinho de Proteção', TRUE, 0);

-- Inserir Cupons de Desconto
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, usage_limit, valid_from, valid_until) VALUES
('BEMVINDO10', 'Desconto de boas-vindas para novos clientes', 'percentage', 10.00, 50.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FRETEGRATIS', 'Frete grátis para compras acima de R$100', 'fixed', 15.00, 100.00, 50, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY)),
('NATAL20', 'Desconto especial de Natal', 'percentage', 20.00, 150.00, 200, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY)),
('PRIMEIRA10', 'Desconto para primeira compra', 'percentage', 10.00, 30.00, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY));

-- Inserir Configurações do Sistema
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Papelaria Amor e Arte', 'Nome do site'),
('site_description', 'Sua papelaria online com produtos religiosos e personalizados', 'Descrição do site'),
('contact_email', 'contato@papelariaamorarte.com.br', 'Email de contato'),
('contact_phone', '(12) 3456-7890', 'Telefone de contato'),
('whatsapp_number', '5512999999999', 'Número do WhatsApp'),
('shipping_cost', '15.00', 'Custo padrão de frete'),
('free_shipping_threshold', '150.00', 'Valor mínimo para frete grátis'),
('currency', 'BRL', 'Moeda padrão'),
('tax_rate', '0.00', 'Taxa de imposto'),
('maintenance_mode', 'false', 'Modo de manutenção');

-- ============================================================================
-- RELATÓRIO DO BANCO DE DADOS
-- ============================================================================

-- Mostrar todas as tabelas criadas
SHOW TABLES;

-- Mostrar estrutura de cada tabela
SHOW CREATE TABLE users;
SHOW CREATE TABLE addresses;
SHOW CREATE TABLE categories;
SHOW CREATE TABLE products;
SHOW CREATE TABLE product_images;
SHOW CREATE TABLE stock_movements;
SHOW CREATE TABLE carts;
SHOW CREATE TABLE cart_items;
SHOW CREATE TABLE orders;
SHOW CREATE TABLE order_items;
SHOW CREATE TABLE payments;
SHOW CREATE TABLE product_reviews;
SHOW CREATE TABLE wishlist;
SHOW CREATE TABLE coupons;
SHOW CREATE TABLE coupon_usage;
SHOW CREATE TABLE admin_users;
SHOW CREATE TABLE activity_logs;
SHOW CREATE TABLE system_settings;

-- Mostrar índices de cada tabela
SHOW INDEX FROM users;
SHOW INDEX FROM addresses;
SHOW INDEX FROM categories;
SHOW INDEX FROM products;
SHOW INDEX FROM orders;

-- ============================================================================
-- COMANDOS ÚTEIS
-- ============================================================================

-- Verificar relacionamentos
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

-- Contar registros em cada tabela
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM 
    INFORMATION_SCHEMA.TABLES
WHERE 
    TABLE_SCHEMA = 'papelaria_amor_arte_completo'
ORDER BY 
    TABLE_NAME;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
