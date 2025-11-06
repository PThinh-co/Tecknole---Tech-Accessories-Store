// assets/js/product-detail.js

// BIẾN TOÀN CỤC để theo dõi ảnh hiện tại và danh sách ảnh
let currentImageIndex = 0;
let currentGallery = [];
let currentProduct = null;

// DỮ LIỆU SẢN PHẨM (Đã bao gồm 30 sản phẩm và GalleryImages)

let DEFAULT_PRODUCTS_DATA = [
    {
        id: 1,
        code: 'AULA01',
        name: 'Bàn phím Aula F75',
        price: 750000,
        oldPrice: 899000,
        stock: 12,
        image: 'assets/images/popular_items/aulaf75_vang.png',
        type: 'banphim',
        brand: 'aula',
        badge: null,
        galleryImages: [
            'assets/images/popular_items/aulaf75_vang.png',
            'assets/images/products/Ban-Phim/AULA/aula_f75pro/aula_trungbay1.png',
            'assets/images/products/Ban-Phim/AULA/aula_f75pro/aula_trungbay2.png',
            'assets/images/products/Ban-Phim/AULA/aula_f75pro/aula_trungbay3.png',
            'assets/images/products/Ban-Phim/AULA/aula_f75pro/aula_trungbay4.png',
        ],
        shortDesc: 'Bàn phím cơ không dây TKL hot-swappable với nhiều màu sắc và switch tùy chọn.',
        fullDesc: '<p>Aula F75 là chiếc bàn phím cơ được săn đón nhờ thiết kế nhỏ gọn 75%, kết nối 3 chế độ (USB-C, Bluetooth, 2.4GHz) và khả năng tùy biến cao. Phù hợp cho cả chơi game và làm việc văn phòng.</p>',
        specs: [
            ['Kiểu dáng', '75% (81 phím)'],
            ['Kết nối', '3 Mode (Type-C/Bluetooth/2.4GHz)'],
            ['Switch', 'Linear/Tactile Hot-swap'],
            ['Pin', '4000mAh'],
            ['Màu sắc', ' Trắng Xanh, Vàng']
        ]
    },
    {
        id: 2,
        code: 'MSI27Q',
        name: 'Màn hình MSI MAG 274QF X24 27"',
        price: 6690000,
        oldPrice: null,
        stock: 5,
        image: 'assets/images/popular_items/msi_mag_274qf_x24_gearvn_d23c9ec1aab847818a2b31d35a3d25e8_1024x1024.jpg',
        type: 'manhinh',
        brand: 'msi',
        badge: 'HOT',
        galleryImages: [
            'assets/images/popular_items/msi_mag_274qf_x24_gearvn_d23c9ec1aab847818a2b31d35a3d25e8_1024x1024.jpg',
            'assets/images/products/Man-Hinh/MSI/man_msi(1).png',
            'assets/images/products/Man-Hinh/MSI/man_msi(2).png',
            'assets/images/products/Man-Hinh/MSI/man_msi(3).png',
            'assets/images/products/Man-Hinh/MSI/man_msi(4).png',
            'assets/images/products/Man-Hinh/MSI/man_msi(5).png',
            'assets/images/products/Man-Hinh/MSI/msi_anhtrungbay1.jpg',
        ],
        shortDesc: 'Màn hình gaming 27 inch, độ phân giải 2K QHD, tần số quét 240Hz cực nhanh.',
        fullDesc: '<p>Trải nghiệm chơi game đỉnh cao với tấm nền IPS cho màu sắc rực rỡ và tốc độ phản hồi 1ms. Đây là lựa chọn hoàn hảo cho các game thủ chuyên nghiệp với hiệu năng vượt trội.</p>',
        specs: [
            ['Kích thước', '27 inch'],
            ['Độ phân giải', '2560 x 1440 (2K)'],
            ['Tần số quét', '240Hz'],
            ['Thời gian phản hồi', '1ms GtG'],
        ]
    },
    {
        id: 3,
        code: 'MARS03',
        name: 'Loa Marshall Stanmore 3',
        price: 7500000,
        oldPrice: 7990000,
        stock: 12,
        image: 'assets/images/popular_items/loa_marshal3.webp',
        type: 'loa',
        brand: 'marshall',
        badge: 'NEW',
        galleryImages: [
            'assets/images/products/Loa/Marshall/stanmor/stan(1).webp',
            'assets/images/products/Loa/Marshall/stanmor/stan(2).webp',
            'assets/images/products/Loa/Marshall/stanmor/stan(3).webp',
            'assets/images/products/Loa/Marshall/stanmor/stan(4).webp',
            'assets/images/products/Loa/Marshall/stanmor/stan(5).webp',
            'assets/images/products/Loa/Marshall/stanmor/stan(6).webp',

        ],
        shortDesc: 'Loa Bluetooth cổ điển với âm thanh mạnh mẽ, sống động, hoàn hảo cho phòng khách.',
        fullDesc: '<p>Stanmore III mang đến âm trường rộng hơn, Marshall đã tái thiết kế để tạo ra trải nghiệm âm thanh sống động, lôi cuốn hơn, bao trùm khắp căn phòng của bạn với chất âm đặc trưng của hãng.</p>',
        specs: [
            ['Kích thước', '350 x 203 x 188 mm'],
            ['Kết nối', 'Bluetooth 5.2, RCA, 3.5mm'],
            ['Công suất', 'Công suất mạnh mẽ'],
            ['Trọng lượng', '4.25 kg'],
        ]
    },
    {
        id: 4,
        code: 'RAZERV3',
        name: 'Chuột Razer Deathadder V3 Pro',
        price: 5990000,
        oldPrice: 6990000,
        stock: 8,
        image: 'assets/images/popular_items/death_adder_v3pro.webp',
        type: 'chuot',
        brand: 'razer',
        badge: null,
        galleryImages: [
            'assets/images/popular_items/death_adder_v3pro.webp',
            'assets/images/img/chuot/razer_trungbay1.jpg',
            'assets/images/products/Chuot/Razer/deathadder/razerv3_1.jpg',
            'assets/images/products/Chuot/Razer/deathadder/razerv3_2.jpg',
        ],
        shortDesc: 'Chuột gaming không dây siêu nhẹ, cảm biến quang học Focus Pro 30K DPI.',
        fullDesc: '<p>Thiết kế công thái học hoàn hảo cho các game thủ chuyên nghiệp. Trọng lượng siêu nhẹ kết hợp với cảm biến tiên tiến giúp tối ưu hóa tốc độ và độ chính xác trong mọi trận đấu.</p>',
        specs: [
            ['Cảm biến', 'Razer™ Focus Pro 30K DPI'],
            ['Kết nối', 'Razer™ HyperSpeed Wireless'],
            ['Trọng lượng', 'Khoảng 63g'],
            ['Pin', 'Lên đến 90 giờ'],
        ]
    },
    {
        id: 5,
        code: 'APROG2',
        name: 'Apple Airpod Pro Gen 2',
        price: 6090000,
        oldPrice: null,
        stock: 22,
        image: 'assets/images/popular_items/airpods-pro-gen-2-magsafe-charge-usb-c.jpg',
        type: 'tainghe',
        brand: 'apple',
        badge: null,
        galleryImages: [
            'assets/images/popular_items/airpods-pro-gen-2-magsafe-charge-usb-c.jpg',
            'assets/images/img/tainghe/apple_trungbay1.jpg',
            'assets/images/products/Tai-nghe/Apple/airpod/airpod(1).jpg',
            'assets/images/products/Tai-nghe/Apple/airpod/airpod(1).webp',
            'assets/images/products/Tai-nghe/Apple/airpod/airpod(2).jpg',
        ],
        shortDesc: 'Tai nghe chống ồn chủ động (ANC) thế hệ thứ 2 với cổng sạc USB-C.',
        fullDesc: '<p>Chất lượng âm thanh vượt trội cùng khả năng khử tiếng ồn gấp đôi so với thế hệ trước. AirPods Pro Gen 2 mang lại trải nghiệm nghe nhạc đắm chìm và đàm thoại rõ ràng.</p>',
        specs: [
            ['Chống ồn', 'Active Noise Cancellation (ANC)'],
            ['Chip', 'Apple H2'],
            ['Cổng sạc', 'USB-C / MagSafe'],
            ['Thời lượng pin', 'Lên đến 6 giờ (tai nghe)'],
        ]
    },
    {
        id: 6,
        code: 'LOGI502',
        name: 'Chuột G502 Hero Logitech',
        price: 1490000,
        oldPrice: 1990000,
        stock: 10,
        image: 'assets/images/popular_items/G502_hero.jpg',
        type: 'chuot',
        brand: 'logitech',
        badge: 'NEW',
        galleryImages: [
            'assets/images/popular_items/G502_hero.jpg',
            'assets/images/products/Chuot/Logitech/g502/g502_1.jpg',
            'assets/images/products/Chuot/Logitech/g502/g502_2.jpg',

        ],
        shortDesc: 'Chuột gaming có dây nổi tiếng với cảm biến Hero 25K và 11 nút lập trình.',
        fullDesc: '<p>G502 Hero là huyền thoại trong làng chuột gaming. Thiết kế mang tính biểu tượng, trọng lượng có thể điều chỉnh và cảm biến chính xác tuyệt đối, phù hợp với mọi thể loại game.</p>',
        specs: [
            ['Cảm biến', 'HERO 25K'],
            ['Số nút', '11 nút lập trình được'],
            ['Trọng lượng', 'Có thể tùy chỉnh'],
            ['LED', 'LIGHTSYNC RGB'],
        ]
    },
    {
        id: 7,
        code: 'MARSV',
        name: 'Tai nghe Marshall Major V',
        price: 4290000,
        oldPrice: 4990000,
        stock: 18,
        image: 'assets/images/popular_items/major5.jpg',
        type: 'tainghe',
        brand: 'marshall',
        badge: 'SALE',
        galleryImages: [
            'assets/images/popular_items/major5.jpg',
            'assets/images/img/tainghe/marshall_trungbay.jpg',
            'assets/images/products/Tai-nghe/Marshall/majorV/major(1).jpg',
            'assets/images/products/Tai-nghe/Marshall/majorV/major(2).jpg',
            'assets/images/products/Tai-nghe/Marshall/majorV/major(3).jpg',
        ],
        shortDesc: 'Tai nghe chụp tai không dây, pin khủng và âm thanh Marshall đặc trưng.',
        fullDesc: '<p>Marshall Major V tiếp tục truyền thống của dòng Major với thời lượng pin cực dài, chất âm ấm áp, mạnh mẽ. Thiết kế gập gọn tiện lợi, lý tưởng cho việc di chuyển.</p>',
        specs: [
            ['Kết nối', 'Bluetooth 5.3'],
            ['Thời lượng pin', 'Trên 80 giờ'],
            ['Tính năng', 'Sạc nhanh, Nút M tùy chỉnh'],
            ['Kiểu dáng', 'Over-ear gập gọn'],
        ]
    },
    {
        id: 8,
        code: 'ASUSFAL',
        name: 'Bàn phím Asus ROG Falchion RX Low Profile',
        price: 4090000,
        oldPrice: null,
        stock: 7,
        image: 'assets/images/img/banphim/asus_anhtrungbay2.jpg',
        type: 'banphim',
        brand: 'asus',
        badge: 'HOT',
        galleryImages: [
            'assets/images/products/Ban-Phim/ASUS/asus_trungbay1.jpg',
            'assets/images/products/Ban-Phim/ASUS/asus_trungbay2.jpg',
            'assets/images/products/Ban-Phim/ASUS/asus_trungbay3.jpg',
            'assets/images/products/Ban-Phim/ASUS/asus_trungbay4.jpg',
            'assets/images/products/Ban-Phim/ASUS/asus_trungbay5.jpg',
            'assets/images/products/Ban-Phim/ASUS/asus_trungbay6.jpg',
        ],
        shortDesc: 'Bàn phím cơ 65% nhỏ gọn, switch quang học Low Profile và hộp bảo vệ thông minh.',
        fullDesc: '<p>ROG Falchion RX mang lại sự cân bằng giữa hiệu suất gaming và thiết kế tối giản. Switch quang học cho tốc độ phản hồi tức thì, kết hợp với hộp bảo vệ để dễ dàng mang đi.</p>',
        specs: [
            ['Kiểu dáng', '65%'],
            ['Switch', 'ROG RX Low Profile Optical'],
            ['Kết nối', 'Không dây (2.4GHz)'],
            ['Pin', 'Lên đến 450 giờ'],
        ]
    },
    {
        id: 9,
        code: 'CORSKP',
        name: 'Chuột Corsair Katar Pro Wireless',
        price: 890000,
        oldPrice: 990000,
        stock: 35,
        image: 'assets/images/img/chuot/corsar_trungbay1.jpg',
        type: 'chuot',
        brand: 'corsair',
        badge: null,
        galleryImages: [
            'assets/images/img/chuot/corsar_trungbay1.jpg',
            'assets/images/products/Chuot/Corsair/katar_1.jpg',
            'assets/images/products/Chuot/Corsair/katar_2.jpg',
            'assets/images/products/Chuot/Corsair/katar_3.jpg',
        ],
        shortDesc: 'Chuột gaming không dây siêu nhẹ, cảm biến quang học Focus Pro 30K DPI.',
        fullDesc: '<p>Katar Pro Wireless là lựa chọn tuyệt vời cho người mới bắt đầu hoặc người dùng muốn sự gọn nhẹ. Kết nối Slipstream Wireless tốc độ cao, đảm bảo độ trễ thấp.</p>',
        specs: [
            ['Cảm biến', 'Quang học 10.000 DPI'],
            ['Kết nối', 'SLIPSTREAM Wireless'],
            ['Trọng lượng', 'Khoảng 96g'],
            ['Kiểu dáng', 'Đối xứng'],
        ]
    },
    {
        id: 10,
        code: 'ACNOSQ64',
        name: 'Loa xách tay Acnos QUAD 64 Ver2',
        price: 7590000,
        oldPrice: 8890000,
        stock: 14,
        image: 'assets/images/img/loa/Acnos_trungbay1.webp',
        type: 'loa',
        brand: 'acnos',
        badge: 'NEW',
        galleryImages: [
            'assets/images/img/loa/Acnos_trungbay1.webp',
            'assets/images/products/Loa/Acnos/acnos_1.webp',
            'assets/images/products/Loa/Acnos/acnos_2.webp',
            'assets/images/products/Loa/Acnos/acnos_3.webp',
            'assets/images/products/Loa/Acnos/acnos_4.webp',
            'assets/images/products/Loa/Acnos/acnos_5.webp',
            'assets/images/products/Loa/Acnos/acnos_6.webp',
            'assets/images/products/Loa/Acnos/acnos_7.webp',
            'assets/images/products/Loa/Acnos/acnos_8.webp',
            'assets/images/products/Loa/Acnos/acnos_9.webp',
        ],
        shortDesc: 'Loa karaoke di động công suất lớn, kèm micro không dây chất lượng cao.',
        fullDesc: '<p>Acnos QUAD 64 Ver2 là trung tâm giải trí di động hoàn hảo cho các buổi tiệc ngoài trời hay dã ngoại. Âm thanh mạnh mẽ, pin bền bỉ, cùng khả năng chỉnh vang số chuyên nghiệp.</p>',
        specs: [
            ['Loại', 'Loa xách tay karaoke'],
            ['Công suất', 'Max 450W'],
            ['Kết nối', 'Bluetooth 5.0, USB, AUX'],
            ['Pin', 'Sử dụng liên tục 5-8 giờ'],
        ]
    },
    {
        id: 11,
        code: 'AULAS98',
        name: 'Bàn phím AuLa S98 PRO TM',
        price: 1849000,
        oldPrice: 2499000,
        stock: 9,
        image: 'assets/images/img/banphim/aula-trungbay_2.png',
        type: 'banphim',
        brand: 'aula',
        badge: 'SALE',
        galleryImages: [
            'assets/images/img/banphim/aula-trungbay_2.png',
            'assets/images/products/Ban-Phim/AULA/aula_f98/aula_trungbay1.png',
            'assets/images/products/Ban-Phim/AULA/aula_f98/aula_trungbay2.png',
            'assets/images/products/Ban-Phim/AULA/aula_f98/aula_trungbay3.png',
            'assets/images/products/Ban-Phim/AULA/aula_f98/aula_trungbay4.png',
        ],
        shortDesc: 'Bàn phím cơ 98 phím, màn hình TFT thông minh và đệm Gasket mount.',
        fullDesc: '<p>S98 PRO là một chiếc bàn phím cao cấp với màn hình hiển thị thông tin, mang lại trải nghiệm gõ êm ái nhờ cấu trúc Gasket và độ ổn định cao. Thích hợp cho người dùng yêu thích sự tùy chỉnh.</p>',
        specs: [
            ['Kiểu dáng', '98 phím'],
            ['Cấu trúc', 'Gasket Mount'],
            ['Màn hình', 'TFT thông minh'],
            ['Keycap', 'PBT Double-shot'],
            ['Pin', 'Lên đến 450 giờ'],
            ['Màu sắc', ' Tím ,hồng']
        ]
    },
    {
        id: 12,
        code: 'DEVPHU',
        name: 'Loa Devialet Phantom Ultimate 98dB',
        price: 47990000,
        oldPrice: null,
        stock: 3,
        image: 'assets/images/img/loa/devialet_trungbay1.webp',
        type: 'loa',
        brand: 'devialet',
        badge: 'HOT',
        galleryImages: [
            'assets/images/img/loa/devialet_trungbay1.webp',
            'assets/images/products/Loa/Devialet/dev1.webp',
            'assets/images/products/Loa/Devialet/dev3.webp',
            'assets/images/products/Loa/Devialet/dev4.webp',
            'assets/images/products/Loa/Devialet/dev5.webp',
            'assets/images/products/Loa/Devialet/dev6.webp',
            'assets/images/products/Loa/Devialet/dev7.webp',
            'assets/images/products/Loa/Devialet/dev8.webp',
            
        ],
        shortDesc: 'Siêu phẩm loa Hi-End với thiết kế độc đáo và công suất âm thanh cực kỳ mạnh mẽ.',
        fullDesc: '<p>Phantom Ultimate là một tuyệt tác âm thanh và thiết kế. Công nghệ ADH® (Analog Digital Hybrid) mang lại âm thanh thuần khiết, chi tiết ở mọi mức âm lượng. Phù hợp cho không gian sang trọng.</p>',
        specs: [
            ['Cường độ âm thanh', '98 dB SPL'],
            ['Công suất', '1100 Watts RMS'],
            ['Tần số đáp ứng', '16Hz to 25kHz'],
            ['Kết nối', 'Wi-Fi, Bluetooth, Spotify Connect'],
        ]
    },
    {
        id: 13,
        code: 'AKKO5075',
        name: 'Bàn phím AKKO 5075B Plus',
        price: 1750000,
        oldPrice: null,
        stock: 17,
        image: 'assets/images/img/banphim/akko_anhtrungbay1.jpg',
        type: 'banphim',
        brand: 'akko',
        badge: null,
        galleryImages: [
            'assets/images/img/banphim/akko_anhtrungbay1.jpg',  
            'assets/images/products/Ban-Phim/AKKO/akko2.jpg',
            'assets/images/products/Ban-Phim/AKKO/akko3.jpg',
        ],
        shortDesc: 'Bàn phím cơ 75%, kết nối 3 chế độ, đệm silicon giảm âm và switch Akko V3 Pro.',
        fullDesc: '<p>Akko 5075B Plus là một trong những bàn phím cơ bán chạy nhất, mang lại cảm giác gõ tốt, âm thanh đầm tai. Có nhiều phiên bản switch và màu sắc để lựa chọn.</p>',
        specs: [
            ['Kiểu dáng', '75% (82 phím)'],
            ['Kết nối', '3 Mode (Type-C/BT/2.4GHz)'],
            ['Switch', 'Akko V3 Pro Series'],
            ['Keycap', 'PBT Double-shot ASA Profile'],
        ]
    },
    {
        id: 14,
        code: 'APLBSOLO',
        name: 'Tai nghe Apple Beats Solo Pro',
        price: 5790000,
        oldPrice: 6000000,
        stock: 11,
        image: 'assets/images/img/tainghe/apple_trungbay1.jpg',
        type: 'tainghe',
        brand: 'apple',
        badge: null,
        galleryImages: [
            'assets/images/img/tainghe/apple_trungbay1.jpg',
            'assets/images/products/Tai-nghe/Apple/beatsolo/solo1.jpg',
            'assets/images/products/Tai-nghe/Apple/beatsolo/solo2.jpg',
            'assets/images/products/Tai-nghe/Apple/beatsolo/solo3.jpg',
        ],
        shortDesc: 'Tai nghe on-ear chống ồn, chip Apple H1 cho khả năng kết nối nhanh chóng.',
        fullDesc: '<p>Beats Solo Pro sở hữu công nghệ Pure ANC của Beats, cung cấp chất lượng âm thanh cân bằng, mạnh mẽ. Thiết kế có thể gập lại, pin lâu dài và tính năng xuyên âm tiện lợi.</p>',
        specs: [
            ['Chống ồn', 'Pure ANC (Active Noise Cancelling)'],
            ['Chip', 'Apple H1'],
            ['Kiểu dáng', 'On-ear'],
            ['Thời lượng pin', 'Lên đến 22 giờ'],
        ]
    },
    {
        id: 15,
        code: 'LOGIG203',
        name: 'Chuột Logitech G203 Lightsync',
        price: 590000,
        oldPrice: null,
        stock: 40,
        image: 'assets/images/img/chuot/logitech_trungbay1.jpg',
        type: 'chuot',
        brand: 'logitech',
        badge: null,
        galleryImages: [
            'assets/images/img/chuot/logitech_trungbay1.jpg',
            'assets/images/products/Chuot/Logitech/g203/g203_1.jpg',
            'assets/images/products/Chuot/Logitech/g203/g203_2.jpg',
            'assets/images/products/Chuot/Logitech/g203/g203_3.jpg',
        ],
        shortDesc: 'Chuột gaming có dây phổ thông, cảm biến 8.000 DPI và LED Lightsync RGB.',
        fullDesc: '<p>Logitech G203 là chuột gaming cơ bản, đáng tin cậy. Thiết kế cổ điển, gọn nhẹ, phù hợp cho nhiều kích cỡ tay. Dải LED Lightsync có thể tùy chỉnh theo sở thích.</p>',
        specs: [
            ['Cảm biến', 'Quang học 8.000 DPI'],
            ['LED', 'Lightsync RGB'],
            ['Số nút', '6 nút lập trình được'],
            ['Trọng lượng', '85g'],
        ]
    },
    {
        id: 16,
        code: 'JBLCV18',
        name: 'Loa Karaoke JBL CV1852T',
        price: 11590000,
        oldPrice: null,
        stock: 6,
        image: 'assets/images/img/loa/jbl_trungbay1.webp',
        type: 'loa',
        brand: 'jbl',
        badge: 'NEW',
        galleryImages: [
            'assets/images/img/loa/jbl_trungbay1.webp',
            'assets/images/products/Loa/JBL/jbl1.webp',
            'assets/images/products/Loa/JBL/jbl2.webp',
            'assets/images/products/Loa/JBL/jbl3.webp',
            'assets/images/products/Loa/JBL/jbl4.webp',
        ],
        shortDesc: 'Loa chuyên dụng cho phòng karaoke gia đình, âm thanh sống động, công suất cao.',
        fullDesc: '<p>JBL CV1852T được thiết kế để tái tạo giọng hát trung thực và âm nhạc nền mạnh mẽ. Góc phủ âm rộng, phù hợp với các phòng karaoke có diện tích trung bình đến lớn.</p>',
        specs: [
            ['Loại', 'Loa Karaoke chuyên nghiệp'],
            ['Công suất', '300W/600W (RMS/Peak)'],
            ['Dải tần', '50Hz - 20kHz'],
            ['Độ nhạy', '92 dB'],
        ]
    },
    {
        id: 17,
        code: 'ACERK270',
        name: 'Màn hình Acer KG270-X1 27"',
        price: 4290000,
        oldPrice: null,
        stock: 13,
        image: 'assets/images/img/manhinh/Acer_anhtrungbay.png',
        type: 'manhinh',
        brand: 'acer',
        badge: 'HOT',
        galleryImages: [
            'assets/images/img/manhinh/Acer_anhtrungbay.png',
            'assets/images/products/Man-Hinh/ACER/ac1.jpg',
            'assets/images/products/Man-Hinh/ACER/ac2.png',
            'assets/images/products/Man-Hinh/ACER/ac3.png',
            'assets/images/products/Man-Hinh/ACER/ac4.png',
            'assets/images/products/Man-Hinh/ACER/ac5.png',
            'assets/images/products/Man-Hinh/ACER/ac6.png',
            'assets/images/products/Man-Hinh/ACER/ac7.png',
        ],
        shortDesc: 'Màn hình gaming 27 inch Full HD, tần số quét 240Hz, giá phải chăng.',
        fullDesc: '<p>Acer KG270-X1 mang đến tốc độ cực nhanh 240Hz, đảm bảo hình ảnh mượt mà, không giật lag trong các trò chơi tốc độ cao. Công nghệ FreeSync Premium loại bỏ hiện tượng xé hình.</p>',
        specs: [
            ['Kích thước', '27 inch'],
            ['Độ phân giải', 'Full HD (1920x1080)'],
            ['Tần số quét', '240Hz'],
            ['Thời gian phản hồi', '0.5ms (MPRT)'],
        ]
    },
    {
        id: 18,
        code: 'BOSEQCULTRA',
        name: 'Tai nghe Bose QuietComfort Ultra',
        price: 9690000,
        oldPrice: 10990000,
        stock: 10,
        image: 'assets/images/img/tainghe/bose_trungbay1.jpg',
        type: 'tainghe',
        brand: 'bose',
        badge: 'SALE',
        galleryImages: [
            'assets/images/img/tainghe/bose_trungbay1.jpg',
            'assets/images/products/Tai-nghe/Bose/bose1.webp',
            'assets/images/products/Tai-nghe/Bose/bose2.jpg',
            'assets/images/products/Tai-nghe/Bose/bose3.jpg',
        ],
        shortDesc: 'Tai nghe chống ồn tốt nhất của Bose với âm thanh đắm chìm và công nghệ Immersive Audio.',
        fullDesc: '<p>QuietComfort Ultra thiết lập tiêu chuẩn mới về chống ồn và chất lượng âm thanh. Cảm giác đeo thoải mái tuyệt đối, pin dài, phù hợp cho đi máy bay, làm việc hoặc thư giãn.</p>',
        specs: [
            ['Chống ồn', 'QuietComfort Ultra ANC'],
            ['Âm thanh', 'Bose Immersive Audio'],
            ['Kiểu dáng', 'Over-ear'],
            ['Thời lượng pin', 'Lên đến 24 giờ'],
        ]
    },
    {
        id: 19,
        code: 'AULAF75P',
        name: 'Bàn phím AuLa F75 Pro',
        price: 1860000,
        oldPrice: null,
        stock: 11,
        image: 'assets/images/img/banphim/aula_trungbay1.png',
        type: 'banphim',
        brand: 'aula',
        badge: null,
        galleryImages: [
            'assets/images/img/banphim/aula_trungbay1.png',
            'assets/images/popular_items/aulaf75_vang.png',
        ],
        shortDesc: 'Phiên bản nâng cấp của F75, với keycap PBT và tính năng bổ sung.',
        fullDesc: '<p>F75 Pro có cấu hình cao cấp hơn, mang lại độ bền và cảm giác gõ tốt hơn. Phù hợp cho người dùng muốn hiệu suất ổn định và tùy biến cao trong tầm giá.</p>',
        specs: [
            ['Kiểu dáng', '75% (81 phím)'],
            ['Chất liệu', 'Keycap PBT'],
            ['Kết nối', '3 Mode'],
            ['Tương thích', 'Windows/MacOS'],
        ]
    },
    {
        id: 20,
        code: 'ASUSXG25',
        name: 'Màn hình Asus ROG Strix XG259CMS',
        price: 7799000,
        oldPrice: 8999000,
        stock: 4,
        image: 'assets/images/img/manhinh/asus_anhtrungbay1.jpg',
        type: 'manhinh',
        brand: 'asus',
        badge: null,
        galleryImages: [
            'assets/images/img/manhinh/asus_anhtrungbay1.jpg',
            'assets/images/products/Man-Hinh/ASUS/strix/strix(1).png',
            'assets/images/products/Man-Hinh/ASUS/strix/strix(2).png',
            'assets/images/products/Man-Hinh/ASUS/strix/strix(3).png',
            'assets/images/products/Man-Hinh/ASUS/strix/strix(4).png',
            'assets/images/products/Man-Hinh/ASUS/strix/strix(5).png',
        ],
        shortDesc: 'Màn hình gaming chuyên nghiệp 24.5 inch, 240Hz, Fast IPS.',
        fullDesc: '<p>ROG Strix XG259CMS là màn hình sinh ra cho eSports. Tần số quét siêu cao và công nghệ Fast IPS giảm thiểu tối đa hiện tượng nhòe chuyển động, giúp bạn nắm bắt mọi khoảnh khắc.</p>',
        specs: [
            ['Kích thước', '24.5 inch'],
            ['Độ phân giải', 'Full HD'],
            ['Tần số quét', '240Hz (OC lên 270Hz)'],
            ['Tấm nền', 'Fast IPS'],
        ]
    },
    {
        id: 21,
        code: 'RAZERBASI',
        name: 'Chuột Razer Basilisk V3 Pro',
        price: 4290000,
        oldPrice: null,
        stock: 12,
        image: 'assets/images/img/chuot/razer_trungbay1.jpg',
        type: 'chuot',
        brand: 'razer',
        badge: 'HOT',
        galleryImages: [
            'assets/images/img/chuot/razer_trungbay1.jpg',
            'assets/images/products/Chuot/Razer/basilik/razer_trungbay1.jpg',
            'assets/images/products/Chuot/Razer/basilik/razer_trungbay2.jpg',
        ],
        shortDesc: 'Chuột gaming công thái học, sạc không dây, 11 nút lập trình và cuộn Hyperscroll nghiêng.',
        fullDesc: '<p>Basilisk V3 Pro là đỉnh cao của sự tùy biến. Cảm biến quang Focus Pro 30K, kết nối Hyperspeed Wireless và 11 nút lập trình, cho phép bạn kiểm soát mọi hành động trong game.</p>',
        specs: [
            ['Cảm biến', 'Focus Pro 30K DPI'],
            ['Kết nối', 'Razer Hyperspeed Wireless, Bluetooth'],
            ['Số nút', '11 nút lập trình'],
            ['Trọng lượng', '112g'],
        ]
    },
    {
        id: 22,
        code: 'MARMODE2',
        name: 'Tai nghe Marshall Mode II',
        price: 3360000,
        oldPrice: null,
        stock: 28,
        image: 'assets/images/img/tainghe/marshall_trungbay.jpg',
        type: 'tainghe',
        brand: 'marshall',
        badge: null,
        galleryImages: [
            'assets/images/img/tainghe/marshall_trungbay.jpg',
            'assets/images/products/Tai-nghe/Marshall/mode/mode2(1).jpg',
            'assets/images/products/Tai-nghe/Marshall/mode/mode2(1).webp',
            'assets/images/products/Tai-nghe/Marshall/mode/mode2(2).jpg',
        ],
        shortDesc: 'Tai nghe True Wireless đầu tiên của Marshall, âm thanh bùng nổ, thiết kế nhỏ gọn.',
        fullDesc: '<p>Mode II mang lại chất âm lớn trong một thiết kế nhỏ gọn. Cảm giác đeo vừa vặn, chuẩn kháng nước IPX5, và khả năng điều khiển cảm ứng trực quan.</p>',
        specs: [
            ['Loại', 'True Wireless'],
            ['Chống nước', 'IPX5 (tai nghe)'],
            ['Kết nối', 'Bluetooth 5.1'],
            ['Thời lượng pin', '5 giờ (tai nghe) + 20 giờ (hộp sạc)'],
        ]
    },
    {
        id: 23,
        code: 'MARMIDLE',
        name: 'Loa Marshall Middleton',
        price: 6650000,
        oldPrice: 7790000,
        stock: 16,
        image: 'assets/images/img/loa/marshall_trungbay1.webp',
        type: 'loa',
        brand: 'marshall',
        badge: null,
        galleryImages: [
            'assets/images/img/loa/marshall_trungbay1.webp',
            'assets/images/products/Loa/Marshall/middleton/marshal(1).webp',
            'assets/images/products/Loa/Marshall/middleton/marshal(2).webp',
            'assets/images/products/Loa/Marshall/middleton/marshal(3).webp',
            'assets/images/products/Loa/Marshall/middleton/marshal(4).webp',
            'assets/images/products/Loa/Marshall/middleton/marshal(5).webp',

        ],
        shortDesc: 'Loa di động chống nước, âm thanh 360 độ, phù hợp cho mọi cuộc phiêu lưu.',
        fullDesc: '<p>Middleton là loa di động mạnh mẽ nhất của Marshall, với thiết kế chống nước tuyệt đối (IP67). Công nghệ True Stereophonic tạo ra âm thanh đa hướng đắm chìm.</p>',
        specs: [
            ['Loại', 'Di động, chống nước'],
            ['Chống nước', 'IP67'],
            ['Âm thanh', 'True Stereophonic (360 độ)'],
            ['Thời lượng pin', 'Hơn 20 giờ'],
        ]
    },
    {
        id: 24,
        code: 'ASUSVG27',
        name: 'Màn hình Asus TUF Gaming VG27AQ5A',
        price: 5999000,
        oldPrice: null,
        stock: 8,
        image: 'assets/images/img/manhinh/asus_anhtrungbay2.jpg',
        type: 'manhinh',
        brand: 'asus',
        badge: 'NEW',
        galleryImages: [
            'assets/images/img/manhinh/asus_anhtrungbay2.jpg',
            'assets/images/products/Man-Hinh/ASUS/tuf/tuf(1).jpg',
            'assets/images/products/Man-Hinh/ASUS/tuf/tuf(2).jpg',
            'assets/images/products/Man-Hinh/ASUS/tuf/tuf(3).jpg',
            'assets/images/products/Man-Hinh/ASUS/tuf/tuf(4).jpg',
            'assets/images/products/Man-Hinh/ASUS/tuf/tuf(5).jpg',
            'assets/images/products/Man-Hinh/ASUS/tuf/tuf(6).jpg',
        ],
        shortDesc: 'Màn hình gaming 27 inch 2K, 170Hz, tấm nền Fast IPS.',
        fullDesc: '<p>TUF Gaming VG27AQ5A là màn hình lý tưởng cho các game thủ muốn nâng cấp lên độ phân giải 2K mà vẫn giữ được tốc độ. Công nghệ ELMB Sync và G-Sync Compatible mang lại trải nghiệm mượt mà.</p>',
        specs: [
            ['Kích thước', '27 inch'],
            ['Độ phân giải', '2560 x 1440 (2K)'],
            ['Tần số quét', '170Hz (OC)'],
            ['Tấm nền', 'Fast IPS'],
        ]
    },
    {
        id: 25,
        code: 'RAZERHV3',
        name: 'Bàn phím Razer Huntsman V3 Pro',
        price: 5999000,
        oldPrice: null,
        stock: 10,
        image: 'assets/images/products/Ban-Phim/RAZER/razer_trungbay1.jpg',
        type: 'banphim',
        brand: 'razer',
        badge: 'NEW',
        galleryImages: [
            'assets/images/products/Ban-Phim/RAZER/razer_trungbay1.jpg',
            'assets/images/products/Ban-Phim/RAZER/razer_trungbay2.jpg',
            'assets/images/products/Ban-Phim/RAZER/razer_trungbay3.jpg',
            'assets/images/products/Ban-Phim/RAZER/razer_trungbay4.jpg',
            'assets/images/products/Ban-Phim/RAZER/razer_trungbay5.jpg',
            'assets/images/products/Ban-Phim/RAZER/razer_trungbay6.jpg',
        ],
        shortDesc: 'Bàn phím TKL với Analog Optical Switch thế hệ thứ 2, tốc độ ánh sáng.',
        fullDesc: '<p>Huntsman V3 Pro cho phép tùy chỉnh điểm tác động (actuation point), mang lại khả năng kiểm soát chưa từng có. Tốc độ phản hồi gần như bằng 0, là công cụ tối thượng cho eSports.</p>',
        specs: [
            ['Kiểu dáng', 'TKL (Tenkeyless)'],
            ['Switch', 'Razer Analog Optical Gen-2'],
            ['Tính năng', 'Rapid Trigger'],
            ['Chất liệu', 'Vỏ nhôm cao cấp'],
        ]
    },
    {
        id: 26,
        code: 'LG27G850',
        name: 'Màn hình LG 27G850A-B',
        price: 20390000,
        oldPrice: null,
        stock: 3,
        image: 'assets/images/img/manhinh/lg_anhtrungbay1.jpg',
        type: 'manhinh',
        brand: 'lg',
        badge: null,
        galleryImages: [
            'assets/images/img/manhinh/lg_anhtrungbay1.jpg',
            'assets/images/products/Man-Hinh/LG/lg(1).png',
            'assets/images/products/Man-Hinh/LG/lg(2).png',
            'assets/images/products/Man-Hinh/LG/lg(3).png',
            'assets/images/products/Man-Hinh/LG/lg(4).png',
            'assets/images/products/Man-Hinh/LG/lg(5).png',
            'assets/images/products/Man-Hinh/LG/lg(6).png',
        ],
        shortDesc: 'Màn hình OLED 27 inch QHD, 240Hz, độ tương phản tuyệt đối.',
        fullDesc: '<p>LG 27G850A-B mang công nghệ OLED vào gaming với màu đen sâu tuyệt đối, độ tương phản vô hạn và tốc độ 240Hz. Đây là lựa chọn cao cấp cho trải nghiệm hình ảnh đỉnh cao.</p>',
        specs: [
            ['Kích thước', '27 inch'],
            ['Tấm nền', 'OLED'],
            ['Độ phân giải', '2K QHD (2560x1440)'],
            ['Tần số quét', '240Hz'],
        ]
    },
    {
        id: 27,
        code: 'SSAX5W',
        name: 'Chuột SteelSeries Aerox 5 Wireless',
        price: 4090000,
        oldPrice: 4590000,
        stock: 14,
        image: 'assets/images/img/chuot/Steelseries_trungbay1.jpg',
        type: 'chuot',
        brand: 'steelseries',
        badge: null,
        galleryImages: [
            'assets/images/img/chuot/Steelseries_trungbay1.jpg',
            'assets/images/products/Chuot/SteelSeries/ssa_1.png',
            'assets/images/products/Chuot/SteelSeries/ssa_2.jpg',
            'assets/images/products/Chuot/SteelSeries/ssa_3.jpg',
            'assets/images/products/Chuot/SteelSeries/ssa_4.jpg',
        ],
        shortDesc: 'Chuột không dây siêu nhẹ (74g), chống nước AquaBarrier, 9 nút lập trình.',
        fullDesc: '<p>Aerox 5 Wireless là chuột đa năng được thiết kế cho các tựa game MOBA, MMO và Battle Royale. Trọng lượng nhẹ, pin tốt, và bảo vệ khỏi nước/bụi bẩn với chuẩn IP54.</p>',
        specs: [
            ['Trọng lượng', '74g'],
            ['Kết nối', 'Quantum 2.0 Wireless, Bluetooth'],
            ['Số nút', '9 nút'],
            ['Chống nước', 'AquaBarrier™ (IP54)'],
        ]
    },
    {
        id: 28,
        code: 'SNCH520',
        name: 'Tai nghe Sony WH‑CH520',
        price: 1590000,
        oldPrice: null,
        stock: 30,
        image: 'assets/images/img/tainghe/sony_trungbay.jpg',
        type: 'tainghe',
        brand: 'sony',
        badge: 'NEW',
        galleryImages: [
            'assets/images/img/tainghe/sony_trungbay.jpg',
            'assets/images/products/Tai-nghe/Sony/sony(1).jpg',
            'assets/images/products/Tai-nghe/Sony/sony(1).webp',
            'assets/images/products/Tai-nghe/Sony/sony(2).jpg',
        ],
        shortDesc: 'Tai nghe Bluetooth chụp tai, pin lâu, chất âm cân bằng, có thể sử dụng cả ngày.',
        fullDesc: '<p>Sony WH-CH520 là lựa chọn đáng tin cậy cho nhu cầu nghe nhạc hàng ngày. Thiết kế nhẹ, thoải mái và chất âm Sony đặc trưng, có thể tùy chỉnh EQ qua ứng dụng.</p>',
        specs: [
            ['Kiểu dáng', 'On-ear'],
            ['Thời lượng pin', 'Lên đến 50 giờ'],
            ['Kết nối', 'Bluetooth 5.2'],
            ['Sạc', 'USB-C'],
        ]
    },
    {
        id: 29,
        code: 'SNULTF5',
        name: 'Loa Sony ULT Field 5',
        price: 7690000,
        oldPrice: 8090000,
        stock: 10,
        image: 'assets/images/img/loa/sony_trungbay1.webp',
        type: 'loa',
        brand: 'sony',
        badge: null,
        galleryImages: [
            'assets/images/img/loa/sony_trungbay1.webp',
            'assets/images/products/Loa/SONY/sony(1).webp',
            'assets/images/products/Loa/SONY/sony(2).webp',
            'assets/images/products/Loa/SONY/sony(3).webp',
            'assets/images/products/Loa/SONY/sony(4).webp',
            'assets/images/products/Loa/SONY/sony(5).webp',
        ],
        shortDesc: 'Loa di động chống nước, âm trầm sâu mạnh mẽ với chế độ ULT POWER SOUND.',
        fullDesc: '<p>ULT Field 5 được thiết kế để khuấy động mọi bữa tiệc với âm trầm cực kỳ sâu và chế độ ULT độc quyền. Chống nước, chống bụi hoàn hảo.</p>',
        specs: [
            ['Âm thanh', 'ULT POWER SOUND'],
            ['Chống nước', 'IP67'],
            ['Thời lượng pin', 'Lên đến 30 giờ'],
            ['Tính năng', 'Lighting Party'],
        ]
    },
    {
        id: 30,
        code: 'VWSVX24',
        name: 'Màn hình Viewsonic VX2428AJ-BL',
        price: 3890000,
        oldPrice: null,
        stock: 9,
        image: 'assets/images/img/manhinh/viewsonic_anhtrungbay1.jpg',
        type: 'manhinh',
        brand: 'viewsonic',
        badge: null,
        galleryImages: [
            'assets/images/img/manhinh/viewsonic_anhtrungbay1.jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(1).jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(2).jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(3).jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(4).jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(5).jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(6).jpg',
            'assets/images/products/Man-Hinh/VIEWSONIC/sonic(7).jpg',
        ],
        shortDesc: 'Màn hình 24 inch Full HD, 180Hz, Fast IPS, hiệu suất cao cho gaming.',
        fullDesc: '<p>Viewsonic VX2428AJ-BL là lựa chọn tuyệt vời trong tầm giá. Tốc độ làm tươi cao, màu sắc chính xác, giúp bạn có lợi thế trong các trò chơi cạnh tranh.</p>',
        specs: [
            ['Kích thước', '24 inch'],
            ['Độ phân giải', 'Full HD'],
            ['Tần số quét', '180Hz'],
            ['Tấm nền', 'Fast IPS'],
        ]
    },
];
const getSyncedProducts = () => {
    // 1. Thử lấy dữ liệu từ kho lưu trữ của admin
    const adminProductsJSON = localStorage.getItem('admin_products');

    if (adminProductsJSON) {
        // Nếu có, dùng nó. Đây là nguồn dữ liệu chính
        // console.log("CLIENT: Đã tải sản phẩm từ localStorage.");
        return JSON.parse(adminProductsJSON);
    } else {
        // 2. Nếu không có (lần chạy đầu tiên, localStorage rỗng)
        // console.warn("CLIENT: Không tìm thấy 'admin_products'. Đang dùng dữ liệu mặc định và lưu lại.");

        // Lấy dữ liệu mồi
        const defaultData = DEFAULT_PRODUCTS_DATA;

        // Bổ sung các trường admin còn thiếu cho dữ liệu mồi
        const dataWithAdminFields = defaultData.map(p => ({
            ...p,
            cost: p.cost || Math.round(p.price * 0.85),
            profit: p.profit || 15,
            totalImport: p.totalImport || 0,
            totalSold: p.totalSold || 0,
            stock: p.stock || 0,
            status: (p.stock || 0) > 0 ? 'Đang bán' : 'Ngừng bán'
        }));

        // 3. Lưu lại vào localStorage để trang admin có thể đọc
        localStorage.setItem('admin_products', JSON.stringify(dataWithAdminFields));

        // 4. Trả về dữ liệu này
        return dataWithAdminFields;
    }
};

// ĐÂY LÀ NGUỒN DỮ LIỆU MỚI MÀ TOÀN BỘ TRANG CLIENT SẼ DÙNG
const PRODUCTS_DATA = getSyncedProducts();

// (Optional) Gửi sự kiện để báo cho admin biết client đã load
window.dispatchEvent(new Event('clientDataLoaded'));
// ===================================================================
// LOGIC CHUYỂN ẢNH VÀ XỬ LÝ DỮ LIỆU
// ===================================================================

// Hàm chuyển đổi hình ảnh chính VÀ cập nhật trạng thái nút
// Hàm chuyển đổi hình ảnh chính VÀ cập nhật trạng thái nút
function switchMainImage(index) {
    const mainImage = document.getElementById('product-main-image');
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');
    
    // **LOẠI BỎ logic giới hạn index tại đây**
    // Chỉ kiểm tra lỗi cơ bản
    if (!mainImage || index < 0 || index >= currentGallery.length) return;

    currentImageIndex = index;
    mainImage.src = currentGallery[index];
    
    // **CẬP NHẬT TRẠNG THÁI NÚT:**
    // Giữ giới hạn cho nút "Lùi" (Prev)
    prevBtn.disabled = currentImageIndex === 0;
    // Bỏ giới hạn cho nút "Tiếp theo" (Next) - sẽ được xử lý trong handleSliderClick
    nextBtn.disabled = false; 

    // Hiệu ứng Fade In/Out đơn giản khi chuyển ảnh
    mainImage.style.opacity = 0;
    setTimeout(() => {
        mainImage.style.opacity = 1;
    }, 100);
}

// Hàm xử lý nút Next/Prev (ĐÃ CHỈNH SỬA)
function handleSliderClick(direction) {
    if (direction === 'next') {
        let newIndex = currentImageIndex + 1;
        
        // KIỂM TRA LẶP VÔ HẠN (QUAY VỀ ĐẦU)
        if (newIndex >= currentGallery.length) {
            newIndex = 0; // Quay lại ảnh đầu tiên
        }
        switchMainImage(newIndex);
        
    } else if (direction === 'prev') {
        let newIndex = currentImageIndex - 1;
        
        // KIỂM TRA LẶP VÔ HẠN (QUAY VỀ CUỐI)
        if (newIndex < 0) {
            newIndex = currentGallery.length - 1; // Quay lại ảnh cuối cùng
        }
        switchMainImage(newIndex);
    }
}
// Lấy thông tin người dùng đang đăng nhập (Giữ nguyên)
function getCurrentUser() {
    const userStr = localStorage.getItem('bs_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Các hàm về Giỏ hàng (Giữ nguyên)
function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    const cartKey = `cart_${user.username}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    const cartKey = `cart_${user.username}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
}

function addToCart(product, quantity) {
    const user = getCurrentUser();
    if (!user) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        if (typeof openLoginModal === 'function') {
            openLoginModal();
        }
        return;
    }

    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            stock: product.stock
        });
    }

    saveCart(cart);
    alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
}

// Hàm render chi tiết sản phẩm
function renderProductDetail(product) {
    // 1. Khởi tạo Gallery
    currentProduct = product;
    currentGallery = product.galleryImages && product.galleryImages.length > 0 
                     ? product.galleryImages 
                     : [product.image];
    currentImageIndex = 0;

    // Hiển thị nội dung (Ẩn loading state)
    const loadingStateEl = document.getElementById('loading-state');
    if (loadingStateEl) {
    loadingStateEl.style.display = 'none';
    }
    document.getElementById('product-display').style.display = 'grid';
    document.getElementById('product-tabs').style.display = 'block';

    // 2. Thông tin cơ bản
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-short-desc').textContent = product.shortDesc;
    
    // Khởi tạo hình ảnh và trạng thái nút
    switchMainImage(0); // Luôn bắt đầu từ ảnh đầu tiên

    document.getElementById('display-price').textContent = product.price.toLocaleString('vi-VN') + 'đ';
    document.getElementById('display-stock').textContent = product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng';

    // 3. Gán sự kiện cho nút Next/Prev
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');
    if (prevBtn) prevBtn.onclick = () => handleSliderClick('prev');
    if (nextBtn) nextBtn.onclick = () => handleSliderClick('next');

    // 4. Giá cũ
    const oldPriceEl = document.getElementById('display-old-price');
    if (product.oldPrice) {
        oldPriceEl.textContent = product.oldPrice.toLocaleString('vi-VN') + 'đ';
        oldPriceEl.style.display = 'inline';
    } else {
        oldPriceEl.style.display = 'none';
    }

    // 5. Mô tả chi tiết
    document.getElementById('description-content').innerHTML = `<h3>Mô tả chi tiết</h3>${product.fullDesc}`;

    // 6. Thông số kỹ thuật
    const specsTable = document.getElementById('specs-table');
    let specsHtml = '<h3>Thông số kỹ thuật</h3><table><tbody>';
    product.specs.forEach(spec => {
        specsHtml += `<tr><th>${spec[0]}</th><td>${spec[1]}</td></tr>`;
    });
    specsHtml += '</tbody></table>';
    specsTable.innerHTML = specsHtml;
    
    // 7. Thêm sự kiện cho nút "Thêm vào giỏ hàng"
    const addToCartBtn = document.getElementById('btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput.value);

            if (product.stock === 0) {
                alert('Sản phẩm đã hết hàng!');
                return;
            }

            if (quantity < 1 || quantity > product.stock) {
                alert(`Số lượng phải từ 1 đến ${product.stock}`);
                return;
            }

            addToCart(product, quantity);
        });
    }

    // 8. Cập nhật giới hạn số lượng nhập
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.max = product.stock;
    }
}

// Khởi tạo trang chi tiết sản phẩm
document.addEventListener('DOMContentLoaded', () => {
    const productDisplay = document.getElementById('product-display');
    if (!productDisplay) {
        // Nếu không phải trang chi tiết sản phẩm, DỪNG code khởi tạo chi tiết sản phẩm.
        // Chỉ chạy updateAuthUI() và dừng.
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        return; 
    }
    
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Bổ sung kiểm tra an toàn cho các element hiển thị lỗi
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    if (isNaN(productId)) {
        if(loadingState) loadingState.style.display = 'none';
        if(errorState) errorState.style.display = 'block';
        return;
    }

    const product = PRODUCTS_DATA.find(p => p.id === productId);

    if (product) {
        renderProductDetail(product);
    } else {
        if(loadingState) loadingState.style.display = 'none';
        if(errorState) errorState.style.display = 'block';
    }
    
    // Đảm bảo UI Header (login/cart count) được cập nhật
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
}); 

console.log('Tổng số sản phẩm:', PRODUCTS_DATA.length);

// Tên danh mục và thương hiệu
const categoryNames = {
    'manhinh': 'Màn hình',
    'banphim': 'Bàn phím',
    'chuot': 'Chuột',
    'tainghe': 'Tai nghe',
    'loa': 'Loa'
};

const brandNames = {
    'acer': 'Acer', 'asus': 'Asus', 'lg': 'LG', 'msi': 'MSI', 'viewsonic': 'Viewsonic',
    'aula': 'Aula', 'akko': 'Akko', 'razer': 'Razer',
    'corsair': 'Corsair', 'logitech': 'Logitech', 'steelseries': 'SteelSeries',
    'apple': 'Apple', 'bose': 'Bose', 'marshall': 'Marshall', 'sony': 'Sony',
    'acnos': 'Acnos', 'devialet': 'Devialet', 'jbl': 'JBL'
};

// Map thương hiệu với loại sản phẩm chính
const brandPrimaryCategory = {
    'acer': 'manhinh',
    'asus': 'manhinh', 
    'lg': 'manhinh',
    'msi': 'manhinh',
    'viewsonic': 'manhinh',
    'aula': 'banphim',
    'akko': 'banphim',
    'corsair': 'chuot',
    'logitech': 'chuot',
    'steelseries': 'chuot',
    'apple': 'tainghe',
    'bose': 'tainghe',
    'marshall': 'tainghe',
    'sony': 'tainghe',
    'acnos': 'loa',
    'devialet': 'loa',
    'jbl': 'loa'
};

// Tự động detect type từ brand
function smartDetectType(brand) {
    if (!brand) return null;
    if (brandPrimaryCategory[brand]) {
        console.log('Tự động detect:', brand, '→', brandPrimaryCategory[brand]);
        return brandPrimaryCategory[brand];
    }
    return null;
}

// Lấy tham số URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Format giá
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Tạo HTML cho thẻ sản phẩm
function createProductCard(product) {
    if (product.status === 'Ngừng bán') {
        return `
            <div class="product-card out-of-stock" style="opacity:0.6; pointer-events:none;">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${formatVND(product.price)}</p>
                <div style="background:#e74c3c; color:white; padding:4px 8px; border-radius:4px; font-size:12px; display:inline-block;">
                    Ngừng bán
                </div>
            </div>
        `;
    }
    const oldPriceHTML = product.oldPrice > 0 
        ? '<span class="old-price">' + formatPrice(product.oldPrice) + '</span>' 
        : '';
    
    const badgeHTML = product.badge 
        ? '<span class="product-badge">' + product.badge + '</span>' 
        : '';

    return '<div class="product-card" onclick="window.location=\'product-detail.html?id=' + product.id + '\'">' +
        '<div class="product-image">' +
            '<img src="' + product.image + '" alt="' + product.name + '">' +
            badgeHTML +
        '</div>' +
        '<div class="product-info">' +
            '<div class="product-name">' + product.name + '</div>' +
            '<div class="product-price">' +
                formatPrice(product.price) +
                oldPriceHTML +
            '</div>' +
            '<button class="add-to-cart">Thêm vào giỏ</button>' +
        '</div>' +
    '</div>';
}

// Lọc và hiển thị sản phẩm
function displayProducts(autoDetect) {
    let typeFilter = document.getElementById('filter-type').value;
    let brandFilter = document.getElementById('filter-brand').value;
    const sortFilter = document.getElementById('filter-sort').value;

    // CHỈ tự động detect khi autoDetect = true (lần đầu load trang)
    // KHÔNG auto-detect khi user thay đổi dropdown
    if (autoDetect && !typeFilter && brandFilter) {
        const detectedType = smartDetectType(brandFilter);
        if (detectedType) {
            typeFilter = detectedType;
            document.getElementById('filter-type').value = detectedType;
        }
    }

    console.log('Bộ lọc:', { type: typeFilter, brand: brandFilter, sort: sortFilter });

    // Lọc sản phẩm
    let filteredProducts = PRODUCTS_DATA.filter(function(product) {
        const matchType = !typeFilter || product.type === typeFilter;
        const matchBrand = !brandFilter || product.brand === brandFilter;
        return matchType && matchBrand;
    });

    console.log('Số sản phẩm sau khi lọc:', filteredProducts.length);

    // Sắp xếp sản phẩm
    if (sortFilter === 'price-asc') {
        filteredProducts.sort(function(a, b) { return a.price - b.price; });
    } else if (sortFilter === 'price-desc') {
        filteredProducts.sort(function(a, b) { return b.price - a.price; });
    } else if (sortFilter === 'name-asc') {
        filteredProducts.sort(function(a, b) { return a.name.localeCompare(b.name, 'vi'); });
    } else if (sortFilter === 'name-desc') {
        filteredProducts.sort(function(a, b) { return b.name.localeCompare(a.name, 'vi'); });
    }

    // Hiển thị sản phẩm
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    const countNumber = document.getElementById('count-number');

    if (filteredProducts.length === 0) {
        container.innerHTML = '';
        noProducts.style.display = 'block';
        countNumber.textContent = '0';
        console.log('Không có sản phẩm nào phù hợp');
    } else {
        const productsHTML = filteredProducts.map(function(product) {
            return createProductCard(product);
        }).join('');
        container.innerHTML = productsHTML;
        noProducts.style.display = 'none';
        countNumber.textContent = filteredProducts.length;
        console.log('Đã hiển thị', filteredProducts.length, 'sản phẩm');
    }
}

// Cập nhật tiêu đề trang
function updatePageTitle() {
    let type = getUrlParameter('type');
    const brand = getUrlParameter('brand');

    // Tự động detect type nếu chỉ có brand
    if (!type && brand) {
        type = smartDetectType(brand);
    }

    let title = 'Danh mục sản phẩm';
    let description = 'Khám phá các sản phẩm chất lượng cao';

    if (type && brand) {
        title = categoryNames[type] + ' ' + brandNames[brand];
        description = 'Các sản phẩm ' + categoryNames[type] + ' của thương hiệu ' + brandNames[brand];
    } else if (type) {
        title = categoryNames[type];
        description = 'Tất cả sản phẩm ' + categoryNames[type];
    } else if (brand) {
        title = 'Thương hiệu ' + brandNames[brand];
        description = 'Tất cả sản phẩm của ' + brandNames[brand];
    }

    document.getElementById('category-title').textContent = title;
    document.getElementById('category-desc').textContent = description;
    document.title = title + ' - Tecknole';
    
    console.log('Tiêu đề trang:', title);
}

// Khởi tạo bộ lọc từ URL
function initializeFilters() {
    let type = getUrlParameter('type');
    const brand = getUrlParameter('brand');

    // Tự động detect type nếu chỉ có brand
    if (!type && brand) {
        type = smartDetectType(brand);
    }

    if (type) {
        document.getElementById('filter-type').value = type;
        console.log('Đã set filter type:', type);
    }
    if (brand) {
        document.getElementById('filter-brand').value = brand;
        console.log('Đã set filter brand:', brand);
    }
}
const filterTypeEl = document.getElementById('filter-type');
const filterBrandEl = document.getElementById('filter-brand');
const filterSortEl = document.getElementById('filter-sort');

if (filterTypeEl && filterBrandEl && filterSortEl) {
    // Nếu là trang danh mục/products, gắn sự kiện và khởi tạo UI
    filterTypeEl.addEventListener('change', function() {
        console.log('Đã thay đổi loại sản phẩm');
        displayProducts();
    });

    filterBrandEl.addEventListener('change', function() {
        console.log('Đã thay đổi thương hiệu');
        displayProducts();
    });

    filterSortEl.addEventListener('change', function() {
        console.log('Đã thay đổi cách sắp xếp');
        displayProducts();
    });
}
// Khởi tạo trang khi DOM đã load xong
window.addEventListener('DOMContentLoaded', function() {
    // [FIX QUAN TRỌNG] Kiểm tra xem có phần tử đặc trưng của trang Danh mục/Products không.
    const productsContainer = document.getElementById('products-container');
    
    if (productsContainer) {
        console.log('=== BẮT ĐẦU KHỞI TẠO TRANG DANH MỤC ===');
        // Các hàm này chỉ được gọi khi chắc chắn các ID UI của trang danh mục đã có
        if (typeof updatePageTitle === 'function') {
            updatePageTitle();
        }
        if (typeof initializeFilters === 'function') {
            initializeFilters();
        }
        if (typeof displayProducts === 'function') {
            displayProducts();
        }
        console.log('=== HOÀN THÀNH KHỞI TẠO ===');
    }
});
window.addEventListener('adminDataChanged', function () {
    // 1. Hiển thị thông báo (Giữ nguyên)
    const notification = document.createElement('div');
    // ... (Code tạo thông báo giữ nguyên) ...

    document.body.appendChild(notification);

    // 2. [KÍCH HOẠT UI] Buộc trang danh mục và giỏ hàng reload data
    if (typeof displayProducts === 'function') {
        // Gọi hàm hiển thị sản phẩm để đọc PRODUCTS_DATA đã được cập nhật
        displayProducts(); 
    }
    if (typeof updateAuthUI === 'function') {
        // Cập nhật số lượng giỏ hàng
        updateAuthUI(); 
    }
    
    // 3. Tự động xóa thông báo
    setTimeout(() => {
        if (notification.isConnected) {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }
    }, 10000);
});