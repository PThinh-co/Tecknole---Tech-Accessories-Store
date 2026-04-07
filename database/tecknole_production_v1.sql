-- ============================================================
-- DATABASE: TECKNOLE STORE - PHIÊN BẢN SẢN XUẤT (V1.2) - 30 SẢN PHẨM
-- TÍNH NĂNG: TÍNH LỢI NHUẬN TỰ ĐỘNG, VIỆT HÓA TRẠNG THÁI
-- ============================================================

SET NAMES utf8mb4;
SET SESSION FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG DANH MỤC
DROP TABLE IF EXISTS tk_categories;
CREATE TABLE tk_categories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) DEFAULT NULL,
    type VARCHAR(50) NOT NULL,
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

-- 3. BẢNG SẢN PHẨM (ĐÃ TỐI ƯU CỘT PROFIT)
DROP TABLE IF EXISTS tk_products;
CREATE TABLE tk_products (
    id INT(11) NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) DEFAULT NULL,
    price INT(11) NOT NULL,
    old_price INT(11) DEFAULT 0,
    cost INT(11) DEFAULT 0,
    profit INT(11) GENERATED ALWAYS AS (price - cost) STORED,
    category_id INT(11) NOT NULL,
    type VARCHAR(100) DEFAULT NULL,
    stock INT(11) DEFAULT 0,
    image TEXT DEFAULT NULL,
    gallery_images TEXT DEFAULT NULL,
    short_desc TEXT DEFAULT NULL,
    full_desc TEXT DEFAULT NULL,
    specs_list TEXT DEFAULT NULL,
    badge VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Đang bán',
    total_sold INT(11) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    qty INT(11) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DỮ LIỆU KHỞI TẠO
-- ============================================================

INSERT INTO tk_categories (id, name, code, type) VALUES 
(1, 'Màn hình', 'MN', 'manhinh'), 
(2, 'Bàn phím', 'BP', 'banphim'), 
(3, 'Chuột', 'CH', 'chuot'), 
(4, 'Tai nghe', 'TN', 'tainghe'), 
(5, 'Loa', 'LO', 'loa');

INSERT INTO tk_users (id, username, fullname, email, password, role, phone, address) VALUES 
(1, 'admin', 'Quản trị viên', 'admin@gmail.com', 'abcd123456', 'admin', NULL, NULL),
(2, 'khachhang', 'Khách Hàng', 'khachhang@example.com', '$2y$10$xr9c8ZFWuHymiELPY3RKPOIz5p5taoDSDbVLNriePkqRUZP6fmAeC', 'user', '0123456789', 'Số 1, Đường ABC, TP.HCM');

-- CHÈN 30 SẢN PHẨM MẪU (BẢN ĐẦY ĐỦ NHẤT)
INSERT INTO tk_products (id, code, name, brand, price, old_price, cost, category_id, type, stock, image, short_desc, full_desc, specs_list) VALUES
(1, 'AULA01', 'Bàn phím Aula F75', 'Aula', 750000, 899000, 500000, 2, 'banphim', 12, 'assets/images/popular_items/aulaf75_vang.png', 'Bàn phím cơ layout 75%.', '<p>Bàn phím cơ Aula F75 mang lại trải nghiệm gõ phím tuyệt vời.</p>', 'Kết nối: Bluetooth/2.4G/Cáp||Switch: Mechanical'),
(2, 'MSI27Q', 'Màn hình MSI MAG 274QF', 'MSI', 6690000, 0, 5500000, 1, 'manhinh', 5, 'assets/images/popular_items/msi_mag_274qf_x24_gearvn_d23c9ec1aab847818a2b31d35a3d25e8_1024x1024.jpg', 'Màn hình 2K 180Hz IPS.', '<p>Màn hình MSI MAG 274QF cho hình ảnh chân thực.</p>', 'Kích thước: 27 inch||Resolution: QHD'),
(3, 'MARS03', 'Loa Marshall Stanmore 3', 'Marshall', 7500000, 7990000, 6000000, 5, 'loa', 12, 'assets/images/popular_items/loa_marshal3.webp', 'Loa Bluetooth Marshall cao cấp.', '<p>Marshall Stanmore III âm thanh cực đỉnh.</p>', 'Công suất: 80W||Kết nối: Bluetooth 5.2'),
(4, 'RAZERV3', 'Chuột Razer Deathadder V3 Pro', 'Razer', 5990000, 6990000, 4800000, 3, 'chuot', 8, 'assets/images/popular_items/death_adder_v3pro.webp', 'Chuột gaming không dây siêu nhẹ.', '<p>Chuột Razer Deathadder V3 chuyên nghiệp.</p>', 'Trọng lượng: 63g||Cảm biến: Focus Pro 30K'),
(5, 'APROG2', 'Apple Airpod Pro Gen 2', 'Apple', 6090000, 0, 5000000, 4, 'tainghe', 22, 'assets/images/popular_items/airpods-pro-gen-2-magsafe-charge-usb-c.jpg', 'Tai nghe chống ồn Apple.', '<p>Airpod Pro Gen 2 âm thanh cực đỉnh.</p>', 'Chip: H2||Chống nước: IPX4'),
(6, 'LOGI502', 'Chuột Logitech G502 Hero', 'Logitech', 1490000, 1990000, 1100000, 3, 'chuot', 10, 'assets/images/popular_items/G502_hero.jpg', 'Chuột gaming cảm biến Hero.', '<p>G502 HERO cho độ chính xác cực cao.</p>', 'Cảm biến: HERO 25K||Nút: 11'),
(7, 'MARSV', 'Tai nghe Marshall Major V', 'Marshall', 4290000, 4990000, 3000000, 4, 'tainghe', 18, 'assets/images/popular_items/major5.jpg', 'Tai nghe Marshall Major V chính hãng.', '<p>Tai nghe Marshall âm thanh cổ điển.</p>', 'Pin: 100h+||Bảo hành: 12 tháng'),
(8, 'ASUSFAL', 'Bàn phím Asus ROG Falchion', 'Asus', 4090000, 0, 3200000, 2, 'banphim', 7, 'assets/images/img/banphim/asus_anhtrungbay2.jpg', 'Bàn phím cơ Asus 65%.', '<p>ROG Falchion thiết kế gọn gàng cực đẹp.</p>', 'Layout: 65%||Switch: ROG RX'),
(9, 'LOGIG203', 'Chuột Logitech G203', 'Logitech', 590000, 0, 400000, 3, 'chuot', 40, 'assets/images/img/chuot/logitech_trungbay1.jpg', 'Chuột quốc dân Logitech.', '<p>G203 giá rẻ nhưng vẫn đầy đủ Led RGB.</p>', 'DPI: 8,000||Led: Lightsync'),
(10, 'ACERK270', 'Màn hình Acer KG270-X1', 'Acer', 4290000, 0, 3500000, 1, 'manhinh', 13, 'assets/images/img/manhinh/Acer_anhtrungbay.png', 'Màn hình 27 inch 165Hz.', '<p>Màn hình Acer gaming cấu hình tốt giá rẻ.</p>', 'Tần số quét: 165Hz||Tấm nền: VA'),
(11, 'AULAS98', 'Bàn phím AuLa S98 PRO', 'Aula', 1849000, 0, 1500000, 2, 'banphim', 9, 'assets/images/img/banphim/aula-trungbay_2.png', 'Bàn phím cơ hotswap tinh tế.', '<p>Aula S98 mang lại cảm giác gõ êm ái.</p>', 'Switch: Mechanical||Layout: 98%'),
(12, 'DEVPHU', 'Loa Devialet Phantom', 'Devialet', 47990000, 0, 38000000, 5, 'loa', 3, 'assets/images/img/loa/devialet_trungbay1.webp', 'Siêu loa Devialet Phantom.', '<p>Âm thanh đỉnh cao từ Devialet Phantom.</p>', 'Công suất: 1100W||Màu: Trắng'),
(13, 'JBLCV18', 'Loa JBL CV1852T', 'JBL', 11590000, 0, 9000000, 5, 'loa', 6, 'assets/images/img/loa/jbl_trungbay1.webp', 'Loa Karaoke chuyên nghiệp.', '<p>JBL CV1852T âm thanh sống động cho phòng hát.</p>', 'Hãng: JBL||Loại: Karaoke'),
(14, 'AKKO5075', 'Bàn phím AKKO 5075B', 'Akko', 1750000, 0, 1400000, 2, 'banphim', 17, 'assets/images/img/banphim/akko_anhtrungbay1.jpg', 'Bàn phím cơ Akko hiện đại.', '<p>Akko 5075B mang thiết kế đẹp mắt linh hoạt.</p>', 'Keycap: PBT||Switch: Akko V3'),
(15, 'APLBSOLO', 'Tai nghe Beats Solo Pro', 'Apple', 5790000, 6000000, 4500000, 4, 'tainghe', 11, 'assets/images/img/tainghe/apple_trungbay1.jpg', 'Tai nghe Beats chụp tai.', '<p>Beats Solo Pro đẳng cấp từ Apple.</p>', 'Pin: 22h||Chống ồn: Có'),
(16, 'BOSEQC', 'Bose QuietComfort Ultra', 'Bose', 9690000, 10990000, 8000000, 4, 'tainghe', 10, 'assets/images/img/tainghe/bose_trungbay1.jpg', 'Chống ồn đỉnh cao từ Bose.', '<p>Bose QuietComfort Ultra trải nghiệm yên tĩnh tuyệt đối.</p>', 'Pin: 24h||Chống ồn: Có'),
(17, 'SNCH520', 'Tai nghe Sony WH-CH520', 'Sony', 1590000, 0, 1200000, 4, 'tainghe', 30, 'assets/images/img/tainghe/sony_trungbay.jpg', 'Tai nghe chụp tai Sony quốc dân.', '<p>WH-CH520 thời lượng pin dài, âm thanh Sony.</p>', 'Pin: 50h||Bluetooth: 5.2'),
(18, 'SNULTF5', 'Loa Sony ULT Field 5', 'Sony', 7690000, 8090000, 6200000, 5, 'loa', 10, 'assets/images/img/loa/sony_trungbay1.webp', 'Loa Sony bùng nổ âm bass.', '<p>Sony Field 5 cho bữa tiệc sôi động.</p>', 'Led: RGB||Chống nước: Có'),
(19, 'VIEW24', 'Viewsonic VX2428', 'Viewsonic', 3890000, 0, 3100000, 1, 'manhinh', 9, 'assets/images/img/manhinh/viewsonic_anhtrungbay1.jpg', 'Màn hình IPS 165Hz Viewsonic.', '<p>Góc nhìn rộng cùng tần số quét cao.</p>', 'Tấm nền: IPS||Tần số: 165Hz'),
(20, 'RAZERBASI', 'Razer Basilisk V3 Pro', 'Razer', 4290000, 0, 3500000, 3, 'chuot', 12, 'assets/images/img/chuot/razer_trungbay1.jpg', 'Chuột đa năng từ Razer.', '<p>Razer Basilisk V3 Pro nhiều nút lập trình.</p>', 'Led: Chroma RGB||Nút: 11'),
(21, 'SSAX5', 'SteelSeries Aerox 5', 'SteelSeries', 4090000, 0, 3200000, 3, 'chuot', 14, 'assets/images/img/chuot/Steelseries_trungbay1.jpg', 'Chuột siêu nhẹ đục lỗ.', '<p>Aerox 5 cực nhẹ cho cảm giác cầm thoải mái.</p>', 'Trọng lượng: 66g||Chống bụi: Có'),
(22, 'LG27GN', 'LG UltraGear 27G850', 'LG', 20390000, 0, 16000000, 1, 'manhinh', 3, 'assets/images/img/manhinh/lg_anhtrungbay1.jpg', 'Màn Nano IPS cực đẹp.', '<p>Chất lượng hình ảnh vượt trội từ LG.</p>', 'Tấm nền: Nano IPS||Resolution: 2K'),
(23, 'MARMID', 'Marshall Middleton', 'Marshall', 6650000, 7790000, 5400000, 5, 'loa', 16, 'assets/images/img/loa/marshall_trungbay1.webp', 'Loa di động mạnh mẽ Marshall.', '<p>Middleton âm thanh bùng nổ, chống nước tốt.</p>', 'Chống nước: IP67||Power: 60W'),
(24, 'ASUSVG27', 'Asus TUF VG27', 'Asus', 5999000, 0, 4800000, 1, 'manhinh', 8, 'assets/images/img/manhinh/asus_anhtrungbay2.jpg', 'Màn gaming TUF 27 inch.', '<p>Asus VG27 bền bỉ cùng hiệu năng cao.</p>', 'Tần số: 165Hz||Tấm nền: IPS'),
(25, 'CORSAIRKP', 'Corsair Katar Pro Pro', 'Corsair', 890000, 0, 650000, 3, 'chuot', 35, 'assets/images/img/chuot/corsar_trungbay1.jpg', 'Chuột nhỏ gọn không dây.', '<p>Katar Pro Wireless thích hợp cho di chuyển.</p>', 'Trọng lượng: 96g||Kết nối: Slipstream 2.4G'),
(26, 'ACNQ64', 'Acnos QUAD 64', 'Acnos', 7590000, 0, 6200000, 5, 'loa', 14, 'assets/images/img/loa/Acnos_trungbay1.webp', 'Loa xách tay Acnos.', '<p>Acnos QUAD 64 karaoke thỏa thích.</p>', 'Pin: 4-6h||Tặng kèm: 2 Micro'),
(27, 'AULAF75V', 'Aula F75 Pro V2', 'Aula', 1860000, 0, 1500000, 2, 'banphim', 11, 'assets/images/img/banphim/aula_trungbay1.png', 'Bàn phím cơ nâng cấp.', '<p>Aula F75 Pro V2 tinh chỉnh phím mượt mà.</p>', 'Switch: Linear||Led: RGB'),
(28, 'ASUSSTRIX', 'Màn hình Asus ROG XG25', 'Asus', 7799000, 0, 6200000, 1, 'manhinh', 4, 'assets/images/img/manhinh/asus_anhtrungbay1.jpg', 'Màn esport 240Hz.', '<p>Asus ROG XG25 tốc độ siêu nhanh.</p>', 'Tần số: 240Hz||Sync: G-Sync'),
(29, 'RAZERHV3', 'Razer Huntsman V3', 'Razer', 5999000, 0, 4800000, 2, 'banphim', 10, 'assets/images/products/Ban-Phim/RAZER/razer_trungbay1.jpg', 'Bàn phím quang học Razer.', '<p>Huntsman V3 phản hồi tức thì.</p>', 'Switch: Optical||Layout: Fullsize'),
(30, 'MARMODE', 'Marshall Mode II', 'Marshall', 3360000, 0, 2800000, 4, 'tainghe', 28, 'assets/images/img/tainghe/marshall_trungbay.jpg', 'Tai nghe In-ear Marshall.', '<p>Marshall Mode II thời trang, chất âm đầm.</p>', 'Kết nối: Bluetooth||Thiết kế: Cao cấp');

-- VIEW HOÀN CHỈNH (BAO GỒM CẢ SLUG VÀ TRẠNG THÁI DANH MỤC)
DROP VIEW IF EXISTS v_products_full;
CREATE VIEW v_products_full AS 
SELECT 
    p.*, 
    p.price AS sale_price,
    p.brand AS brand_slug,
    c.name AS category_name,
    c.status AS category_status
FROM tk_products p 
LEFT JOIN tk_categories c ON p.category_id = c.id;

-- VIEW ĐƠN GIẢN CHO TRANG CHỦ VÀ DANH SÁCH SẢN PHẨM
DROP VIEW IF EXISTS v_products_simple;
CREATE VIEW v_products_simple AS SELECT * FROM tk_products;


SET SESSION FOREIGN_KEY_CHECKS = 1;
