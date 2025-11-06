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
        // (Điều này chỉ xảy ra ở lần chạy đầu tiên, trước khi client kịp lưu)
        // console.log("SYNC: localStorage rỗng, tạo admin_products từ tệp JS.");
        
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
    // Nếu cả hai đều rỗng, adminProducts sẽ là mảng [] (hoàn toàn bình thường)


    // 3. Định nghĩa/Khởi tạo Categories
    const defaultCategories = [
        { id: 1, code: 'PK', name: 'Phụ kiện', type: 'pk', profit: 20, status: 'active' },
        { id: 2, code: 'MN', name: 'Màn hình', type: 'manhinh', profit: 15, status: 'active' },
        { id: 3, code: 'BP', name: 'Bàn phím', type: 'banphim', profit: 15, status: 'active' },
        { id: 4, code: 'CH', name: 'Chuột', type: 'chuot', profit: 18, status: 'active' },
        { id: 5, code: 'TN', name: 'Tai nghe', type: 'tainghe', profit: 22, status: 'active' },
        { id: 6, code: 'LOA', name: 'Loa', type: 'loa', profit: 20, status: 'active' }
    ];
    const adminCategories = JSON.parse(localStorage.getItem('admin_categories')) || defaultCategories;

    // 4. Khởi tạo/Đồng bộ Admin Users và Khách hàng
    let users = JSON.parse(localStorage.getItem('admin_users') || '[]');
    const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]'); 

    let adminIndex = users.findIndex(u => u.username === DEFAULT_ADMIN.username && u.is_admin);
    if (adminIndex !== -1) {
        users[adminIndex] = { ...users[adminIndex], ...DEFAULT_ADMIN };
    } else {
        users.unshift(DEFAULT_ADMIN);
    }
    
    let maxId = Math.max(...users.map(u => u.id), 1000);
    
    // === LOGIC SỬA LỖI NẰM Ở ĐÂY ===
    bsUsers.forEach(bUser => {
        const existing = users.find(u => u.username === bUser.username);
        if (existing) {
             // 1. Lưu lại trạng thái (status) và ID của admin trước
             const adminStatus = existing.status;
             const adminId = existing.id;

             // 2. Đồng bộ thông tin từ client (như tên, email nếu họ tự cập nhật)
             if (!existing.is_admin || existing.username !== DEFAULT_ADMIN.username) {
                 Object.assign(existing, bUser);
             }
             
             // 3. Khôi phục lại trạng thái và ID mà admin đã quản lý
             existing.status = adminStatus || 'active'; // Ưu tiên status của admin
             existing.id = adminId; // Đảm bảo ID không bị ghi đè
             existing.is_admin = existing.is_admin || false;

        } else {
             // Thêm user mới từ client vào danh sách admin
             users.push({ ...bUser, id: ++maxId, status: 'active', is_admin: false });
        }
    });
    // === KẾT THÚC SỬA LỖI ===

    localStorage.setItem('admin_users', JSON.stringify(users));

    // 5. Đồng bộ Orders và Imports
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

    // 6. GÁN DỮ LIỆU VÀO WINDOW (QUAN TRỌNG NHẤT)
    window.adminUsers = users;
    window.adminProducts = adminProducts; // <--- Dùng dữ liệu đã đồng bộ
    window.adminCategories = adminCategories;
    window.adminOrders = allOrders;
    window.adminImports = adminImports;

    // LƯU VÀO localStorage
    localStorage.setItem('admin_products', JSON.stringify(adminProducts)); // <--- Đảm bảo lưu lại
    localStorage.setItem('admin_categories', JSON.stringify(adminCategories));
    localStorage.setItem('admin_all_orders', JSON.stringify(allOrders));
    localStorage.setItem('admin_imports', JSON.stringify(adminImports));
}

// Chạy hàm đồng bộ khi tệp này được load
syncAdminData();