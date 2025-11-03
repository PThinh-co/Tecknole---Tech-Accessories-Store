// File: assets/js/checkout-logic.js

// Lấy data từ modal.js
const user = getCurrentUser(); 
if (user) {
    var users = JSON.parse(localStorage.getItem('bs_users')) || [];
    var currentUserData = users.find(u => u.username === user.username) || user;
} else {
    var currentUserData = {};
}
const cart = getCart();

// Kiểm tra giỏ hàng
if (cart.length === 0 && document.getElementById('checkout-form')) {
    alert('Giỏ hàng trống!');
    window.location.href = 'cart.html';
}

// Hàm hiển thị đơn hàng (Order Summary)
function displayOrder() {
    const orderItems = document.getElementById('order-items');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 30000;
    const total = subtotal + shipping;

    orderItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-details">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Số lượng: ${item.quantity}</div>
                </div>
            </div>
            <div class="item-price">${formatVND(item.price * item.quantity)}</div>
        </div>
    `).join('');

    document.getElementById('subtotal').textContent = formatVND(subtotal);
    document.getElementById('total').textContent = formatVND(total);
}

// Hàm Load thông tin người dùng vào form
function loadUserInfo() {
    document.getElementById('receiver-name').value = currentUserData.fullName || '';
    document.getElementById('receiver-phone').value = currentUserData.phone || '';
    document.getElementById('receiver-email').value = currentUserData.email || '';
}

// Hàm Load địa chỉ
function loadAddressOptions() {
    const addressOptions = document.getElementById('address-options');
    let html = '';

    if (currentUserData.address) {
        html += `
            <label class="address-option selected">
                <input type="radio" name="address" value="saved" checked>
                <div>
                    <strong>📍 Địa chỉ đã lưu</strong>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        ${currentUserData.address}
                    </div>
                </div>
            </label>
        `;
    }

    html += `
        <label class="address-option ${!currentUserData.address ? 'selected' : ''}">
            <input type="radio" name="address" value="new" ${!currentUserData.address ? 'checked' : ''}>
            <strong>📝 Nhập địa chỉ mới</strong>
        </label>
    `;

    addressOptions.innerHTML = html;

    // Handle address selection
    document.querySelectorAll('input[name="address"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.address-option').forEach(opt => opt.classList.remove('selected'));
            this.closest('.address-option').classList.add('selected');
            
            const newAddressFields = document.getElementById('new-address-fields');
            if (this.value === 'new') {
                newAddressFields.style.display = 'block';
                newAddressFields.querySelectorAll('input, select, textarea').forEach(field => {
                    field.required = true;
                });
            } else {
                newAddressFields.style.display = 'none';
                newAddressFields.querySelectorAll('input, select, textarea').forEach(field => {
                    field.required = false;
                });
            }
        });
    });

    // Trigger initial state
    const newAddressFields = document.getElementById('new-address-fields');
    if (currentUserData.address && document.querySelector('input[name="address"][value="saved"]:checked')) {
        newAddressFields.style.display = 'none';
        newAddressFields.querySelectorAll('input, select, textarea').forEach(field => {
            field.required = false;
        });
    } else {
        newAddressFields.style.display = 'block';
        newAddressFields.querySelectorAll('input, select, textarea').forEach(field => {
            field.required = true;
        });
    }
}

// Hàm khởi tạo sự kiện
function initializeCheckoutEvents() {
    // Handle payment method selection
    document.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[name="payment"]').checked = true;
        });
    });

    // Submit form
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const receiverName = document.getElementById('receiver-name').value.trim();
        const receiverPhone = document.getElementById('receiver-phone').value.trim();
        const receiverEmail = document.getElementById('receiver-email').value.trim();
        const addressType = document.querySelector('input[name="address"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const orderNote = document.getElementById('order-note').value.trim();

        let shippingAddress = '';
        if (addressType === 'saved') {
            shippingAddress = currentUserData.address;
        } else {
            const province = document.getElementById('province').value;
            const district = document.getElementById('district').value.trim();
            const ward = document.getElementById('ward').value.trim();
            const street = document.getElementById('street').value.trim();
            shippingAddress = `${street}, ${ward}, ${district}, ${province}`;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 30000;
        const total = subtotal + shipping;

        const order = {
            items: cart,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            receiverEmail: receiverEmail,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            orderNote: orderNote,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        // Lưu đơn hàng
        const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
        orders.push(order);
        localStorage.setItem(`orders_${user.username}`, JSON.stringify(orders));

        // Xóa giỏ hàng
        clearCart();

        // Hiển thị thông báo thành công
        alert(`
  ✅ Đặt hàng thành công!

Mã đơn hàng: #${orders.length}
Tổng tiền: ${formatVND(total)}
Phương thức thanh toán: ${paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}

Cảm ơn bạn đã mua hàng tại Tecknole!
        `);

        // Chuyển đến trang đơn hàng (Đã sửa lỗi typo user-cart.html)
        window.location.href = 'user_cart.html';
    });
}

// Khối chạy chính khi DOM load (ĐÃ SỬA VỊ TRÍ GỌI HÀM)
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkout-form')) {
        if (requireLogin()) { // Yêu cầu đăng nhập
            displayOrder();
            loadUserInfo();
            loadAddressOptions();
            initializeCheckoutEvents(); // Gắn các event listeners
        }
    }
});