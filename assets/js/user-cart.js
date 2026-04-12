// File: assets/js/user-cart.js

// --- BỌC TẤT CẢ LOGIC TRONG SỰ KIỆN NÀY ---
// --- KHỞI TẠO ĐỘC LẬP ĐỂ ĐẢM BẢO TIN CẬY ---
async function initUserCart() {
    try {
        const response = await fetch('api/get_user.php');
        const data = await response.json();
        
        if (data.success) {
            window.currentUserData = data.user;
            // renderProfileInfo(data.user);
            renderOrders(); 
        } else {
            console.warn('User not logged in, showing login modal...');
            if (typeof requireLogin === 'function') {
                requireLogin(); 
            }
            const infoContainer = document.getElementById('user-profile-info');
            if (infoContainer) infoContainer.innerHTML = '<p style="color:#e74c3c; padding:20px; font-weight:600;">⚠️ Vui lòng đăng nhập để xem lịch sử mua hàng.</p>';
        }
    } catch (error) {
        console.error('Lỗi khởi tạo profile:', error);
    }
}

// Chạy ngay khi DOM sẵn sàng
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initUserCart);
} else {
    initUserCart();
}


// --- CÁC HÀM ĐỊNH NGHĨA ---



// 2. Hiển thị đơn hàng đã mua (Lấy từ Database qua API)
async function renderOrders() {
    const orderList = document.getElementById('order-list');
    const noOrders = document.getElementById('no-orders');
    if (!orderList || !noOrders) return; 
    
    try {
        const response = await fetch('api/get_orders.php');
        const data = await response.json();

        if (!data.success || data.orders.length === 0) {
            orderList.style.display = 'none';
            noOrders.style.display = 'block';
            return;
        }

        noOrders.style.display = 'none';
        orderList.style.display = 'flex';

        let ordersHTML = '';
        data.orders.forEach((order) => { 
            const date = new Date(order.order_date).toLocaleDateString('vi-VN');

            const isPaid = order.payment_status === 'Đã thanh toán';

            switch (order.status) {
                case 'Đã giao thành công':
                case 'completed':
                    statusText = 'Hoàn thành';
                    statusClass = 'completed';
                    break;
                case 'Đang giao':
                case 'shipped':
                    statusText = 'Đang giao';
                    statusClass = 'shipped';
                    break;
                case 'Đã hủy':
                case 'cancelled':
                    statusText = 'Đã hủy';
                    statusClass = 'cancelled';
                    break;
                case 'Đã xác nhận':
                case 'processed':
                    statusText = 'Đã xác nhận';
                    statusClass = 'shipped';
                    break;
                default:
                    if (isPaid) {
                        statusText = 'Đã thanh toán, chờ xác nhận giao hàng';
                        statusClass = 'shipped'; // Use blue/green color
                    } else {
                        statusText = 'Chờ xác nhận đơn';
                        statusClass = 'pending';
                    }
            }

            const showPaymentWait = order.payment_method !== 'cod' && !isPaid;

            ordersHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <span>Mã đơn hàng: <strong>#${order.id}</strong></span>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:5px;">
                            <span class="order-status ${statusClass}">${statusText}</span>
                            ${showPaymentWait ? `<span class="order-status pending" style="background:#f39c12; border-color:#d35400;">Đang đợi xác nhận thanh toán</span>` : ''}
                        </div>
                    </div>
                    <p>Ngày đặt: ${date}</p>
                    <p>Địa chỉ nhận: ${order.shipping_address || 'Theo tài khoản'}</p>
                    <p>Thanh toán: ${getPaymentMethodLabel(order.payment_method)}</p>
                    
                    <h4 style="margin-top:10px; font-weight:600;">Sản phẩm:</h4>
                    <div style="margin-left: 10px; color: #555;">${order.items_summary}</div>

                    <div class="order-summary-footer">
                        Tổng tiền: ${formatVND(parseFloat(order.total_amount))}
                    </div>
                </div>
            `;
        });

        orderList.innerHTML = ordersHTML;
    } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
    }
}

function getPaymentMethodLabel(method) {
    switch (method) {
        case 'cod': return 'Tiền mặt (COD)';
        case 'transfer': return 'Chuyển khoản Ngân hàng';
        case 'wallet': return 'Ví điện tử';
        case 'qr': return 'Quét mã QR';
        default: return method || 'Chưa chọn';
    }
}

