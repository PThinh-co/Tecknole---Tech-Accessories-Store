// File: admin/assets/js/admin_main.js (Phiên bản đã sửa lỗi đồng bộ)

let loggedInAdmin = JSON.parse(localStorage.getItem('admin_logged_in_user')) || null;

// === HÀM CHUNG ===
const formatVND = n => n.toLocaleString('vi-VN') + ' đ';
const getNextId = (arr, key = 'id') => arr.length ? Math.max(...arr.map(i => i[key])) + 1 : 1;

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

// === HÀM SYNC (syncToUser) ĐÃ ĐƯỢC XÓA ===
// Hàm syncToUser() trước đây ở đây đã bị xóa
// vì nó không cần thiết và gây lỗi logic.
// Trang client (product-detail.js) giờ sẽ đọc trực tiếp từ 'admin_products'.

// === LƯU DỮ LIỆU ===
const saveAdminData = () => {
    localStorage.setItem('admin_users', JSON.stringify(window.adminUsers || []));
    localStorage.setItem('admin_products', JSON.stringify(window.adminProducts || []));
    localStorage.setItem('admin_categories', JSON.stringify(window.adminCategories || []));
    localStorage.setItem('admin_all_orders', JSON.stringify(window.adminOrders || []));
    localStorage.setItem('admin_imports', JSON.stringify(window.adminImports || []));
    
    // syncToUser(); // <-- ĐÃ VÔ HIỆU HÓA.
};

// === ĐĂNG NHẬP/ĐĂNG XUẤT ===
document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const admin = (window.adminUsers || []).find(a => a.username === user && a.password === pass && a.is_admin);
    if (admin) {
        localStorage.setItem('admin_logged_in_user', JSON.stringify(admin));
        location.reload();
        if (pass === "admin@2025") setTimeout(() => alert("CẢNH BÁO: Mật khẩu mặc định! Vui lòng đổi mật khẩu!"), 1000);
    } else alert('Sai tài khoản hoặc mật khẩu!');
});

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('admin_logged_in_user');
        location.reload();
    }
}

// === CHUYỂN TRANG VÀ LOAD SECTION ===
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(this.dataset.section).classList.add('active');
        document.getElementById('pageTitle').textContent = this.textContent.trim();
        loadSection(this.dataset.section);
    });
});

function loadSection(section) {
    const actions = {
        dashboard: loadDashboard,
        account: loadAccount, // <-- MỚI
        users: loadUsers,
        categories: loadCategories,
        products: loadProducts,
        imports: loadImports,
        pricing: loadPricing,
        orders: loadOrders,
        inventory: loadInventory
    };
    actions[section]?.();
}

// === DASHBOARD (CÓ TÍNH TOÁN DOANH THU & ALERTS) ===
function loadDashboard() {
    const products = window.adminProducts || [];
    const users = window.adminUsers || [];
    const orders = window.adminOrders || [];

    const totalCustomers = users.filter(u => !u.is_admin).length;
    const newOrdersCount = orders.filter(o => o.status === 'Chưa xử lý').length;
    const visibleProducts = products.filter(p => p.status === 'Đang bán').length;
    
    const totalRevenue = orders.filter(o => o.status === 'Đã giao thành công')
                               .reduce((sum, order) => sum + order.total, 0);

    const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0 && p.status === 'Đang bán')
                                     .sort((a, b) => a.stock - b.stock);
    
    // Cảnh báo tồn kho
    const lowStockAlerts = document.getElementById('inventoryAlertsBody');
    if (lowStockAlerts) {
        lowStockAlerts.innerHTML = lowStockProducts.map(p => `
            <div class="alert-item">
                <span class="product-name">${p.name}</span>
                <span class="stock-count" style="color: #c0392b; font-weight: 600;">Chỉ còn ${p.stock} sản phẩm!</span>
                <button class="btn btn-primary btn-sm" onclick="loadSection('imports')">Quản lý nhập</button>
            </div>
        `).join('');
        if (lowStockProducts.length === 0) {
             lowStockAlerts.innerHTML = '<p style="color: #777;">Không có sản phẩm nào đang ở mức tồn kho thấp.</p>';
        }
    }
    
    // Cập nhật các thẻ Stats
    const totalRevenueEl = document.getElementById('totalRevenue');
    if (totalRevenueEl) totalRevenueEl.textContent = formatVND(totalRevenue); 
    
    document.getElementById('totalUsers').textContent = totalCustomers;
    document.getElementById('totalProducts').textContent = visibleProducts;
    document.getElementById('newOrders').textContent = newOrdersCount;
}

// === TÀI KHOẢN ADMIN (MỚI) ===
function loadAccount() {
    if (!loggedInAdmin) return;
    
    document.getElementById('adminProfileName').value = loggedInAdmin.name || '';
    document.getElementById('adminProfileUsername').value = loggedInAdmin.username || '';
    document.getElementById('adminProfileEmail').value = loggedInAdmin.email || '';
    
    // Xóa form để tránh lỗi
    document.getElementById('adminPasswordForm').reset();
}

// =========================================================
// === 1. QUẢN LÝ NGƯỜI DÙNG ===
// =========================================================
function loadUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    const users = window.adminUsers || [];
    const customers = users.filter(u => !u.is_admin);
    
    let html = '';
    customers.forEach(user => {
        const statusClass = user.status === 'active' ? 'badge-active' : 'badge-locked';
        const statusText = user.status === 'active' ? 'Hoạt động' : 'Đã khóa';
        
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.fullName || user.name || 'N/A'}</td>
                <td>${user.username}</td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="resetUserPassword(${user.id})">Đặt lại mật khẩu</button>
                    <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus(${user.id}, '${user.status}')">${user.status === 'active' ? 'Khóa' : 'Mở khóa'}</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function resetUserPassword(userId) {
    if (!confirm('Bạn có chắc chắn muốn reset mật khẩu người dùng này về "123456"?')) return;
    const users = window.adminUsers || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        user.password = '123456';
        const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]');
        const bsUser = bsUsers.find(u => u.username === user.username);
        if (bsUser) bsUser.password = '123456';
        localStorage.setItem('bs_users', JSON.stringify(bsUsers));
        saveAdminData();
        alert(`Đã reset mật khẩu cho tài khoản ${user.username} về 123456.`);
        loadUsers();
    }
}

function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'locked' : 'active';
    if (!confirm(`Bạn có muốn ${newStatus === 'locked' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản này không?`)) return;
    const users = window.adminUsers || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = newStatus;
        const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]');
        const bsUser = bsUsers.find(u => u.username === user.username);
        if (bsUser) bsUser.status = newStatus;
        localStorage.setItem('bs_users', JSON.stringify(bsUsers));
        saveAdminData();
        alert(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản ${user.username}.`);
        loadUsers();
    }
}

// HÀM MỚI ĐỂ MỞ MODAL THÊM USER
function openUserModal(userId = null) {
    // Hiện tại chỉ hỗ trợ thêm mới (userId = null)
    // Nếu có userId, đó sẽ là logic "Sửa"
    document.getElementById('userForm').reset();
    document.getElementById('userModalTitle').textContent = 'Thêm Người Dùng Mới';
    document.getElementById('userId').value = '';
    document.getElementById('userUsername').readOnly = false; // Cho phép nhập username
    document.getElementById('userPassword').required = true; // Bắt buộc nhập pass khi tạo mới
    document.getElementById('userModal').style.display = 'flex';
}


// =========================================================
// === 2. QUẢN LÝ LOẠI SẢN PHẨM ===
// =========================================================
function loadCategories() {
    const tableBody = document.getElementById('categoriesTableBody');
    if (!tableBody) return;
    
    const categories = window.adminCategories || [];
    let html = '';
    categories.forEach(cat => {
        const statusClass = cat.status === 'active' ? 'badge-active' : 'badge-locked';
        const statusText = cat.status === 'active' ? 'Hoạt động' : 'Đã ẩn';
        
        html += `
            <tr>
                <td>${cat.code}</td>
                <td>${cat.name}</td>
                <td>${cat.profit}%</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openCategoryModal(${cat.id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${cat.id})">${cat.status === 'active' ? 'Ẩn' : 'Hiện'}</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function openCategoryModal(categoryId = null) {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModalTitle').textContent = categoryId ? 'Sửa Loại Sản Phẩm' : 'Thêm Loại Sản Phẩm Mới';
    const categories = window.adminCategories || [];
    const cat = categoryId ? categories.find(c => c.id === categoryId) : null;

    if (cat) {
        document.getElementById('categoryId').value = cat.id;
        document.getElementById('categoryName').value = cat.name;
        document.getElementById('categoryCode').value = cat.code;
        document.getElementById('categoryType').value = cat.type;
        document.getElementById('categoryProfit').value = cat.profit;
    } else {
        document.getElementById('categoryId').value = '';
    }
    
    document.getElementById('categoryModal').style.display = 'flex';
}

document.getElementById('categoryForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const categories = window.adminCategories || [];
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const code = document.getElementById('categoryCode').value.trim();
    const type = document.getElementById('categoryType').value.trim();
    const profit = parseInt(document.getElementById('categoryProfit').value);

    if (id) {
        const cat = categories.find(c => c.id == id);
        if (cat) {
            cat.name = name;
            cat.code = code;
            cat.type = type;
            cat.profit = profit;
            alert(`Đã sửa loại sản phẩm: ${name}`);
        }
    } else {
        const newCat = {
            id: getNextId(categories),
            code: code,
            name: name,
            type: type,
            profit: profit,
            status: 'active'
        };
        categories.push(newCat);
        alert(`Đã thêm loại sản phẩm: ${name}`);
    }

    saveAdminData();
    closeModal('categoryModal');
    loadCategories();
});

function deleteCategory(categoryId) {
    const categories = window.adminCategories || [];
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
        const newStatus = cat.status === 'active' ? 'locked' : 'active';
        if (confirm(`Bạn có chắc muốn ${newStatus === 'locked' ? 'ẨN' : 'HIỆN'} loại sản phẩm "${cat.name}"?`)) {
            cat.status = newStatus;
            saveAdminData();
            loadCategories();
        }
    }
}


// =========================================================
// === 3. QUẢN LÝ SẢN PHẨM (CÓ HÌNH ẢNH & ẨN/HIỆN) ===
// =========================================================
function loadProducts() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    // --- BẮT ĐẦU LOGIC LỌC ---
    const searchInput = document.getElementById('productSearchInput');
    const categoryFilter = document.getElementById('productCategoryFilter');
    
    // Điền dữ liệu cho category filter (chỉ 1 lần)
    const categories = window.adminCategories || [];
    if (categoryFilter.options.length <= 1) { // <= 1 vì đã có 1 option "Lọc theo loại"
        categories.filter(c => c.status === 'active').forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.type;
            option.textContent = cat.name;
            categoryFilter.appendChild(option);
        });
    }

    // Lấy giá trị lọc
    const searchTerm = searchInput.value.toLowerCase();
    const filterCategory = categoryFilter.value;

    // Lọc sản phẩm
    const products = window.adminProducts || [];
    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm) || 
                          p.code.toLowerCase().includes(searchTerm);
        const categoryMatch = !filterCategory || p.type === filterCategory;
        return nameMatch && categoryMatch;
    });
    // --- KẾT THÚC LOGIC LỌC ---

    let html = '';
    // Dùng 'filteredProducts' thay vì 'products' để render
    filteredProducts.forEach(p => { 
        const cat = categories.find(c => c.type === p.type) || { name: 'Khác' };
        const isVisible = p.status === 'Đang bán';
        const statusText = isVisible ? 'Hiển thị' : 'Đã ẩn';
        const statusClass = isVisible ? 'badge-active' : 'badge-locked';
        
        html += `
            <tr>
               <td><img src="../${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                <td>${p.name}<br><small style="color:#777;">(${p.code})</small></td> 
                <td>${cat.name}</td>
                <td>${formatVND(p.price)}</td>
                <td>${p.stock}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openProductModal(${p.id})">Sửa</button>
                    <button class="btn btn-secondary btn-sm" onclick="toggleProductVisibility(${p.id}, ${isVisible})">
                        ${isVisible ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function toggleProductVisibility(productId, isCurrentlyVisible) {
    const products = window.adminProducts || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        const newStatus = isCurrentlyVisible ? 'Ngừng bán' : 'Đang bán';
        if (confirm(`Bạn có chắc muốn ${newStatus === 'Ngừng bán' ? 'ẨN' : 'HIỆN'} sản phẩm "${product.name}"?`)) {
            product.status = newStatus;
            saveAdminData();
            loadProducts();
        }
    }
}

function deleteProduct(productId) {
    if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này?')) {
        let products = window.adminProducts || [];
        const initialLength = products.length;
        window.adminProducts = products.filter(p => p.id !== productId);
        
        if (window.adminProducts.length < initialLength) {
            saveAdminData();
            loadProducts();
            loadDashboard();
            alert('Đã xóa sản phẩm vĩnh viễn.');
        } else {
            alert('Lỗi: Không tìm thấy sản phẩm để xóa.');
        }
    }
}

function openProductModal(productId = null) {
    document.getElementById('productForm').reset();
    document.getElementById('productModalTitle').textContent = productId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới';
    const products = window.adminProducts || [];
    const categories = window.adminCategories || [];
    const product = productId ? products.find(p => p.id === productId) : null;
    
    const typeSelect = document.getElementById('productType');
    typeSelect.innerHTML = categories
        .filter(c => c.status === 'active')
        .map(c => `<option value="${c.type}">${c.name}</option>`)
        .join('');
        
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productShortDesc').value = product.shortDesc || '';
        document.getElementById('productType').value = product.type;
    } else {
        document.getElementById('productId').value = '';
    }
    
    document.getElementById('productModal').style.display = 'flex';
}

document.getElementById('productForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const products = window.adminProducts || [];
    const id = document.getElementById('productId').value;
    
    const newProductData = {
        name: document.getElementById('productName').value.trim(),
        code: document.getElementById('productCode').value.trim(),
        type: document.getElementById('productType').value,
        image: document.getElementById('productImage').value.trim(),
        price: parseInt(document.getElementById('productPrice').value),
        shortDesc: document.getElementById('productShortDesc').value.trim(),
    };

    if (id) {
        const product = products.find(p => p.id == id);
        if (product) {
            Object.assign(product, newProductData);
            alert(`Đã sửa sản phẩm: ${newProductData.name}`);
        }
    } else {
        const newProduct = {
            id: getNextId(products),
            ...newProductData,
            stock: 0, 
            cost: Math.round(newProductData.price * 0.85),
            status: 'Ngừng bán',
            totalImport: 0,
            totalSold: 0
        };
        products.push(newProduct);
        alert(`Đã thêm sản phẩm mới: ${newProduct.name}`);
    }

    saveAdminData();
    closeModal('productModal');
    loadProducts();
    loadDashboard();
});


// =========================================================
// === 4. QUẢN LÝ NHẬP HÀNG (ĐÃ CẬP NHẬT LỌC) ===
// =========================================================
function loadImports() {
    const tableBody = document.getElementById('importsTableBody');
    if (!tableBody) return;
    
    // --- BẮT ĐẦU LOGIC LỌC ---
    const searchInput = document.getElementById('importSearchInput');
    const statusFilter = document.getElementById('importStatusFilter');
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = statusFilter.value;

    const imports = window.adminImports || [];
    const filteredImports = imports.filter(imp => {
        const codeMatch = imp.code.toLowerCase().includes(searchTerm);
        const statusMatch = !filterStatus || imp.status === filterStatus;
        return codeMatch && statusMatch;
    });
    // --- KẾT THÚC LOGIC LỌC ---
    
    let html = '';
    // Dùng filteredImports
    filteredImports.forEach(imp => {
        const total = imp.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
        const statusClass = imp.status === 'Hoàn thành' ? 'badge-active' : 'badge-warning';
        
        html += `
            <tr>
                <td>${imp.code}</td>
                <td>${imp.date}</td>
                <td>${formatVND(total)}</td>
                <td><span class="badge ${statusClass}">${imp.status}</span></td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="openImportModal(${imp.id})">Xem/Sửa</button>
                    ${imp.status !== 'Hoàn thành' ? 
                        `<button class="btn btn-success btn-sm" onclick="completeImport(${imp.id})">Hoàn thành</button>
                         <button class="btn btn-danger btn-sm" onclick="deleteImport(${imp.id})">Xóa</button>` 
                        : ''
                    }
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function deleteImport(importId) {
    if (confirm('Bạn có chắc chắn muốn xóa phiếu nhập nháp này?')) {
        let imports = window.adminImports || [];
        window.adminImports = imports.filter(imp => imp.id !== importId);
        saveAdminData();
        loadImports();
        alert('Đã xóa phiếu nhập.');
    }
}

function calculateImportTotal() {
    let total = 0;
    document.querySelectorAll('.import-item-row').forEach(row => {
        const cost = parseInt(row.querySelector('.item-cost').value) || 0;
        const quantity = parseInt(row.querySelector('.item-quantity').value) || 0;
        total += cost * quantity;
    });
    document.getElementById('importTotalDisplay').textContent = formatVND(total);
}

function updateItemCost(selectElement) {
    const products = window.adminProducts || [];
    const productId = selectElement.value;
    const product = products.find(p => p.id == productId);
    const costInput = selectElement.closest('.import-item-row').querySelector('.item-cost');
    
    if (product) {
        costInput.value = product.cost || Math.round(product.price * 0.85);
    }
    calculateImportTotal();
}

function addImportItem(item = {}) {
    const container = document.getElementById('importItemsContainer');
    const products = window.adminProducts || [];
    const productsOptions = products
        .map(p => `<option value="${p.id}">${p.code} - ${p.name} (Tồn: ${p.stock})</option>`)
        .join('');
    
    const row = document.createElement('div');
    row.classList.add('import-item-row');
    row.innerHTML = `
        <div class="form-group" style="display:flex; gap: 10px; align-items:flex-end;">
            <div style="flex-grow: 3;">
                <label>Sản phẩm</label>
                <select class="item-product-id" required onchange="updateItemCost(this)">
                    <option value="">-- Chọn sản phẩm --</option>
                    ${productsOptions}
                </select>
            </div>
            <div style="flex-grow: 1;">
                <label>Giá vốn (Cost)</label>
                <input type="number" class="item-cost" min="1000" required value="${item.cost || ''}" oninput="calculateImportTotal()" />
            </div>
            <div style="flex-grow: 1;">
                <label>Số lượng</label>
                <input type="number" class="item-quantity" min="1" required value="${item.quantity || ''}" oninput="calculateImportTotal()" />
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.import-item-row').remove(); calculateImportTotal();">Xóa</button>
        </div>
    `;
    container.appendChild(row);

    if (item.productId) {
        row.querySelector('.item-product-id').value = item.productId;
    }
}

function openImportModal(importId = null) {
    document.getElementById('importForm').reset();
    document.getElementById('importItemsContainer').innerHTML = '';
    
    const imports = window.adminImports || [];
    const imp = importId ? imports.find(i => i.id === importId) : null;
    
    // FIX LỖI DATE FORMAT WARNING
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (imp) {
        if (imp.status === 'Hoàn thành') {
            alert('Không thể sửa phiếu nhập đã hoàn thành.');
        }
        document.getElementById('importModalTitle').textContent = `Sửa Phiếu Nhập #${imp.code}`;
        document.getElementById('importId').value = imp.id;
        document.getElementById('importDate').value = imp.date;
        imp.items.forEach(item => addImportItem(item));
        document.getElementById('btnSaveImport').textContent = imp.status !== 'Hoàn thành' ? 'Lưu Thay Đổi' : 'Đã Hoàn Thành';
        document.getElementById('btnSaveImport').disabled = imp.status === 'Hoàn thành';
    } else {
        document.getElementById('importModalTitle').textContent = 'Tạo Phiếu Nhập Hàng Mới';
        document.getElementById('importId').value = '';
        document.getElementById('importDate').value = dateStr; 
        addImportItem(); 
        document.getElementById('btnSaveImport').textContent = 'Lưu Phiếu Nháp';
        document.getElementById('btnSaveImport').disabled = false;
    }
    
    calculateImportTotal();
    document.getElementById('importModal').style.display = 'flex';
}

document.getElementById('importForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const imports = window.adminImports || [];
    const id = document.getElementById('importId').value;
    const date = document.getElementById('importDate').value;
    const items = [];
    
    document.querySelectorAll('.import-item-row').forEach(row => {
        items.push({
            productId: parseInt(row.querySelector('.item-product-id').value),
            cost: parseInt(row.querySelector('.item-cost').value),
            quantity: parseInt(row.querySelector('.item-quantity').value)
        });
    });
    
    if (items.some(i => !i.productId || i.quantity <= 0)) {
        alert('Vui lòng chọn sản phẩm và nhập số lượng/giá vốn hợp lệ.');
        return;
    }

    if (id) {
        const imp = imports.find(i => i.id == id);
        if (imp) {
            imp.date = date;
            imp.items = items;
            alert(`Đã sửa phiếu nhập hàng #${imp.code}`);
        }
    } else {
        const newId = getNextId(imports);
        const newImport = {
            id: newId,
            code: `PN${String(newId).padStart(4, '0')}`,
            date: date,
            items: items,
            status: 'Nháp'
        };
        imports.push(newImport);
        alert(`Đã tạo phiếu nhập hàng nháp #${newImport.code}`);
    }

    saveAdminData();
    closeModal('importModal');
    loadImports();
});

function completeImport(importId) {
    const imports = window.adminImports || [];
    const products = window.adminProducts || [];
    const imp = imports.find(i => i.id === importId);
    if (!imp || imp.status === 'Hoàn thành') return;

    if (confirm(`Bạn có chắc muốn HOÀN THÀNH phiếu nhập hàng #${imp.code}? Hành động này sẽ cập nhật tồn kho.`)) {
        imp.status = 'Hoàn thành';
        imp.completedDate = new Date().toISOString().split('T')[0];

        imp.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                product.stock += item.quantity;
                product.totalImport += item.quantity;
                product.cost = item.cost;
                product.status = 'Đang bán';
            }
        });
        
        saveAdminData();
        loadImports();
        loadDashboard(); 
        alert(`Phiếu nhập #${imp.code} đã hoàn thành và tồn kho đã được cập nhật.`);
    }
}

// =========================================================
// === 5. QUẢN LÝ GIÁ BÁN (ĐÃ CẬP NHẬT LỌC) ===
// =========================================================
function loadPricing() {
    const tableBody = document.getElementById('pricingTableBody');
    const searchInput = document.getElementById('pricingSearchInput'); // Sửa ID
    const categoryFilter = document.getElementById('pricingCategoryFilter'); // Thêm
    if (!tableBody || !searchInput || !categoryFilter) return;

    const products = window.adminProducts || [];
    const categories = window.adminCategories || [];

    // Điền dữ liệu cho category filter
    if (categoryFilter.options.length <= 1) { 
        categories.filter(c => c.status === 'active').forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.type;
            option.textContent = cat.name;
            categoryFilter.appendChild(option);
        });
    }

    const searchTerm = searchInput.value.toLowerCase();
    const filterCategory = categoryFilter.value; // Thêm
    
    let html = '';
    
    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm) || 
                          p.code.toLowerCase().includes(searchTerm);
        const categoryMatch = !filterCategory || p.type === filterCategory; // Thêm
        return nameMatch && categoryMatch; // Cập nhật
    });

    filteredProducts.forEach(p => {
        const cat = categories.find(c => c.type === p.type) || { name: 'Khác', profit: 0 };
        const profitValue = p.profit === null ? cat.profit : p.profit;
        
        html += `
            <tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${cat.name}</td>
                <td>${formatVND(p.cost || 0)}</td>
                <td>${profitValue}% ${p.profit === null ? '(Mặc định)' : ''}</td>
                <td>${formatVND(p.price)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openPricingModal(${p.id})">Chỉnh giá/Lợi nhuận</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
    
    // searchInput.oninput = loadPricing; // Xóa oninput, dùng nút
}

function openPricingModal(productId) {
    const products = window.adminProducts || [];
    const categories = window.adminCategories || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const category = categories.find(c => c.type === product.type) || { profit: 0 };

    document.getElementById('pricingProductId').value = product.id;
    document.getElementById('pricingModalTitle').textContent = `Chỉnh Sửa Giá Bán: ${product.name}`;
    document.getElementById('pricingProductName').textContent = product.name;
    document.getElementById('pricingProductCost').textContent = formatVND(product.cost || 0);
    document.getElementById('pricingProductProfit').value = product.profit === null ? '' : product.profit;
    document.getElementById('pricingProductPrice').value = product.price;

    document.getElementById('pricingModal').style.display = 'flex';
}

document.getElementById('pricingForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const products = window.adminProducts || [];
    const id = document.getElementById('pricingProductId').value;
    const newPrice = parseInt(document.getElementById('pricingProductPrice').value);
    const newProfitInput = document.getElementById('pricingProductProfit').value;
    
    const newProfit = newProfitInput === '' ? null : parseInt(newProfitInput);

    const product = products.find(p => p.id == id);

    if (product) {
        product.price = newPrice;
        product.profit = newProfit; 
        
        saveAdminData();
        alert(`Đã cập nhật giá bán cho ${product.name} thành ${formatVND(newPrice)}`);
    }

    closeModal('pricingModal');
    loadPricing();
});

// =========================================================
// === 6. QUẢN LÝ ĐƠN HÀNG (ĐÃ CẬP NHẬT LỌC & SẮP XẾP) ===
// =========================================================
function loadOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    const statusFilter = document.getElementById('orderStatusFilter');
    const startFilter = document.getElementById('orderStart');
    const endFilter = document.getElementById('orderEnd');
    const sortFilter = document.getElementById('orderSortFilter'); // THÊM
    if (!tableBody || !statusFilter || !startFilter || !endFilter || !sortFilter) return; // CẬP NHẬT

    const orders = window.adminOrders || [];

    const filterStatus = statusFilter.value;
    const filterStart = startFilter.value;
    const filterEnd = endFilter.value;
    const sortValue = sortFilter.value; // THÊM
    
    let filteredOrders = orders.filter(order => { // BỎ CONST
        const statusMatch = !filterStatus || order.status === filterStatus;
        
        let dateMatch = true;
        if (filterStart && order.date < filterStart) dateMatch = false;
        if (filterEnd && order.date > filterEnd) dateMatch = false;
        
        return statusMatch && dateMatch;
    });
    
    // === LOGIC SẮP XẾP MỚI ===
    if (sortValue === 'ward_asc') {
        filteredOrders.sort((a, b) => {
            // Dữ liệu phường được lấy từ admin_data_sync.js
            const wardA = a.address?.ward.toLowerCase() || 'zzz'; 
            const wardB = b.address?.ward.toLowerCase() || 'zzz';
            // Sắp xếp tiếng Việt
            return wardA.localeCompare(wardB, 'vi'); 
        });
    } else {
        // Mặc định (newest)
        filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); 
    }
    // === KẾT THÚC LOGIC SẮP XẾP ===
    
    let html = '';
    filteredOrders.forEach(order => {
        let statusClass = 'badge-secondary';
        if (order.status === 'Chưa xử lý') statusClass = 'badge-warning';
        if (order.status === 'Đã xử lý' || order.status === 'Đang giao') statusClass = 'btn-primary';
        if (order.status === 'Đã giao thành công') statusClass = 'badge-active';
        if (order.status === 'Đã hủy') statusClass = 'badge-locked';
        
        html += `
            <tr>
                <td>${order.code}</td>
                <td>${order.customerName}</td>
                <td>${order.date}</td>
                <td>${formatVND(order.total)}</td>
                <td><span class="badge ${statusClass}">${order.status}</span></td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="openOrderModal(${order.id})">Chi tiết</button>
                    <button class="btn btn-primary btn-sm" onclick="updateOrderStatus(${order.id}, 'Đã xử lý')">Xử lý nhanh</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function openOrderModal(orderId) { 
    const orders = window.adminOrders || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('orderDetailCode').textContent = `#${order.code}`;
    document.getElementById('orderStatusUpdate').value = order.status;
    
    document.getElementById('btnUpdateOrderStatus').onclick = () => {
        const newStatus = document.getElementById('orderStatusUpdate').value;
        if (order.status !== newStatus) {
            updateOrderStatus(order.id, newStatus);
            closeModal('orderModal');
        } else {
            alert('Trạng thái không thay đổi.');
        }
    };

    let itemsHTML = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <span>${item.name} x ${item.quantity}</span>
            <span>${formatVND(item.price * item.quantity)}</span>
        </div>
    `).join('');

    document.getElementById('orderDetailContent').innerHTML = `
        <p><strong>Khách hàng:</strong> ${order.customerName}</p>
        <p><strong>Ngày đặt:</strong> ${order.date}</p>
        <p><strong>Tổng tiền:</strong> ${formatVND(order.total)}</p>
        <p><strong>Địa chỉ:</strong> ${order.shippingAddress}</p>
        <p><strong>Ghi chú:</strong> ${order.orderNote || 'Không có'}</p>
        <p><strong>Thanh toán:</strong> ${order.paymentMethod === 'cash' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}</p>
        <h4 style="margin-top: 10px;">Sản phẩm:</h4>
        <div style="border: 1px solid #eee; padding: 10px;">${itemsHTML}</div>
        <p style="margin-top: 10px;"><strong>Trạng thái hiện tại:</strong> <span class="badge badge-warning">${order.status}</span></p>
    `;
    
    document.getElementById('orderModal').style.display = 'flex';
}

function updateOrderStatus(orderId, newStatus) {
    const orders = window.adminOrders || [];
    const products = window.adminProducts || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const isConfirmed = document.getElementById('orderModal').style.display === 'flex' ? true : confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng #${order.code} sang "${newStatus}"?`);
    
    if (isConfirmed) {
        order.status = newStatus;
        order.updateDate = new Date().toISOString().split('T')[0];

        if (newStatus === 'Đã giao thành công') {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    product.totalSold = (product.totalSold || 0) + item.quantity;
                }
            });
        }
        
       // CẬP NHẬT TRỞ LẠI LOCALSTORAGE CỦA KHÁCH HÀNG (FIXED)
       const userOrders = JSON.parse(localStorage.getItem(`orders_${order.originalUsername}`) || '[]');
       if (userOrders[order.originalOrderIndex]) {
           let userStatus = 'pending';
           // ÁNH XẠ TRẠNG THÁI (FIXED)
           if (newStatus === 'Đã xử lý') userStatus = 'shipped'; 
           if (newStatus === 'Đang giao') userStatus = 'shipped'; 
           if (newStatus === 'Đã giao thành công') userStatus = 'completed'; 
           if (newStatus === 'Đã hủy') userStatus = 'cancelled';

           userOrders[order.originalOrderIndex].status = userStatus;
           localStorage.setItem(`orders_${order.originalUsername}`, JSON.stringify(userOrders));
       }

        saveAdminData();
        loadOrders();
        loadDashboard();
        alert(`Đã cập nhật đơn hàng #${order.code} sang trạng thái "${newStatus}".`);
    }
}

// =========================================================
// === 7. QUẢN LÝ TỒN KHO (ĐÃ CẬP NHẬT LỌC) ===
// =========================================================
function loadInventory() {
    const tableBody = document.getElementById('inventoryTableBody');
    const lowStockAlert = document.getElementById('lowStockAlert');
    const searchInput = document.getElementById('inventorySearchInput');
    const categoryFilter = document.getElementById('inventoryCategoryFilter');
    if (!tableBody || !lowStockAlert || !searchInput || !categoryFilter) return;

    const products = window.adminProducts || [];
    const categories = window.adminCategories || [];

    // Điền dữ liệu cho category filter
    if (categoryFilter.options.length <= 1) { 
        categories.filter(c => c.status === 'active').forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.type;
            option.textContent = cat.name;
            categoryFilter.appendChild(option);
        });
    }

    // Lấy giá trị lọc
    const searchTerm = searchInput.value.toLowerCase();
    const filterCategory = categoryFilter.value;

    let totalLowStock = 0;
    let html = '';
    
    // Lọc sản phẩm
    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm) || 
                          p.code.toLowerCase().includes(searchTerm);
        const categoryMatch = !filterCategory || p.type === filterCategory;
        return nameMatch && categoryMatch;
    });

    // Dùng filteredProducts
    filteredProducts.sort((a, b) => a.stock - b.stock).forEach(p => {
        const stock = p.stock; 
        const isLow = stock < 10 && p.status === 'Đang bán';
        if (isLow) totalLowStock++;

        const cat = categories.find(c => c.type === p.type) || { name: 'Khác' };
        
        html += `
            <tr class="${isLow ? 'table-warning' : ''}">
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${cat.name}</td>
                <td>${p.totalImport || 0}</td>
                <td>${p.totalSold || 0}</td>
                <td>${stock}</td>
                <td>${isLow ? '<span style="color:#e74c3c; font-weight:600;">⚠️ THẤP</span>' : 'Ổn định'}</td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;

    if (totalLowStock > 0) {
        lowStockAlert.textContent = `⚠️ Có ${totalLowStock} sản phẩm đang ở mức tồn kho thấp (dưới 10).`;
        lowStockAlert.style.display = 'block';
    } else {
        lowStockAlert.style.display = 'none';
    }
}

function loadInventoryReport() {
    alert('Báo cáo tồn kho trong khoảng thời gian (cần logic phức tạp hơn) đang được phát triển.');
}


// === KHỞI TẠO ===
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = loggedInAdmin?.is_admin === true;

    document.getElementById('loginPage').style.display = isLoggedIn ? 'none' : 'flex';
    document.getElementById('adminPage').style.display = isLoggedIn ? 'grid' : 'none';

    if (isLoggedIn) {
        document.getElementById('adminName').textContent = loggedInAdmin.name;
        loadDashboard(); 
        
        // GẮN SỰ KIỆN SUBMIT CHO CÁC MODAL FORM
        document.getElementById('categoryForm')?.addEventListener('submit', function (e) { /* Logic đã có ở trên */ });
        document.getElementById('productForm')?.addEventListener('submit', function (e) { /* Logic đã có ở trên */ });
        document.getElementById('pricingForm')?.addEventListener('submit', function (e) { /* Logic đã có ở trên */ });
        document.getElementById('importForm')?.addEventListener('submit', function (e) { /* Logic đã có ở trên */ });

        // GẮN SỰ KIỆN CHO FORM ĐỔI MẬT KHẨU (MỚI)
        document.getElementById('adminPasswordForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const newPass = document.getElementById('adminNewPassword').value;
            const confirmPass = document.getElementById('adminConfirmPassword').value;

            if (newPass.length < 6) {
                alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
                return;
            }
            
            if (newPass !== confirmPass) {
                alert('Mật khẩu mới và xác nhận không khớp!');
                return;
            }

            if (confirm('Bạn có chắc chắn muốn đổi mật khẩu?')) {
                // 1. Cập nhật trong window
                loggedInAdmin.password = newPass;
                
                // 2. Cập nhật trong adminUsers (rất quan trọng)
                const userInList = (window.adminUsers || []).find(u => u.id === loggedInAdmin.id);
                if (userInList) {
                    userInList.password = newPass;
                }
                
                // 3. Cập nhật admin_logged_in_user (để lần sau login là pass mới)
                localStorage.setItem('admin_logged_in_user', JSON.stringify(loggedInAdmin));
                
                // 4. Lưu vào danh sách chung
                saveAdminData();
                
                alert('Đổi mật khẩu thành công!');
                document.getElementById('adminPasswordForm').reset();
            }
        });
        
        // GẮN SỰ KIỆN CHO FORM THÊM NGƯỜI DÙNG (MỚI)
        document.getElementById('userForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('userId').value;
            const username = document.getElementById('userUsername').value.trim();
            const fullName = document.getElementById('userFullName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const password = document.getElementById('userPassword').value;

            if (id) {
                // Logic sửa (chưa được yêu cầu, có thể phát triển sau)
            } else {
                // Logic Thêm Mới
                if (!username || !fullName || !email || !password) {
                    alert('Vui lòng điền đầy đủ thông tin.');
                    return;
                }
                
                // Kiểm tra username tồn tại
                if ((window.adminUsers || []).find(u => u.username === username)) {
                    alert('Tên tài khoản này đã tồn tại. Vui lòng chọn tên khác.');
                    return;
                }

                const newUser = {
                    id: getNextId(window.adminUsers),
                    fullName: fullName,
                    name: fullName, // Thêm trường 'name' cho đồng bộ
                    username: username,
                    email: email,
                    password: password,
                    is_admin: false,
                    status: 'active'
                };

                // 1. Thêm vào danh sách admin (window.adminUsers)
                window.adminUsers.push(newUser);
                
                // 2. Thêm vào danh sách client (bs_users)
                // Đây là bước quan trọng để người dùng mới có thể đăng nhập
                const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]');
                bsUsers.push(newUser); // Đẩy newUser vào
                localStorage.setItem('bs_users', JSON.stringify(bsUsers));

                // 3. Lưu lại tất cả
                saveAdminData();
                
                alert('Đã thêm người dùng mới thành công!');
                closeModal('userModal');
                loadUsers(); // Tải lại bảng người dùng
            }
        });
    }
});