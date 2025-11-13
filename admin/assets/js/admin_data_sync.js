// File: admin/assets/js/admin_data_sync.js (Phiên bản đã sửa lỗi đồng bộ)

const DEFAULT_ADMIN = {
    id: 999,
    username: "quanly1",
    password: "abcd1234",
    name: "Quản trị viên",
    email: "admin@tecknole.com",
    is_admin: true,
    status: "active"
};

function syncAdminData() {
    
    // 1. Lấy dữ liệu sản phẩm gốc từ môi trường người dùng (PRODUCTS_DATA từ product-detail.js)
    // Biến này có thể có hoặc không, tùy theo client đã load hay chưa
    const initialProducts = (typeof PRODUCTS_DATA !== 'undefined' && PRODUCTS_DATA.length > 0) ? PRODUCTS_DATA : [];
    
    // 2. Khởi tạo/Đồng bộ Admin Products (ĐÃ SỬA)
    // Ưu tiên 1: Luôn lấy từ localStorage trước
    let adminProducts = JSON.parse(localStorage.getItem('admin_products')) || [];

    if (adminProducts.length === 0 && initialProducts.length > 0) {
        // Ưu tiên 2: Nếu localStorage rỗng, dùng dữ liệu mồi từ client (được định nghĩa là DEFAULT_PRODUCTS_DATA trong product-detail.js)
        
        adminProducts = initialProducts.map(p => ({
            ...p,
            cost: p.cost || Math.round(p.price * 0.85),
            profit: p.profit || 15,
            totalImport: p.totalImport || 0,
            totalSold: p.totalSold || 0,
            stock: p.stock || 0,
            status: (p.stock || 0) > 0 ? 'Đang bán' : 'Ngừng bán'
        }));
        
        // Lưu lại ngay lập tức để đồng bộ
        localStorage.setItem('admin_products', JSON.stringify(adminProducts));
    }


    // 3. Định nghĩa/Khởi tạo Categories
    const defaultCategories = [
        { id: 2, code: 'MN', name: 'Màn hình', type: 'manhinh', profit: 15, status: 'active' },
        { id: 3, code: 'BP', name: 'Bàn phím', type: 'banphim', profit: 15, status: 'active' },
        { id: 4, code: 'CH', name: 'Chuột', type: 'chuot', profit: 18, status: 'active' },
        { id: 5, code: 'TN', name: 'Tai nghe', type: 'tainghe', profit: 22, status: 'active' },
        { id: 6, code: 'LOA', name: 'Loa', type: 'loa', profit: 20, status: 'active' }
    ];
    const adminCategories = JSON.parse(localStorage.getItem('admin_categories')) || defaultCategories;

    // 4. THÊM MỚI: Định nghĩa/Khởi tạo Brands (Hãng)
    const defaultBrands = [
        { id: 1, name: 'Acer', code: 'acer' },
        { id: 2, name: 'Asus', code: 'asus' },
        { id: 3, name: 'LG', code: 'lg' },
        { id: 4, name: 'MSI', code: 'msi' },
        { id: 5, name: 'Viewsonic', code: 'viewsonic' },
        { id: 6, name: 'Aula', code: 'aula' },
        { id: 7, name: 'Akko', code: 'akko' },
        { id: 8, name: 'Razer', code: 'razer' },
        { id: 9, name: 'Corsair', code: 'corsair' },
        { id: 10, name: 'Logitech', code: 'logitech' },
        { id: 11, name: 'Apple', code: 'apple' },
        { id: 12, name: 'Bose', code: 'bose' },
        { id: 13, name: 'Marshall', code: 'marshall' },
        { id: 14, name: 'Sony', code: 'sony' },
        { id: 15, name: 'Acnos', code: 'acnos' },
        { id: 16, name: 'Devialet', code: 'devialet' },
        { id: 17, name: 'JBL', code: 'jbl' }
    ];
    const adminBrands = JSON.parse(localStorage.getItem('admin_brands')) || defaultBrands;


    // 5. Khởi tạo/Đồng bộ Admin Users và Khách hàng
    let users = JSON.parse(localStorage.getItem('admin_users') || '[]');
    const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]'); 

    let adminIndex = users.findIndex(u => u.username === DEFAULT_ADMIN.username && u.is_admin);
    if (adminIndex !== -1) {
        users[adminIndex] = { ...users[adminIndex], ...DEFAULT_ADMIN };
    } else {
        users.unshift(DEFAULT_ADMIN);
    }
    
    let maxId = Math.max(...users.map(u => u.id), 1000);
    
    bsUsers.forEach(bUser => {
        const existing = users.find(u => u.username === bUser.username);
        if (existing) {
             const adminStatus = existing.status;
             const adminId = existing.id;

             if (!existing.is_admin || existing.username !== DEFAULT_ADMIN.username) {
                 Object.assign(existing, bUser);
             }
             
             existing.status = adminStatus || 'active'; 
             existing.id = adminId; 
             existing.is_admin = existing.is_admin || false;

        } else {
             users.push({ ...bUser, id: ++maxId, status: 'active', is_admin: false });
        }
    });

    localStorage.setItem('admin_users', JSON.stringify(users));

    // 6. Đồng bộ Orders và Imports
    let allOrders = []; 
    let orderId = 1;
    users.filter(u => !u.is_admin).forEach(user => {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
        userOrders.forEach((order, index) => {
            order.id = order.adminId || orderId++; 
            order.adminId = order.id;
            order.code = `DH${String(order.id).padStart(4, '0')}`;
            order.status = order.status === 'pending' ? 'Chưa xử lý' : order.status;

            const addr = order.shippingAddress.split(',').map(s => s.trim());
            allOrders.push({
                ...order,
                id: order.id,
                code: order.code,
                customerName: order.receiverName,
                date: order.orderDate ? order.orderDate.split('T')[0] : 'N/A',
                address: {
                    street: addr.slice(0, -3).join(', ') || 'N/A',
                    ward: addr[addr.length - 3] || 'Chưa rõ',
                    district: addr[addr.length - 2] || 'Chưa rõ',
                    province: addr[addr.length - 1] || 'Chưa rõ'
                },
                originalUsername: user.username,
                originalOrderIndex: index
            });
        });
        localStorage.setItem(`orders_${user.username}`, JSON.stringify(userOrders));
    });

    const adminImports = JSON.parse(localStorage.getItem('admin_imports')) || [];

    // 7. GÁN DỮ LIỆU VÀO WINDOW (QUAN TRỌNG NHẤT)
    window.adminUsers = users;
    window.adminProducts = adminProducts; 
    window.adminCategories = adminCategories;
    window.adminBrands = adminBrands; // THÊM MỚI
    window.adminOrders = allOrders;
    window.adminImports = adminImports;

    // LƯU VÀO localStorage
    localStorage.setItem('admin_products', JSON.stringify(adminProducts)); 
    localStorage.setItem('admin_categories', JSON.stringify(adminCategories));
    localStorage.setItem('admin_brands', JSON.stringify(adminBrands)); // THÊM MỚI
    localStorage.setItem('admin_all_orders', JSON.stringify(allOrders));
    localStorage.setItem('admin_imports', JSON.stringify(adminImports));
}

// Chạy hàm đồng bộ khi tệp này được load
syncAdminData();