// Dữ liệu toàn cục của Admin
window.adminUsers = [];
window.adminProducts = [];
window.adminCategories = [];
window.currentImportItems = [];

function formatVND(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// === KHỞI TẠO DỮ LIỆU ===
async function initAdminData() {
    try {
        const roleFilter = document.getElementById('userRoleFilter')?.value || '';
        const [resUsers, resCats, resProducts] = await Promise.all([
            fetch(`../api/admin/get_users.php?role=${roleFilter}`).then(r => r.json()),
            fetch('../api/admin/get_categories.php').then(r => r.json()),
            fetch('../api/admin/get_products.php').then(r => r.json())
        ]);

        if (resUsers.success) window.adminUsers = resUsers.users;
        if (resCats.success) window.adminCategories = resCats.categories;
        if (resProducts.success) window.adminProducts = resProducts.products;

        // Khởi động các bộ lọc lần đầu
        updateFilters();
        loadDashboard();
        // Giữ nguyên section đang active
        const activeSection = document.querySelector('.section.active')?.id || 'dashboard';
        loadSection(activeSection);
    } catch (error) {
        console.error('Lỗi khởi tạo:', error);
    }
}

function logout() {
    if (confirm('Xác nhận đăng xuất?')) {
        location.reload();
    }
}

// === ĐIỀU HƯỚNG ===
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
        users: loadUsers,
        categories: loadCategories,
        products: loadProducts,
        pricing: loadPricing,
        inventory: loadInventoryReport,
        imports: loadImports,
        orders: loadOrders
    };
    if (typeof actions[section] === 'function') {
        actions[section]();
        updateFilters(); // Luôn cập nhật bộ lọc khi chuyển trang
    }
}

function updateFilters() {
    const categories = window.adminCategories || [];
    const filters = ['productCategoryFilter', 'pricingCategoryFilter', 'reportCategory'];
    filters.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const current = select.value;
            select.innerHTML = '<option value="">-- Tất cả loại --</option>' +
                categories.map(c => `<option value="${c.type}">${c.name}</option>`).join('');
            if (current) select.value = current;
        }
    });

    // Cập nhật mặc định cho báo cáo nếu trống
    const pointDateInput = document.getElementById('reportPointDate');
    if (pointDateInput && !pointDateInput.value) {
        pointDateInput.value = new Date().toISOString().split('T')[0];
    }

    if (document.getElementById('reportStart') && !document.getElementById('reportStart').value) {
        const d = new Date();
        document.getElementById('reportEnd').value = d.toISOString().split('T')[0];
        d.setMonth(d.getMonth() - 1);
        document.getElementById('reportStart').value = d.toISOString().split('T')[0];
    }
}

// === DASHBOARD ===
async function loadDashboard() {
    try {
        const resStats = await fetch('../api/admin/get_stats.php').then(r => r.json());
        if (resStats.success) {
            const s = resStats.stats;
            if (document.getElementById('totalRevenue')) document.getElementById('totalRevenue').textContent = formatVND(s.revenue);
            if (document.getElementById('totalUsers')) document.getElementById('totalUsers').textContent = s.users;
            if (document.getElementById('totalProducts')) document.getElementById('totalProducts').textContent = s.products;
            if (document.getElementById('newOrders')) document.getElementById('newOrders').textContent = s.new_orders;

            // Render Recent Orders
            const recentDiv = document.getElementById('recentOrdersDashboard');
            if (recentDiv) {
                if (s.recent_orders.length > 0) {
                    recentDiv.innerHTML = s.recent_orders.map(o => {
                        let statusColor = '#3b82f6';
                        if (o.status === 'Đã giao thành công' || o.status === 'completed') statusColor = '#10b981';
                        if (o.status === 'Đã hủy' || o.status === 'cancelled') statusColor = '#ef4444';
                        if (o.status === 'Chưa xử lý' || o.status === 'pending') statusColor = '#f59e0b';

                        return `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    <div style="width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #3b82f6; border: 1px solid #e2e8f0;">#</div>
                                    <div>
                                        <div style="font-weight: 700; color: #1e293b; font-size: 14px;">${o.receiver_name}</div>
                                        <div style="font-size: 11px; color: #64748b;">${o.order_date} (T.toán: ${o.payment_method})</div>
                                    </div>
                                </div>
                                <div style="text-align: right; display: flex; align-items: center; gap: 20px;">
                                    <div>
                                        <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${formatVND(o.total_amount)}</div>
                                        <div style="font-size: 10px; font-weight: 700; color: ${statusColor}; text-transform: uppercase;">● ${o.status}</div>
                                    </div>
                                    <button class="adv-btn" style="padding: 6px 16px; font-size: 11px; border-radius: 10px; background: #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2); border:none; color:white; font-weight:600; cursor:pointer;" onclick="viewDashboardOrderDetail(${o.id})">
                                        Chi tiết đơn hàng
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    recentDiv.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 40px;">Chưa có đơn hàng nào.</p>';
                }
            }

            // Render Low Stock
            const lowDiv = document.getElementById('lowStockDashboard');
            if (lowDiv) {
                if (s.low_stock.length > 0) {
                    lowDiv.innerHTML = s.low_stock.map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: white; border-radius: 12px; border: 1px solid #fee2e2;">
                            <div style="font-weight: 600; color: #1e293b; font-size: 13px; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 11px; color: #64748b;">Tồn:</span>
                                <span style="background: #fee2e2; color: #b91c1c; font-weight: 800; padding: 2px 8px; border-radius: 6px; font-size: 12px;">${p.stock}</span>
                            </div>
                        </div>
                    `).join('');
                } else {
                    lowDiv.innerHTML = '<p style="color: #1e40af; font-size: 13px; text-align: center; padding: 30px;">Kho hàng đang rất ổn định!</p>';
                }
            }
        }
    } catch (e) { console.error(e); }
}

function goToOrdersSection() {
    const orderMenu = document.querySelector('.menu-item[data-section="orders"]');
    if (orderMenu) orderMenu.click();
}

async function viewDashboardOrderDetail(id) {
    try {
        const res = await fetch(`../api/admin/get_order_details.php?id=${id}`).then(r => r.json());
        if (res.success) {
            const o = res.order;
            let itemsHtml = (res.items || []).map(i => `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding:8px 0; font-size:13px;">
                    <span>${i.product_name} <strong>x${i.qty}</strong></span>
                    <span style="font-weight:600;">${formatVND(i.price)}</span>
                </div>
            `).join('');


            document.getElementById('orderDetailCode').textContent = `Chi tiết Đơn #DH${o.id}`;
            document.getElementById('orderDetailContent').innerHTML = `
                <div style="background:#f1f5f9; padding:15px; border-radius:12px; margin-bottom:20px; border-left:4px solid #3b82f6;">
                    <div style="font-size:14px; margin-bottom:5px;"><strong>Khách hàng:</strong> ${o.receiver_name}</div>
                    <div style="font-size:14px; margin-bottom:5px;"><strong>Điện thoại:</strong> ${o.receiver_phone}</div>
                    <div style="font-size:14px; margin-bottom:5px;"><strong>Hình thức:</strong> ${o.payment_method} (${o.payment_status || 'Chờ t.toán'})</div>
                    <div style="font-size:14px; margin-bottom:5px;"><strong>Địa chỉ:</strong> ${o.shipping_address}</div>
                    <div style="font-size:15px; margin-top:10px; color:#ef4444; font-weight:800;">TỔNG: ${formatVND(o.total_amount)}</div>
                </div>
                <div style="max-height:200px; overflow-y:auto; margin-bottom:20px;">
                    <div style="font-weight:700; margin-bottom:10px; font-size:14px; color:#64748b; text-transform:uppercase;">Sản phẩm:</div>
                    ${itemsHtml}
                </div>
                <div style="text-align:center; padding-top:10px; border-top:1px dashed #cbd5e1;">
                    <button class="adv-btn adv-btn-success" style="width:100%; padding:12px;" onclick="closeModal('orderModal'); goToOrdersSection();">
                        <i class="bi bi-arrow-right-circle"></i> Đi đến danh sách đơn hàng xử lý
                    </button>
                </div>
            `;

            // Ẩn các nút cập nhật trạng thái chuẩn của orderModal
            document.getElementById('orderStatusUpdate').parentElement.style.display = 'none';
            document.getElementById('btnUpdateOrderStatus').style.display = 'none';

            document.getElementById('orderModal').style.display = 'flex';
        }
    } catch (e) {
        console.error(e);
    }
}

// === 1. QUẢN LÝ NGƯỜI DÙNG ===
function loadUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    // Lấy giá trị lọc
    const roleFilter = document.getElementById('userRoleFilter')?.value || '';
    let users = window.adminUsers || [];

    // Lọc dữ liệu client-side để nhanh hơn
    if (roleFilter) {
        users = users.filter(u => u.role === roleFilter);
    }

    tableBody.innerHTML = users.map(u => {
        const statusClass = u.status === 'active' ? 'badge-active' : 'badge-locked';
        const roleLabel = u.role === 'admin' ? '<span style="color:#ef4444; font-weight:bold;">Quản trị viên</span>' : '<span style="color:#3b82f6;">Khách hàng</span>';

        return `
            <tr>
                <td>${u.id}</td>
                <td>${u.fullname || 'N/A'}</td>
                <td>${u.username}</td>
                <td>${u.email || 'N/A'}</td>
                <td>${roleLabel}</td>
                <td><span class="badge ${statusClass}">${u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span></td>
                <td>
                    ${u.role === 'admin' ? '<span style="color:#94a3b8; font-style:italic; font-size:11px;">Hệ thống bảo vệ (Admin)</span>' : `
                    <div style="display: flex; gap: 4px;">
                        <button class="adv-btn adv-btn-primary" style="padding: 4px 8px; font-size: 11px;" onclick="editUser(${u.id})">
                             Sửa
                        </button>
                        <button class="adv-btn adv-btn-gray" style="padding: 4px 8px; font-size: 11px;" onclick="toggleUserStatus(${u.id}, '${u.status}')">
                            ${u.status === 'active' ? 'Khóa' : 'Mở'}
                        </button>
                        <button class="adv-btn adv-btn-warning" style="padding: 4px 8px; font-size: 11px; background-color: #f59e0b; color: white;" onclick="resetUserPassword(${u.id})">
                             Đặt lại Mật khẩu
                        </button>
                    </div>`}
                </td>
            </tr>`;
    }).join('');
}

async function resetUserPassword(userId) {
    const newPass = prompt('Nhập mật khẩu mới cho người dùng này:');
    if (!newPass || newPass.trim().length < 6) {
        if (newPass !== null) alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    try {
        const res = await fetch('../api/admin/reset_user_password.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, new_password: newPass })
        }).then(r => r.json());
        alert(res.message);
    } catch (e) { alert('Lỗi kết nối.'); }
}

async function toggleUserStatus(id, current) {
    const next = current === 'active' ? 'locked' : 'active';
    try {
        const res = await fetch('../api/admin/toggle_user_status.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: next })
        }).then(r => r.json());
        if (res.success) initAdminData();
    } catch (e) { console.error(e); }
}

// === 2. QUẢN LÝ LOẠI SẢN PHẨM ===
function loadCategories() {
    const tableBody = document.getElementById('categoriesTableBody');
    if (!tableBody) return;
    const cats = window.adminCategories || [];
    tableBody.innerHTML = cats.map(c => {
        const isStatusActive = (c.status === 'Hiển thị' || c.status === 'active');
        const badgeColor = isStatusActive ? 'var(--adv-success)' : 'var(--adv-gray)';
        const statusText = isStatusActive ? 'Hoạt động' : 'Đã ẩn';
        return `
        <tr>
            <td style="font-weight: 500;">${c.code || 'N/A'}</td>
            <td>${c.name}</td>
            <td style="color: var(--adv-gray);">${c.type}</td>
            <td><span style="color: ${badgeColor}; font-weight: 600;">${statusText}</span></td>
            <td>
                <button class="adv-btn adv-btn-gray" style="padding: 4px 10px; font-size: 12px;" onclick="toggleCategoryStatus(${c.id}, ${isStatusActive})">${isStatusActive ? 'Ẩn' : 'Hiện'}</button>
            </td>
        </tr>`;
    }).join('');
}

function editInlineCategory(id) {
    const c = window.adminCategories.find(x => x.id == id);
    if (c) {
        document.getElementById('inlineCategoryId').value = c.id;
        document.getElementById('inlineCategoryName').value = c.name;
        document.getElementById('inlineCategoryType').value = c.type;
        document.getElementById('inlineCategoryCode').value = c.code;
        document.getElementById('inlineCategoryStatus').value = c.status || 'active';
        document.getElementById('inlineCategoryFormTitle').textContent = 'Sửa Loại: ' + c.name;
    }
}

function resetInlineCategoryForm() {
    document.getElementById('inlineCategoryForm').reset();
    document.getElementById('inlineCategoryId').value = '';
    document.getElementById('inlineCategoryFormTitle').textContent = 'Thêm Loại Mới';
}

async function toggleCategoryStatus(id, active) {
    const next = active ? 'Ẩn' : 'Hiển thị';
    if (!confirm(`Bạn có chắc muốn ${active ? 'ẨN' : 'HIỆN'} loại sản phẩm này?`)) return;
    try {
        const res = await fetch('../api/admin/toggle_category_status.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: next })
        }).then(r => r.json());
        if (res.success) initAdminData();
    } catch (e) { console.error(e); }
}

// === 3. QUẢN LÝ SẢN PHẨM ===
function loadProducts() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    // Lấy giá trị lọc
    const searchTerm = document.getElementById('productSearchInput')?.value.toLowerCase() || '';
    const catFilter = document.getElementById('productCategoryFilter')?.value || '';

    const products = window.adminProducts || [];
    const categories = window.adminCategories || [];

    const filtered = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm) || (p.code && p.code.toLowerCase().includes(searchTerm));
        const catMatch = !catFilter || p.type === catFilter;
        return nameMatch && catMatch;
    });

    tableBody.innerHTML = filtered.map(p => {
        const cat = categories.find(c => c.type === p.type) || { name: p.type || 'Khác' };
        const statusClass = p.status === 'Đang bán' ? 'badge-active' : 'badge-locked';
        return `
        <tr>
            <td><img src="../${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;"></td>
            <td>${p.name} <br><small style="color:#777">(${p.code || 'N/A'})</small></td>
            <td><span style="font-weight:500">${cat.name}</span><br><small style="color:#777">${p.brand || ''}</small></td>
            <td style="font-weight:600">${formatVND(p.price)}</td>
            <td>${p.stock}</td>
            <td><span class="badge ${statusClass}">${p.status || 'Đang bán'}</span></td>
            <td>
                <div style="display:flex; gap:4px;">
                    <button class="adv-btn adv-btn-primary" style="padding:4px 8px; font-size:11px;" onclick="openProductModal(${p.id})">Sửa</button>
                    <button class="adv-btn adv-btn-danger" style="padding:4px 8px; font-size:11px;" onclick="deleteProduct(${p.id})">Xóa</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

async function deleteProduct(id) {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
        const res = await fetch('../api/admin/delete_product.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        }).then(r => r.json());
        alert(res.message);
        initAdminData();
    } catch (e) { console.error(e); }
}

// === 4. QUẢN LÝ GIÁ BÁN ===
function loadPricing() {
    const tableBody = document.getElementById('pricingTableBody');
    if (!tableBody) return;

    const searchTerm = document.getElementById('pricingSearchInput')?.value.toLowerCase() || '';
    const catFilter = document.getElementById('pricingCategoryFilter')?.value || '';

    const products = window.adminProducts || [];
    const categories = window.adminCategories || [];

    const filtered = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm) || (p.code && p.code.toLowerCase().includes(searchTerm));
        const catMatch = !catFilter || p.type === catFilter;
        return nameMatch && catMatch;
    });

    tableBody.innerHTML = filtered.map(p => {
        const cat = categories.find(c => c.type === p.type) || { name: p.type || 'Khác' };
        const cost = p.cost || 0;
        // Tỷ lệ % lợi nhuận (Sử dụng giá trị lưu trong DB, hoặc tính nếu DB trống)
        const profitPercent = p.profit || (cost > 0 ? Math.round(((p.price - cost) / cost) * 100) : 15);

        return `
            <tr>
                <td>${p.name}</td>
                <td style="font-weight:500; color:var(--adv-primary)">${cat.name}</td>
                <td style="color:red; font-weight:600;">${formatVND(cost)}</td>
                <td>
                    <input type="number" class="adv-input-sm" id="inlineProfit_${p.id}" value="${profitPercent}" 
                           oninput="recalcExpectedPrice(${p.id}, ${cost})" ${cost === 0 ? 'disabled' : ''}> %
                    ${cost === 0 ? '<br><small style="color:orange;">Cần nhập giá vốn trước</small>' : ''}
                </td>
                <td id="inlineExpectedPrice_${p.id}" style="font-weight:600;">${formatVND(p.price)}</td>
                <td>
                    <button class="adv-btn adv-btn-success" onclick="updateInlineProfit(${p.id})">Lưu giá</button>
                </td>
            </tr>`;
    }).join('');
}

function recalcExpectedPrice(id, cost) {
    const profit = parseInt(document.getElementById('inlineProfit_' + id).value) || 0;
    const price = cost + Math.round((cost * profit) / 100);
    document.getElementById('inlineExpectedPrice_' + id).textContent = formatVND(price);
}

async function updateInlineProfit(id) {
    const profit = parseInt(document.getElementById('inlineProfit_' + id).value) || 0;
    const p = window.adminProducts.find(x => x.id == id);
    const newPrice = p.cost + Math.round((p.cost * profit) / 100);
    try {
        const res = await fetch('../api/admin/update_profit_inline.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, profit, price: newPrice })
        }).then(r => r.json());
        if (res.success) { alert('Đã cập nhật giá mới.'); initAdminData(); }
    } catch (e) { alert('Lỗi kết nối.'); }
}

// === 6. QUẢN LÝ NHẬP HÀNG (PHIẾU NHẬP) ===
function openImportModal() {
    window.currentImportItems = [];
    const form = document.getElementById('importForm');
    if (form) form.reset();
    document.getElementById('importDate').valueAsDate = new Date();
    renderImportItems();
    document.getElementById('importModal').style.display = 'flex';
}

// Tìm kiếm sản phẩm trong Modal nhập hàng
const importSearchInput = document.getElementById('importSearchProduct');
const resultsDiv = document.getElementById('importSearchResults');

const performImportSearch = (q) => {
    q = q.toLowerCase().trim();
    if (!q) { resultsDiv.style.display = 'none'; return; }

    const products = window.adminProducts || [];
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.code && p.code.toLowerCase().includes(q))
    );

    if (filtered.length > 0) {
        resultsDiv.innerHTML = filtered.map(p => `
            <div onclick="addImportItem(${p.id}, '${p.name.replace(/'/g, "\\'")}', '${p.code || ''}', ${p.cost || 0})" 
                 class="import-search-item"
                 style="padding:12px; cursor:pointer; border-bottom:1px solid #f1f5f9; transition: background 0.2s;">
                <div style="font-weight:700; font-size:13px; color:#1e293b;">${p.name}</div>
                <div style="font-size:11px; color:#64748b; margin-top:2px;">
                    <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:600;">SKU: ${p.code || 'N/A'}</span>
                    <span style="margin-left:8px;">📦 Kho: <strong>${p.stock}</strong></span>
                </div>
            </div>
        `).join('');
        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.innerHTML = '<div style="padding:15px; font-size:13px; color:#94a3b8; text-align:center;">Không tìm thấy sản phẩm nào.</div>';
        resultsDiv.style.display = 'block';
    }
};

importSearchInput?.addEventListener('input', (e) => performImportSearch(e.target.value));
importSearchInput?.addEventListener('focus', (e) => performImportSearch(e.target.value));

// Close results when clicking outside
document.addEventListener('click', (e) => {
    if (!importSearchInput?.contains(e.target) && !resultsDiv?.contains(e.target)) {
        if (resultsDiv) resultsDiv.style.display = 'none';
    }
});

function addImportItem(id, name, code, cost) {
    document.getElementById('importSearchResults').style.display = 'none';
    document.getElementById('importSearchProduct').value = '';

    const existing = window.currentImportItems.find(x => x.product_id == id);
    if (existing) {
        existing.qty++;
    } else {
        window.currentImportItems.push({ product_id: id, name, code, qty: 1, cost: cost });
    }
    renderImportItems();
}

function renderImportItems() {
    const container = document.getElementById('importItemsContainer');
    if (!container) return;

    container.innerHTML = window.currentImportItems.map((item, idx) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding:12px 10px;">
                <div style="font-weight:600; font-size:13px;">${item.name}</div>
                <div style="font-size:11px; color:#94a3b8;">SKU: ${item.code || 'N/A'}</div>
            </td>
            <td style="padding:12px 10px; text-align:center;">
                <input type="number" value="${item.qty}" min="1" onchange="updateImportItemQty(${idx}, this.value)" 
                       style="width:60px; text-align:center; border:1px solid #e2e8f0; border-radius:6px; padding:4px;">
            </td>
            <td style="padding:12px 10px;">
                <input type="number" value="${item.cost}" min="0" onchange="updateImportItemCost(${idx}, this.value)" 
                       style="width:120px; border:1px solid #e2e8f0; border-radius:6px; padding:4px;">
            </td>
            <td style="padding:12px 10px; font-weight:700; color:#1e40af;">
                ${formatVND(item.qty * item.cost)}
            </td>
            <td style="padding:12px 10px; text-align:right;">
                <button type="button" onclick="removeImportItem(${idx})" style="color:#ef4444; border:none; background:transparent; font-size:18px; cursor:pointer;">&times;</button>
            </td>
        </tr>
    `).join('');

    if (window.currentImportItems.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#94a3b8;">Chưa có SP nào được chọn. Hãy tìm kiếm để thêm!</td></tr>';
    }

    updateImportTotals();
}

function updateImportItemQty(idx, val) { window.currentImportItems[idx].qty = parseInt(val) || 1; updateImportTotals(); }
function updateImportItemCost(idx, val) { window.currentImportItems[idx].cost = parseFloat(val) || 0; updateImportTotals(); }
function removeImportItem(idx) { window.currentImportItems.splice(idx, 1); renderImportItems(); }

function updateImportTotals() {
    const total = window.currentImportItems.reduce((acc, item) => acc + (item.qty * item.cost), 0);
    document.getElementById('importItemCountDisplay').textContent = window.currentImportItems.length;
    document.getElementById('importTotalDisplay').textContent = formatVND(total);
}

async function loadImports() {
    const tableBody = document.getElementById('importsTableBody');
    if (!tableBody) return;

    const start = document.getElementById('importStartDate')?.value || '';
    const end = document.getElementById('importEndDate')?.value || '';
    const status = document.getElementById('importStatusFilter')?.value || '';

    let url = '../api/admin/get_imports.php?';
    if (start) url += `start=${start}&`;
    if (end) url += `end=${end}&`;
    if (status) url += `status=${status}&`;

    try {
        const res = await fetch(url).then(r => r.json());
        if (res.success) {
            tableBody.innerHTML = res.imports.map(m => {
                const statusClass = m.status === 'Hoàn thành' ? 'badge-active' : 'badge-pending';
                return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 15px 20px; font-weight:700; color:#1e40af;">#PN-${m.id}</td>
                        <td style="padding: 15px 20px; color:#475569;">${m.import_date}</td>
                        <td style="padding: 15px 20px; text-align:right; font-weight:800; color:#0f172a;">${formatVND(m.total_cost)}</td>
                        <td style="padding: 15px 20px; text-align:center;">
                            <span class="badge ${statusClass}">${m.status}</span>
                        </td>
                        <td style="padding: 15px 20px; text-align:right;">
                            <button class="adv-btn adv-btn-gray" style="padding:6px 12px; font-size:11px;" onclick="viewImportDetail(${m.id})">🔍 Chi tiết</button>
                        </td>
                    </tr>
                `;
            }).join('');
            if (res.imports.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:40px; color:#94a3b8;">Không tìm thấy phiếu nhập nào phù hợp.</td></tr>';
            }
        }
    } catch (e) {
        console.error('Lỗi nạp phiếu nhập:', e);
    }
}

async function viewImportDetail(id) {
    try {
        const res = await fetch(`../api/admin/get_import_details.php?id=${id}`).then(r => r.json());
        if (res.success) {
            const imp = res.import;
            document.getElementById('importDetailCode').textContent = `#PN-${imp.id}`;

            let itemsHtml = (res.items || []).map(i => `
                <div style="display:grid; grid-template-columns: 2fr 1fr 2fr 2fr; gap:10px; border-bottom:1px solid #bae6fd; padding:12px 0; align-items:center;">
                    <span style="font-weight:600;">${i.product_name}</span>
                    <span style="text-align:center;">x ${i.qty}</span>
                    <span style="color:#64748b;">${formatVND(i.cost_price)}</span>
                    <span style="font-weight:700; text-align:right;">${formatVND(i.qty * i.cost_price)}</span>
                </div>
            `).join('');

            const statusBadge = imp.status === 'Hoàn thành' ? '<span class="badge badge-active">Hoàn thành</span>' : '<span class="badge badge-pending">Phiếu Nháp</span>';
            const actionBtn = imp.status === 'Nháp' ? `
                <div style="margin-top:25px; display:flex; justify-content:space-between; align-items:center; background:#fff8e1; padding:15px; border-radius:12px; border:1px solid #ffe082;">
                    <div style="color:#795548; font-size:12px; font-weight:600;">Phiếu này đang ở trạng thái Nháp. Click để xác nhận hoàn thành và CỘNG KHO.</div>
                    <button class="adv-btn adv-btn-success" onclick="completeImportSlip(${imp.id})" style="padding:0 25px; height:40px; font-size:13px; font-weight:700;">✅ Hoàn Thành Phiếu</button>
                </div>
            ` : '';

            document.getElementById('importDetailContent').innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:2px solid #bae6fd; padding-bottom:10px;">
                    <div>
                        <div style="font-size:12px; color:#64748b; text-transform:uppercase; font-weight:700;">Ngày nhập / Trạng thái</div>
                        <div style="font-size:16px; font-weight:800; color:#1e40af; display:flex; align-items:center; gap:10px;">
                            ${imp.import_date} | ${statusBadge}
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:12px; color:#64748b; text-transform:uppercase; font-weight:700;">Tổng giá trị</div>
                        <div style="font-size:20px; font-weight:900; color:#1e40af;">${formatVND(imp.total_cost)}</div>
                    </div>
                </div>
                <div style="background:white; padding:15px; border-radius:8px; border:1px solid #bae6fd;">
                    <div style="display:grid; grid-template-columns: 2fr 1fr 2fr 2fr; gap:10px; color:#94a3b8; font-size:11px; text-transform:uppercase; font-weight:800; margin-bottom:10px;">
                        <span>Sản phẩm</span>
                        <span style="text-align:center;">SL</span>
                        <span>Đơn giá</span>
                        <span style="text-align:right;">Thành tiền</span>
                    </div>
                    ${itemsHtml}
                </div>
                ${actionBtn}
            `;
            document.getElementById('importDetailModal').style.display = 'flex';
        } else alert(res.message);
    } catch (e) { console.error(e); }
}

async function completeImportSlip(id) {
    if (!confirm('CHÚ Ý: Một khi đã hoàn thành phiếu, số lượng sản phẩm trong kho sẽ được cộng thêm và bạn không thể hoàn tác lại trạng thái Nháp. \n\nXác nhận hoàn thành?')) return;
    try {
        const res = await fetch('../api/admin/complete_import.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        }).then(r => r.json());

        if (res.success) {
            alert(res.message);
            closeModal('importDetailModal');
            loadImports();
        } else {
            alert('Lỗi: ' + res.message);
        }
    } catch (e) { console.error(e); }
}

// === 4.5. QUẢN LÝ ĐƠN HÀNG ===
async function loadOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;

    const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
    const addressFilter = document.getElementById('orderAddressFilter')?.value.toLowerCase() || '';
    const startFilter = document.getElementById('orderStart')?.value || '';
    const endFilter = document.getElementById('orderEnd')?.value || '';
    const sortFilter = document.getElementById('orderSortFilter')?.value || '';

    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px;">Đang tải...</td></tr>';

    try {
        const res = await fetch('../api/admin/get_orders.php').then(r => r.json());
        if (res.success) {
            let orders = res.orders || [];

            orders = orders.filter(o => {
                let match = true;
                if (statusFilter && statusFilter !== 'Tất cả' && o.status !== statusFilter) match = false;
                if (addressFilter && (!o.shipping_address || !o.shipping_address.toLowerCase().includes(addressFilter))) match = false;
                if (startFilter && o.order_date < startFilter + ' 00:00:00') match = false;
                if (endFilter && o.order_date > endFilter + ' 23:59:59') match = false;
                return match;
            });

            if (sortFilter === 'ward_asc') {
                orders.sort((a, b) => (a.shipping_address || '').localeCompare(b.shipping_address || ''));
            }

            tableBody.innerHTML = orders.map(o => {
                const statusBadge = getStatusClassForOrder(o.status);
                const isPaid = o.payment_status === 'Đã thanh toán';
                const paidBadge = isPaid ? 'badge-active' : 'badge-pending';
                const isManualPay = o.payment_method !== 'cod';

                return `
                    <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                        <td style="padding:16px; font-weight:800; color:#1e40af;">#DH${o.id}</td>
                        <td style="padding:16px;">
                            <div style="font-weight:700; color:#0f172a;">${o.receiver_name}</div>
                            <div style="font-size: 11px; color: #64748b; margin-top:2px;"><i class="bi bi-telephone"></i> ${o.receiver_phone}</div>
                        </td>
                        <td style="padding:16px; font-size:12px; color:#475569; max-width:200px; line-height:1.4;">
                            <i class="bi bi-geo-alt"></i> ${o.shipping_address}
                        </td>
                        <td style="padding:16px; font-size:12px; color:#475569;">
                            <i class="bi bi-calendar3"></i> ${o.order_date}
                        </td>
                        <td style="padding:16px; font-weight:800; color:#0f172a; font-size:15px;">${formatVND(o.total_amount || o.total_price || 0)}</td>
                        <td style="padding:16px; text-align:center;">
                            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                                <span class="adv-badge ${statusBadge}" style="width:110px;">${o.status}</span>
                                <span class="adv-badge ${isPaid ? 'badge-active' : (o.payment_method?.toLowerCase() === 'cod' ? 'badge-shipping' : 'badge-pending')}" 
                                      style="width:110px; font-size:9px; opacity:0.9;">
                                    ${isPaid ? '<i class="bi bi-check-circle"></i> ' : (o.payment_method?.toLowerCase() === 'cod' ? '<i class="bi bi-cash-coin"></i> ' : '<i class="bi bi-clock"></i> ')}
                                    ${isPaid ? 'Đã thanh toán' : (o.payment_method?.toLowerCase() === 'cod' ? 'COD (Lúc nhận)' : 'Chờ xác nhận t.t')}
                                </span>
                            </div>
                        </td>
                        <td style="padding:16px; text-align:right;">
                            <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                                <button class="adv-btn" style="padding:6px 12px; font-size:11px; min-width:90px; background:#4f46e5; color:white; border:none; border-radius:8px; box-shadow:0 4px 6px -1px rgba(79, 70, 229, 0.2);" onclick="viewOrder(${o.id})">
                                    <i class="bi bi-pencil-square"></i> Cập nhật
                                </button>
                                ${(!isPaid && o.payment_method?.toLowerCase() !== 'cod') ? `
                                <button class="adv-btn" style="padding:6px 12px; font-size:10px; min-width:90px; background:#10b981; color:white; border:none; border-radius:8px; box-shadow:0 4px 6px -1px rgba(16, 185, 129, 0.2);" onclick="confirmPayment(${o.id})">
                                    <i class="bi bi-cash-stack"></i> XN T.Toán
                                </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            if (orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">Không tìm thấy đơn hàng nào.</td></tr>';
            }
        }
    } catch (e) {
        console.error('Lỗi khi tải đơn hàng:', e);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:red;">Lỗi kết nối máy chủ.</td></tr>';
    }
}

function getStatusClassForOrder(status) {
    switch (status) {
        case 'Chưa xử lý': return 'badge-pending';
        case 'Đã xác nhận': return 'badge-active';
        case 'Đang giao': return 'badge-active';
        case 'Đã giao thành công': return 'badge-success';
        case 'Đã hủy': return 'badge-inactive';
        default: return 'badge-pending';
    }
}

async function confirmPayment(orderId) {
    if (!confirm('Xác nhận khách hàng đã hoàn thành thanh toán cho đơn hàng này?')) return;
    try {
        const res = await fetch('../api/admin/confirm_payment.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: orderId })
        }).then(r => r.json());
        if (res.success) {
            alert('Đã xác nhận thanh toán.');
            loadOrders();
        } else { alert('Lỗi: ' + res.message); }
    } catch (e) { alert('Lỗi kết nối.'); }
}

async function viewOrder(id) {
    try {
        const res = await fetch(`../api/admin/get_order_details.php?id=${id}`).then(r => r.json());
        if (res.success) {
            const o = res.order;
            document.getElementById('orderDetailCode').textContent = `#DH${o.id}`;

            let itemsHtml = (res.items || []).map(i => `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding:8px 0;">
                    <span>${i.product_name} <strong>x${i.qty}</strong></span>
                    <span style="font-weight:600;">${formatVND(i.price)}</span>
                </div>
            `).join('');

            document.getElementById('orderDetailContent').innerHTML = `
                <div style="margin-bottom:15px;">
                    <strong>Khách hàng:</strong> ${o.receiver_name} <br/>
                    <strong>SĐT:</strong> [${o.receiver_phone}] <br/>
                    <strong>Địa chỉ giao:</strong> ${o.shipping_address} <br/>
                    <strong>Thời gian đặt:</strong> ${o.order_date} <br/>
                    <div style="margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 8px;">
                        <span style="display: block; font-size: 13px;">Thanh toán: <strong>${o.payment_method}</strong></span>
                        <span style="font-size: 13px;">Trạng thái: <strong style="color: ${o.payment_status === 'Đã thanh toán' ? '#22c55e' : '#f59e0b'}">${o.payment_status || 'Chờ xác nhận'}</strong></span>
                    </div>
                    <strong style="color:#ef4444; font-size:16px;">TỔNG THANH TOÁN: ${formatVND(o.total_amount || o.total_price || 0)}</strong>
                </div>
                <div style="background:white; padding:10px; border-radius:6px; border:1px solid #cbd5e1;">
                    <strong style="display:block; margin-bottom:8px;">Chi tiết sản phẩm:</strong>
                    ${itemsHtml}
                </div>
            `;

            // State machine strict binding
            const statusSelect = document.getElementById('orderStatusUpdate');
            const btnUpdate = document.getElementById('btnUpdateOrderStatus');
            statusSelect.disabled = false;
            btnUpdate.style.display = 'block';

            Array.from(statusSelect.options).forEach(opt => {
                opt.disabled = false;
                opt.style.display = 'block';
            });

            // Enforce progression rule (1-way street)
            if (o.status === 'Đã xác nhận') {
                statusSelect.querySelector('option[value="Chưa xử lý"]').disabled = true;
            } else if (o.status === 'Đang giao') {
                statusSelect.querySelector('option[value="Chưa xử lý"]').disabled = true;
                statusSelect.querySelector('option[value="Đã xác nhận"]').disabled = true;
            } else if (o.status === 'Đã giao thành công' || o.status === 'Đã hủy') {
                statusSelect.disabled = true; // Lock dropdown completely
                btnUpdate.style.display = 'none'; // Lock button completely
            }

            // Sync current status if possible, otherwise leave it
            const matchedOpt = Array.from(statusSelect.options).find(opt => opt.value === o.status);
            if (matchedOpt) statusSelect.value = o.status;

            // Đảm bảo hiện lại các phần điều khiển trạng thái (nếu bị viewDashboardOrderDetail ẩn đi)
            document.getElementById('orderStatusUpdate').parentElement.style.display = 'block';
            btnUpdate.style.display = 'block';

            // Update Handler Binding (Override previous handlers properly)
            btnUpdate.onclick = async function () {
                const newStatus = statusSelect.value;
                if (!confirm(`Xác nhận chuyển Đơn hàng #DH${o.id} sang trạng thái: ${newStatus}?`)) return;

                try {
                    const updateRes = await fetch('../api/admin/update_order_status.php', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: o.id, status: newStatus })
                    }).then(r => r.json());

                    if (updateRes.success) {
                        alert(updateRes.message);
                        closeModal('orderModal');
                        loadOrders();
                    } else alert(updateRes.message);
                } catch (e) { console.error(e); }
            };

            document.getElementById('orderModal').style.display = 'flex';
        } else {
            alert(res.message);
        }
    } catch (e) { console.error(e); }
}

// === 5. BÁO CÁO NHẬP - XUẤT - TỒN ===
async function loadInventoryReport() {
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) return;

    const start = document.getElementById('reportStart')?.value || '';
    const end = document.getElementById('reportEnd')?.value || '';
    const thresh = document.getElementById('reportThreshold')?.value || 20;

    const periodLabel = document.getElementById('reportHeaderPeriod');
    if (periodLabel && start && end) periodLabel.textContent = `Kỳ báo cáo: Từ ${start} đến ${end}`;

    try {
        const catFilter = document.getElementById('reportCategory')?.value || '';
        const pointDate = document.getElementById('reportPointDate')?.value || '';
        const res = await fetch(`../api/admin/get_inventory_report.php?start=${start}&end=${end}&threshold=${thresh}&category=${catFilter}&point_date=${pointDate}`).then(r => r.json());
        if (!res.success) throw new Error(res.message);

        let data = res.report || [];

        // Logic sắp xếp: Hết hàng lên đầu, sau đó đến sắp hết hàng
        data.sort((a, b) => {
            if (a.is_out && !b.is_out) return -1;
            if (!a.is_out && b.is_out) return 1;
            if (a.is_low && !b.is_low) return -1;
            if (!a.is_low && b.is_low) return 1;
            return b.ending - a.ending; // Còn lại giảm dần theo số lượng tồn
        });

        // Cập nhật Stat Cards
        const lowCount = data.filter(p => p.is_low).length;
        const outCount = data.filter(p => p.is_out).length;

        document.getElementById('totalReportItems').textContent = data.length;
        document.getElementById('outOfStockCount').textContent = outCount;
        document.getElementById('lowStockCount').textContent = lowCount;

        // Xử lý Thông báo khẩn cấp (Urgent Notification)
        const urgentDiv = document.getElementById('urgentInventoryNotification');
        if (urgentDiv) {
            if (outCount > 0) {
                const outNames = data.filter(p => p.is_out).map(p => `<span style="font-weight:700;">${p.name}</span>`).join(', ');
                urgentDiv.style.display = 'block';
                urgentDiv.innerHTML = `
                    <div style="background: #fff1f2; border: 1px solid #fda4af; border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 20px; animation: slideDown 0.4s ease-out;">
                        <div style="width: 48px; height: 48px; background: #ef4444; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);">
                            <i class="bi bi- megaphone-fill"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="color: #991b1b; font-weight: 800; font-size: 16px; margin-bottom: 4px;">CẢNH BÁO: CÓ ${outCount} SẢN PHẨM ĐÃ HẾT HÀNG!</div>
                            <div style="color: #b91c1c; font-size: 13px;">Các sản phẩm sau cần được nhập hàng ngay lập tức để không gián đoạn kinh doanh: ${outNames}</div>
                        </div>
                        <button class="adv-btn" style="background: #991b1b; white-space: nowrap;" onclick="document.querySelector('[data-section=\\'imports\\']').click()">Lập phiếu nhập ngay</button>
                    </div>
                    <style>
                        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                    </style>
                `;
            } else {
                urgentDiv.style.display = 'none';
            }
        }

        // Render Table với Style Premium
        tableBody.innerHTML = data.map(p => {
            const startQty = p.starting !== undefined ? p.starting : 0;
            const inQty = p.imported !== undefined ? p.imported : 0;
            const outQty = p.exported !== undefined ? p.exported : 0;
            const endQty = p.ending !== undefined ? p.ending : 0;

            return `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                    <td style="padding:16px 24px; font-weight:700; color:#475569; font-size:13px;">${p.code || 'N/A'}</td>
                    <td style="padding:16px 24px;">
                        <div style="font-weight:600; color:#1e293b; font-size:14px;">${p.name || 'Sản phẩm không tên'}</div>
                        <div style="font-size:11px; color:#94a3b8; margin-top:2px;">${p.category || 'Chưa phân loại'}</div>
                    </td>
                    <td style="text-align:center; padding:16px 24px; color:#64748b; font-weight:500;">${startQty}</td>
                    <td style="text-align:center; padding:16px 24px; color:#10b981; font-weight:700;">+${inQty}</td>
                    <td style="text-align:center; padding:16px 24px; color:#f43f5e; font-weight:700;">-${outQty}</td>
                    <td style="text-align:center; padding:16px 24px;">
                        <span class="adv-badge ${p.is_out ? 'badge-inactive' : (p.is_low ? 'badge-pending' : 'badge-active')}" 
                              style="min-width:70px; font-size:13px; padding:6px 14px;">
                            ${endQty}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (e) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#ef4444; font-weight:600;">❌ Lỗi dữ liệu: ${e.message}</td></tr>`;
    }
}

function resetInventoryFilters() {
    updateFilters();
    loadInventoryReport();
}

// === MODAL HELPERS ===
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
}

function openUserModal() {
    document.getElementById('userForm').reset();
    document.getElementById('userIdForEdit').value = '';
    document.getElementById('userModalTitle').textContent = 'Thêm Tài Khoản Mới';

    // Hiện đầy đủ các trường khi thêm mới
    document.getElementById('userUsernameGroup').style.display = 'block';
    document.getElementById('userPasswordGroup').style.display = 'block';
    document.getElementById('userFullnameGroup').style.display = 'block';

    document.getElementById('userUsername').required = true;
    document.getElementById('userPassword').required = true;
    document.getElementById('userFullname').required = true;

    document.getElementById('userModal').style.display = 'flex';
}

function editUser(id) {
    const u = window.adminUsers.find(x => x.id == id);
    if (!u) return;

    document.getElementById('userIdForEdit').value = u.id;
    document.getElementById('userUsername').value = u.username;
    document.getElementById('userFullname').value = u.fullname;
    document.getElementById('userEmail').value = u.email;
    document.getElementById('userPhone').value = u.phone;
    document.getElementById('userRole').value = u.role;

    // Ẩn Username, Password và Fullname khi chỉnh sửa theo yêu cầu
    document.getElementById('userUsernameGroup').style.display = 'none';
    document.getElementById('userPasswordGroup').style.display = 'none';
    document.getElementById('userFullnameGroup').style.display = 'none';

    document.getElementById('userUsername').required = false;
    document.getElementById('userPassword').required = false;
    document.getElementById('userFullname').required = false;

    document.getElementById('userModalTitle').textContent = 'Chỉnh sửa: ' + u.username;
    document.getElementById('userModal').style.display = 'flex';
}

async function deleteUser(id) {
    if (!confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN người dùng này không? Hành động này không thể hoàn tác.')) return;
    try {
        const res = await fetch('../api/admin/delete_user.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        }).then(r => r.json());
        alert(res.message);
        if (res.success) initAdminData();
    } catch (e) { alert('Lỗi kết nối.'); }
}

function openProductModal(id = null) {
    document.getElementById('productForm').reset();
    const categories = window.adminCategories || [];
    const typeSelect = document.getElementById('productType');
    if (typeSelect) {
        typeSelect.innerHTML = categories.map(c => `<option value="${c.type}">${c.name}</option>`).join('');
    }

    const p = id ? window.adminProducts.find(x => x.id == id) : null;
    if (p) {
        document.getElementById('productId').value = p.id;
        document.getElementById('productName').value = p.name;
        document.getElementById('productCode').value = p.code;
        document.getElementById('productPrice').value = p.price;
        document.getElementById('productImage').value = p.image;
        document.getElementById('productType').value = p.type;
        document.getElementById('productBrand').value = p.brand || '';
        document.getElementById('productShortDesc').value = p.short_desc || '';
        document.getElementById('productCost').value = p.cost || 0;
        // Tự tính % lợi nhuận hiển thị (Giá bán - Giá vốn / Giá vốn * 100)
        let calcMargin = 20;
        if (p.cost > 0) {
            calcMargin = Math.round(((p.price - p.cost) / p.cost) * 100);
        }
        document.getElementById('productProfit').value = calcMargin;
        document.getElementById('productStock').value = p.stock || 0;
        document.getElementById('productStatus').value = p.status || 'Đang bán';
    } else {
        document.getElementById('productId').value = '';
        document.getElementById('productProfit').value = 20;
    }
    document.getElementById('productModal').style.display = 'flex';

    // Tự động tính giá khởi động để ô không bị trống
    const ci = document.getElementById('productCost');
    const pi = document.getElementById('productProfit');
    const pri = document.getElementById('productPrice');
    if (ci && pi && pri) {
        let cost = parseInt(ci.value) || 0;
        let profit = parseInt(pi.value) || 0;
        pri.value = cost + Math.round((cost * profit) / 100);
    }
}

// === IMAGE PICKER ===
async function openImagePicker() {
    const grid = document.getElementById('imageGalleryGrid');
    document.getElementById('imagePickerModal').style.display = 'flex';
    try {
        const res = await fetch('../api/admin/list_images.php').then(r => r.json());
        if (res.success) {
            grid.innerHTML = res.images.map(img => `
                <div onclick="selectImage('${img}')" style="cursor:pointer; border:1px solid #ddd; padding:5px; transition:0.3s;" class="gallery-item">
                    <img src="../${img}" style="width:100px; height:80px; object-fit:cover;">
                </div>`).join('');
        }
    } catch (e) { console.error(e); }
}

function selectImage(path) {
    document.getElementById('productImage').value = path;
    closeModal('imagePickerModal');
}

// === KHỞI TẠO ===
document.addEventListener('DOMContentLoaded', () => {
    // Tự động tính giá Modal
    const costInp = document.getElementById('productCost');
    const profitInp = document.getElementById('productProfit');
    const priceInp = document.getElementById('productPrice');

    const calcPrice = () => {
        let cost = parseInt(costInp.value) || 0;
        let profit = parseInt(profitInp.value) || 0;
        priceInp.value = cost + Math.round((cost * profit) / 100);
    };

    costInp?.addEventListener('input', calcPrice);
    profitInp?.addEventListener('input', calcPrice);

    // Form Sản Phẩm
    document.getElementById('productForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Tìm nhanh ID danh mục từ type đang chọn
        const typeSelect = document.getElementById('productType');
        const categories = window.adminCategories || [];
        const activeCat = categories.find(c => c.type === typeSelect.value) || { id: 0 };

        const payload = {
            id: document.getElementById('productId').value,
            name: document.getElementById('productName').value,
            code: document.getElementById('productCode').value,
            price: document.getElementById('productPrice').value,
            image: document.getElementById('productImage').value,
            category_id: activeCat.id,
            type: typeSelect.value,
            brand: document.getElementById('productBrand').value,
            cost: document.getElementById('productCost').value,
            profit: document.getElementById('productProfit').value,
            stock: document.getElementById('productStock').value,
            status: document.getElementById('productStatus').value,
            short_desc: document.getElementById('productShortDesc').value
        };
        try {
            const res = await fetch('../api/admin/save_product.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json());
            if (res.success) {
                alert('Đã lưu thành công.');
                closeModal('productModal');
                initAdminData();
            } else {
                alert('Lỗi: ' + res.message);
            }
        } catch (e) { console.error(e); }
    });

    // Form Loại Sản Phẩm (Inline)
    document.getElementById('inlineCategoryForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const payload = {
            id: document.getElementById('inlineCategoryId').value,
            name: document.getElementById('inlineCategoryName').value,
            type: document.getElementById('inlineCategoryType').value,
            code: document.getElementById('inlineCategoryCode').value,
            status: document.getElementById('inlineCategoryStatus').value
        };
        try {
            const res = await fetch('../api/admin/save_category.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json());
            if (res.success) {
                alert('Đã lưu loại sản phẩm thành công.');
                resetInlineCategoryForm();
                initAdminData();
            } else { alert('Lỗi: ' + res.message); }
        } catch (e) { console.error(e); }
    });
    // Form Đổi MK Admin
    document.getElementById('changePasswordForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const newPass = document.getElementById('newPass').value;
        const confirmPass = document.getElementById('confirmPass').value;
        if (newPass !== confirmPass) { alert('Xác nhận không khớp!'); return; }
        try {
            const res = await fetch('../api/admin/change_admin_password.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_password: newPass })
            }).then(r => r.json());
            alert(res.message);
            if (res.success) e.target.reset();
        } catch (e) { alert('Lỗi kết nối.'); }
    });

    // Form Tài Khoản
    document.getElementById('userForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const payload = {
            id: document.getElementById('userIdForEdit').value,
            username: document.getElementById('userUsername').value,
            password: document.getElementById('userPassword').value,
            fullname: document.getElementById('userFullname').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            role: document.getElementById('userRole').value
        };
        try {
            const res = await fetch('../api/admin/save_user.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json());
            alert(res.message || (res.success ? 'Đã lưu thành công.' : 'Lỗi không xác định'));
            if (res.success) { closeModal('userModal'); initAdminData(); }
        } catch (e) { alert('Lỗi kết nối.'); }
    });

    // Form Nhập Hàng
    document.getElementById('importForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        // Sẽ được gọi thông qua onclick của các nút bấm riêng lẻ để truyền Status
    });

    initAdminData();
});

async function submitImport(status = 'Hoàn thành') {
    if (window.currentImportItems.length === 0) { alert('Vui lòng chọn sản phẩm cần nhập!'); return; }

    const payload = {
        import_date: document.getElementById('importDate').value || new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: status,
        total_cost: window.currentImportItems.reduce((acc, item) => acc + (item.qty * item.cost), 0),
        items: window.currentImportItems
    };

    try {
        const res = await fetch('../api/admin/save_import.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(r => r.json());

        if (res.success) {
            alert(res.message);
            closeModal('importModal');
            initAdminData();
        } else {
            alert('Lỗi: ' + res.message);
        }
    } catch (e) { alert('Lỗi kết nối máy chủ.'); }
}
