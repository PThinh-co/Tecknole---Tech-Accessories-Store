// admin/assets/js/admin_data_sync.js

// === HẰNG SỐ ĐĂNG NHẬP ADMIN (Yêu cầu 3) ===

const ADMIN_CREDENTIALS = {
    username: "quanly1",
    password: "abcd1234",
    name: "Quản trị viên"
};

// === HÀM ĐỒNG BỘ DỮ LIỆU ===

function syncAdminData() {
    // Lấy dữ liệu sản phẩm gốc từ file product-detail.js 
    let initialProducts = (typeof PRODUCTS_DATA !== 'undefined' && PRODUCTS_DATA.length > 0) ? PRODUCTS_DATA : [];

    // 1. PRODUCTS (Chuẩn bị dữ liệu cho Admin - Thêm Cost, Profit, TotalImport/Sold)
    let adminProducts = JSON.parse(localStorage.getItem('admin_products')) || initialProducts.map(p => ({
        ...p,
        cost: p.cost || Math.round(p.price / 1.15), 
        profit: p.profit || 15, 
        totalImport: p.totalImport || p.stock || 0,
        totalSold: p.totalSold || 0,
        stock: p.stock || 0,
        status: p.status || (p.stock > 0 ? 'Đang bán' : 'Ngừng bán')
    }));
    localStorage.setItem('admin_products', JSON.stringify(adminProducts));
    window.adminProducts = adminProducts;


    // 2. DANH MỤC 
    let defaultCategories = [
        { id: 1, code: 'PK', name: 'Phụ kiện', desc: 'Phụ kiện điện tử', type: 'pk', status: 'active', profit: 20 },
        { id: 2, code: 'MN', name: 'Màn hình', desc: 'Các loại màn hình máy tính', type: 'manhinh', status: 'active', profit: 15 },
        { id: 3, code: 'BP', name: 'Bàn phím', desc: 'Các loại bàn phím cơ', type: 'banphim', status: 'active', profit: 15 },
        { id: 4, code: 'CH', name: 'Chuột', desc: 'Các loại chuột gaming', type: 'chuot', status: 'active', profit: 18 },
        { id: 5, code: 'TN', name: 'Tai nghe', desc: 'Các loại tai nghe chống ồn', type: 'tainghe', status: 'active', profit: 22 },
        { id: 6, code: 'LOA', name: 'Loa', desc: 'Loa Bluetooth và loa karaoke', type: 'loa', status: 'active', profit: 20 }
    ];
    window.adminCategories = JSON.parse(localStorage.getItem('admin_categories')) || defaultCategories;
    localStorage.setItem('admin_categories', JSON.stringify(window.adminCategories));


    // 3. NGƯỜI DÙNG (Đồng bộ Khách hàng từ bs_users và thêm Admin)
    let users = [{id: 999, name: ADMIN_CREDENTIALS.name, username: ADMIN_CREDENTIALS.username, email: 'admin@web.com', phone: '0000000000', status: 'active', is_admin: true}];
    const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]');
    let maxId = 1000;

    bsUsers.forEach(bUser => {
        let existingUser = users.find(u => u.username === bUser.username);
        
        if (existingUser) {
            Object.assign(existingUser, bUser);
        } else {
             maxId++;
            users.push({
                ...bUser,
                id: maxId,
                status: 'active', 
                is_admin: false,
            });
        }
    });
    localStorage.setItem('admin_users', JSON.stringify(users));
    window.adminUsers = users;


    // 4. ĐƠN HÀNG (Đồng bộ tất cả đơn hàng của mọi khách hàng)
    let allOrders = [];
    let orderIdCounter = 1;
    users.filter(u => !u.is_admin).forEach(user => {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
        userOrders.forEach(order => {
            const addressParts = order.shippingAddress.split(',').map(s => s.trim()).filter(s => s);
            const ward = addressParts.length >= 3 ? addressParts[addressParts.length - 3] : 'Chưa rõ';
            const district = addressParts.length >= 2 ? addressParts[addressParts.length - 2] : 'Chưa rõ';
            
            allOrders.push({
                id: orderIdCounter++,
                code: `DH${String(orderIdCounter - 1).padStart(3, '0')}`,
                customerName: order.receiverName,
                date: new Date(order.orderDate).toISOString().split('T')[0],
                total: order.total,
                status: order.status === 'pending' ? 'Chưa xử lý' : order.status, 
                address: {
                    street: addressParts.slice(0, -3).join(', '),
                    ward: ward, 
                    district: district, 
                    province: addressParts[addressParts.length - 1]
                },
                items: order.items.map(item => ({...item, productId: item.id})), // CHUẨN HÓA: item.id -> item.productId
                originalUsername: user.username 
            });
        });
    });
    localStorage.setItem('admin_all_orders', JSON.stringify(allOrders));
    window.adminOrders = allOrders;
    
    // 5. PHIẾU NHẬP
    window.adminImports = JSON.parse(localStorage.getItem('admin_imports')) || [];
    localStorage.setItem('admin_imports', JSON.stringify(window.adminImports));
}

syncAdminData();