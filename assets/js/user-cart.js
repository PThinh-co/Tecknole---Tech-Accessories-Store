// File: assets/js/user-cart.js

// --- BỌC TẤT CẢ LOGIC TRONG SỰ KIỆN NÀY ---
window.addEventListener('DOMContentLoaded', function() {

    // 1. Kiểm tra đăng nhập TRƯỚC HẾT
    if (!requireLogin()) {
        return; 
    }

    // 2. Lấy dữ liệu user (sau khi đã xác nhận đăng nhập)
    const user = getCurrentUser(); 
    var users = JSON.parse(localStorage.getItem('bs_users')) || []; 
    var currentUserData = users.find(u => u.username === user.username) || user; 

    // 3. Gọi các hàm render
    renderProfileInfo(currentUserData);
    renderOrders(user);
});

// --- CÁC HÀM ĐỊNH NGHĨA ---

// 1. Hiển thị thông tin cá nhân
function renderProfileInfo(currentUserData) {
    const infoContainer = document.getElementById('user-profile-info');
    if (!infoContainer) return; 
    
    infoContainer.innerHTML = `
        <div class="info-row">
            <span class="info-label">👤 Họ và tên:</span>
            <span class="info-value">${currentUserData.fullName || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">🔐 Tài khoản:</span>
            <span class="info-value">${currentUserData.username || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">📧 Email:</span>
            <span class="info-value">${currentUserData.email || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">📱 Số điện thoại:</span>
            <span class="info-value">${currentUserData.phone || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">📍 Địa chỉ đã lưu:</span>
            <span class="info-value">${currentUserData.address || 'Chưa cập nhật'}</span>
        </div>
    `;
}

// 2. Hiển thị đơn hàng đã mua (ĐÃ BỔ SUNG TRẠNG THÁI CANCELLED)
function renderOrders(user) {
    const orderList = document.getElementById('order-list');
    const noOrders = document.getElementById('no-orders');
    if (!orderList || !noOrders) return; 
    
    const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');

    if (orders.length === 0) {
        orderList.style.display = 'none';
        noOrders.style.display = 'block';
        return;
    }

    noOrders.style.display = 'none';
    orderList.style.display = 'flex';

    let ordersHTML = '';
    orders.reverse().forEach((order, index) => { 
        const orderId = orders.length - index; 
        const date = new Date(order.orderDate).toLocaleDateString('vi-VN');

        let statusText;
        let statusClass;
        switch (order.status) {
            case 'completed':
                statusText = 'Hoàn thành';
                statusClass = 'completed';
                break;
            case 'shipped':
                statusText = 'Đang giao';
                statusClass = 'shipped';
                break;
            case 'cancelled': // Xử lý trạng thái Hủy từ Admin
                statusText = 'Đã hủy';
                statusClass = 'cancelled';
                break;
            case 'pending':
            default:
                statusText = 'Chờ xác nhận';
                statusClass = 'pending';
        }

        let itemsHTML = order.items.map(item => `
            <div class="order-item-detail">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <div>${item.name} (x${item.quantity})</div>
                    <small>${formatVND(item.price)}</small>
                </div>
            </div>
        `).join('');

        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <span>Mã đơn hàng: <strong>#${orderId}</strong></span>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                <p>Ngày đặt: ${date}</p>
                <p>Địa chỉ nhận: ${order.shippingAddress}</p>
                <p>Thanh toán: ${order.paymentMethod === 'cash' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}</p>
                
                <h4 style="margin-top:10px; font-weight:600;">Sản phẩm:</h4>
                <div style="margin-left: 10px;">${itemsHTML}</div>

                <div class="order-summary-footer">
                    Tổng tiền: ${formatVND(order.total)}
                </div>
            </div>
        `;
    });

    orderList.innerHTML = ordersHTML;
}