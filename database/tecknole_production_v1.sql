-- ============================================================
-- DATABASE: TECKNOLE STORE - PHIÊN BẢN SẢN XUẤT (V1.2) - 30 SẢN PHẨM
-- TÍNH NĂNG: ĐƠN GIẢN HÓA GIÁ BÁN, VIỆT HÓA TRẠNG THÁI
-- ============================================================

SET NAMES utf8mb4;
SET SESSION FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG DANH MỤC
DROP TABLE IF EXISTS tk_categories;
CREATE TABLE tk_categories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Hiển thị',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG NGƯỜI DÙNG
DROP TABLE IF EXISTS tk_users;
CREATE TABLE tk_users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (username),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG SẢN PHẨM
DROP TABLE IF EXISTS tk_products;
CREATE TABLE tk_products (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(100) DEFAULT NULL,
    profit_margin INT(11) DEFAULT 20,
    category_id INT(11) NOT NULL,
    stock INT(11) DEFAULT 0,
    image TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Hiện',
    supplier VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ... (Orders and Items tables remain the same) ...

-- 4. BẢNG ĐƠN HÀNG
DROP TABLE IF EXISTS tk_orders;
CREATE TABLE tk_orders (
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) DEFAULT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    receiver_email VARCHAR(255) DEFAULT NULL,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Tiền mặt',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Chưa xử lý',
    payment_status VARCHAR(50) DEFAULT 'Chưa thanh toán',
    note TEXT DEFAULT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CHI TIẾT ĐƠN HÀNG
DROP TABLE IF EXISTS tk_order_items;
CREATE TABLE tk_order_items (
    id INT(11) NOT NULL AUTO_INCREMENT,
    order_id INT(11) NOT NULL,
    product_id INT(11) NOT NULL,
    quantity INT(11) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG PHIẾU NHẬP
DROP TABLE IF EXISTS tk_import_items;
DROP TABLE IF EXISTS tk_imports;
CREATE TABLE tk_imports (
    id INT(11) NOT NULL AUTO_INCREMENT,
    import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Hoàn thành',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CHI TIẾT PHIẾU NHẬP
CREATE TABLE tk_import_items (
    id INT(11) NOT NULL AUTO_INCREMENT,
    import_id INT(11) NOT NULL,
    product_id INT(11) NOT NULL,
    quantity INT(11) NOT NULL DEFAULT 1,
    import_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DỮ LIỆU KHỞI TẠO
-- ============================================================

INSERT INTO tk_categories (id, name) VALUES 
(1, 'Màn hình'), 
(2, 'Bàn phím'), 
(3, 'Chuột'), 
(4, 'Tai nghe'), 
(5, 'Loa');

INSERT INTO tk_users (id, username, fullname, email, password, role, phone, address) VALUES 
(1, 'admin', 'Quản trị viên', 'admin@gmail.com', 'abcd123456', 'admin', NULL, NULL),
(2, 'khachhang', 'Khách Hàng', 'khachhang@example.com', '$2y$10$xr9c8ZFWuHymiELPY3RKPOIz5p5taoDSDbVLNriePkqRUZP6fmAeC', 'user', '0123456789', 'Số 1, Đường ABC, TP.HCM');

-- CHÈN 30 SẢN PHẨM MẪU (BẢN ĐẦY ĐỦ NHẤT) - Loại bỏ code
INSERT INTO tk_products (id, name, brand_name, profit_margin, category_id, stock, image, description) VALUES
(1, 'Bàn phím Aula F75', 'Aula', 20, 2, 20, 'assets/images/popular_items/aulaf75_vang.png', 'Bàn phím cơ layout 75%.' ),
(2, 'Màn hình MSI MAG 274QF', 'MSI', 20, 1, 8, 'assets/images/popular_items/msi_mag_274qf_x24_gearvn_d23c9ec1aab847818a2b31d35a3d25e8_1024x1024.jpg', 'Màn hình 2K 180Hz IPS.'),
(3, 'Loa Marshall Stanmore 3', 'Marshall', 20, 5, 12, 'assets/images/popular_items/loa_marshal3.webp', 'Loa Bluetooth Marshall cao cấp.'),
(4, 'Chuột Razer Deathadder V3 Pro', 'Razer', 20, 3, 13, 'assets/images/popular_items/death_adder_v3pro.webp', 'Chuột gaming không dây siêu nhẹ.'),
(5, 'Apple Airpod Pro Gen 2', 'Apple', 20, 4, 32, 'assets/images/popular_items/airpods-pro-gen-2-magsafe-charge-usb-c.jpg', 'Tai nghe chống ồn Apple.'),
(6, 'Chuột Logitech G502 Hero', 'Logitech', 20, 3, 18, 'assets/images/popular_items/G502_hero.jpg', 'Chuột gaming cảm biến Hero.'),
(7, 'Tai nghe Marshall Major V', 'Marshall', 20, 4, 18, 'assets/images/popular_items/major5.jpg', 'Tai nghe Marshall Major V chính hãng.'),
(8, 'Bàn phím Asus ROG Falchion', 'Asus', 20, 2, 7, 'assets/images/img/banphim/asus_anhtrungbay2.jpg', 'Bàn phím cơ Asus 65%.'),
(9, 'Chuột Logitech G203', 'Logitech', 20, 3, 60, 'assets/images/img/chuot/logitech_trungbay1.jpg', 'Chuột quốc dân Logitech.'),
(10, 'Màn hình Acer KG270-X1', 'Acer', 20, 1, 20, 'assets/images/img/manhinh/Acer_anhtrungbay.png', 'Màn hình 27 inch 165Hz.'),
(11, 'Bàn phím AuLa S98 PRO', 'Aula', 20, 2, 9, 'assets/images/img/banphim/aula-trungbay_2.png', 'Bàn phím cơ hotswap tinh tế.'),
(12, 'Loa Devialet Phantom', 'Devialet', 20, 5, 3, 'assets/images/img/loa/devialet_trungbay1.webp', 'Siêu loa Devialet Phantom.'),
(13, 'Loa JBL CV1852T', 'JBL', 20, 5, 6, 'assets/images/img/loa/jbl_trungbay1.webp', 'Loa Karaoke chuyên nghiệp.'),
(14, 'Bàn phím AKKO 5075B', 'Akko', 20, 2, 27, 'assets/images/img/banphim/akko_anhtrungbay1.jpg', 'Bàn phím cơ Akko hiện đại.'),
(15, 'Tai nghe Beats Solo Pro', 'Apple', 20, 4, 11, 'assets/images/img/tainghe/apple_trungbay1.jpg', 'Tai nghe Beats chụp tai.'),
(16, 'Bose QuietComfort Ultra', 'Bose', 20, 4, 10, 'assets/images/img/tainghe/bose_trungbay1.jpg', 'Chống ồn đỉnh cao từ Bose.'),
(17, 'Tai nghe Sony WH-CH520', 'Sony', 20, 4, 50, 'assets/images/img/tainghe/sony_trungbay.jpg', 'Tai nghe chụp tai Sony quốc dân.'),
(18, 'Loa Sony ULT Field 5', 'Sony', 20, 5, 10, 'assets/images/img/loa/sony_trungbay1.webp', 'Loa Sony bùng nổ âm bass.'),
(19, 'Viewsonic VX2428', 'Viewsonic', 20, 1, 9, 'assets/images/img/manhinh/viewsonic_anhtrungbay1.jpg', 'Màn hình IPS 165Hz Viewsonic.'),
(20, 'Razer Basilisk V3 Pro', 'Razer', 20, 3, 20, 'assets/images/img/chuot/razer_trungbay1.jpg', 'Chuột đa năng từ Razer.'),
(21, 'SteelSeries Aerox 5', 'SteelSeries', 20, 3, 14, 'assets/images/img/chuot/Steelseries_trungbay1.jpg', 'Chuột siêu nhẹ đục lỗ.'),
(22, 'LG UltraGear 27G850', 'LG', 20, 1, 3, 'assets/images/img/manhinh/lg_anhtrungbay1.jpg', 'Màn Nano IPS cực đẹp.'),
(23, 'Marshall Middleton', 'Marshall', 20, 5, 16, 'assets/images/img/loa/marshall_trungbay1.webp', 'Loa di động mạnh mẽ Marshall.'),
(24, 'Asus TUF VG27', 'Asus', 20, 1, 8, 'assets/images/img/manhinh/asus_anhtrungbay2.jpg', 'Màn gaming TUF 27 inch.'),
(25, 'Corsair Katar Pro Pro', 'Corsair', 20, 3, 50, 'assets/images/img/chuot/corsar_trungbay1.jpg', 'Chuột nhỏ gọn không dây.'),
(26, 'Acnos QUAD 64', 'Acnos', 20, 5, 14, 'assets/images/img/loa/Acnos_trungbay1.webp', 'Loa xách tay Acnos.'),
(27, 'Aula F75 Pro V2', 'Aula', 20, 2, 20, 'assets/images/img/banphim/aula_trungbay1.png', 'Bàn phím cơ nâng cấp.'),
(28, 'Màn hình Asus ROG XG25', 'Asus', 20, 1, 4, 'assets/images/img/manhinh/asus_anhtrungbay1.jpg', 'Màn esport 240Hz.'),
(29, 'Razer Huntsman V3', 'Razer', 20, 2, 15, 'assets/images/products/Ban-Phim/RAZER/razer_trungbay1.jpg', 'Bàn phím quang học Razer.'),
(30, 'Marshall Mode II', 'Marshall', 20, 4, 28, 'assets/images/img/tainghe/marshall_trungbay.jpg', 'Tai nghe In-ear Marshall.');

-- VIEW TÍNH TOÁN GIÁ VỐN BÌNH QUÂN (WAC) TỪ PHIẾU NHẬP
DROP VIEW IF EXISTS v_product_costs;
CREATE VIEW v_product_costs AS
SELECT 
    p.id AS product_id,
    COALESCE(SUM(ii.quantity * ii.import_price) / NULLIF(SUM(ii.quantity), 0), 0) AS avg_cost
FROM tk_products p
LEFT JOIN tk_import_items ii ON p.id = ii.product_id
LEFT JOIN tk_imports i ON ii.import_id = i.id AND i.status = 'Hoàn thành'
GROUP BY p.id;

-- VIEW HOÀN CHỈNH (CÁC CỘT GIÁ ĐƯỢC TÍNH TOÁN ĐỘNG)
DROP VIEW IF EXISTS v_products_full;
CREATE VIEW v_products_full AS 
SELECT 
    p.*, 
    vc.avg_cost AS cost,
    CASE 
        WHEN vc.avg_cost > 0 THEN ROUND(vc.avg_cost * (1 + p.profit_margin / 100))
        ELSE 0 
    END AS price,
    CASE 
        WHEN vc.avg_cost > 0 THEN ROUND(vc.avg_cost * (1 + p.profit_margin / 100))
        ELSE 0 
    END AS sale_price,
    p.brand_name AS brand_slug,
    c.name AS category_name,
    c.status AS category_status
FROM tk_products p 
LEFT JOIN tk_categories c ON p.category_id = c.id
LEFT JOIN v_product_costs vc ON p.id = vc.product_id;

-- VIEW ĐƠN GIẢN CHO TRANG CHỦ VÀ DANH SÁCH SẢN PHẨM
DROP VIEW IF EXISTS v_products_simple;
CREATE VIEW v_products_simple AS 
SELECT 
    p.*, 
    vc.avg_cost AS cost,
    CASE 
        WHEN vc.avg_cost > 0 THEN ROUND(vc.avg_cost * (1 + p.profit_margin / 100))
        ELSE 0 
    END AS price
FROM tk_products p 
LEFT JOIN tk_categories c ON p.category_id = c.id
LEFT JOIN v_product_costs vc ON p.id = vc.product_id;

-- ============================================================
-- DỮ LIỆU MẪU: PHIẾU NHẬP HÀNG (Dữ liệu này là nguồn để tính giá vốn)
-- ============================================================

INSERT INTO tk_imports (id, import_date, total_cost, status) VALUES
(1, '2025-01-10 09:00:00', 0, 'Hoàn thành');

INSERT INTO tk_import_items (import_id, product_id, quantity, import_price) VALUES
(1,  1,  12, 500000), (1,  2,   5, 5500000), (1,  3,  12, 6000000), (1,  4,   8, 4800000),
(1,  5,  22, 5000000), (1,  6,  10, 1100000), (1,  7,  18, 3000000), (1,  8,   7, 3200000),
(1,  9,  40, 400000), (1, 10,  13, 3500000), (1, 11,   9, 1500000), (1, 12,   3, 38000000),
(1, 13,   6, 9000000), (1, 14,  17, 1400000), (1, 15,  11, 4500000), (1, 16,  10, 8000000),
(1, 17,  30, 1200000), (1, 18,  10, 6200000), (1, 19,   9, 3100000), (1, 20,  12, 3500000),
(1, 21,  14, 3200000), (1, 22,   3, 16000000), (1, 23,  16, 5400000), (1, 24,   8, 4800000),
(1, 25,  35, 650000), (1, 26,  14, 6200000), (1, 27,  11, 1500000), (1, 28,   4, 6200000),
(1, 29,  10, 4800000), (1, 30,  28, 2800000);

UPDATE tk_imports SET total_cost = (SELECT SUM(quantity * import_price) FROM tk_import_items WHERE import_id = 1) WHERE id = 1;

INSERT INTO tk_imports (id, import_date, total_cost, status) VALUES
(2, '2025-03-20 10:00:00', 0, 'Hoàn thành');

INSERT INTO tk_import_items (import_id, product_id, quantity, import_price) VALUES
(2,  1,   8, 520000), (2,  2,   3, 5600000), (2,  4,   5, 4900000), (2,  5,  10, 5100000),
(2,  6,   8, 1150000), (2,  9,  20, 420000), (2, 10,   7, 3600000), (2, 14,  10, 1420000),
(2, 17,  20, 1220000), (2, 20,   8, 3550000), (2, 25,  15, 670000), (2, 27,   9, 1520000),
(2, 29,   5, 4850000);

UPDATE tk_imports SET total_cost = (SELECT SUM(quantity * import_price) FROM tk_import_items WHERE import_id = 2) WHERE id = 2;

SET SESSION FOREIGN_KEY_CHECKS = 1;
