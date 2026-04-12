// File: assets/js/checkout-logic.js
// formatVND được dùng từ modal.js (đã load trước)


// Khởi tạo thông tin người dùng và giỏ hàng từ API
async function initCheckoutData() {
    try {
        // Lấy thông tin người dùng từ API 
        const userRes = await fetch('api/get_user.php');
        const userData = await userRes.json();

        if (userData.success) {
            window.currentUserData = userData.user;
            await loadUserInfo();
        } else {
            await loadProvincesForCheckout();
        }

        const cartRes = await fetch('api/update_cart.php', { method: 'POST', body: new FormData() });
        const cartData = await cartRes.json();

        if (cartData.success && cartData.cart_count > 0) {
            window.sessionCart = cartData.items || [];
            renderOrderSummary(window.sessionCart);
        } else {
            if (cartData.id_mismatch) {
                alert('🔄 Dữ liệu sản phẩm đã được cập nhật mới. Vui lòng chọn lại sản phẩm vào giỏ hàng.');
            } else {
                alert('🛒 Giỏ hàng của bạn đang trống!');
            }
            window.location.href = 'products.php';
        }
    } catch (error) {
        console.error('Lỗi khởi tạo checkout:', error);
        alert('Có lỗi xảy ra khi tải đơn hàng. Vui lòng quay lại giỏ và thử lại.');
    }
}

// Hàm hiển thị đơn hàng (Order Summary)
function renderOrderSummary(cartItems) {
    const orderItems = document.getElementById('order-items');
    const totalEl = document.getElementById('total-amount');
    
    if (!orderItems || !totalEl) return;

    let subtotal = 0;
    orderItems.innerHTML = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="summary-item">
                <div class="item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-info">
                        <div class="item-name" style="font-size: 15px; font-weight: 600; color: #2d3436; margin-bottom: 2px;">${item.name}</div>
                        <div class="item-quantity" style="font-size: 13px; color: #636e72;">Số lượng: ${item.quantity}</div>
                    </div>
                    <div class="item-price" style="font-size: 16px; font-weight: 700; color: #3867d6;">${formatVND(itemTotal)}</div>
                </div>
            </div>
        `;
    }).join('');

    let shipping = 0;
    const total = subtotal + shipping;
    totalEl.textContent = formatVND(total);
}

// Hàm hiển thị Hóa đơn (Invoice Pop-up) sau khi đặt hàng thành công
function showInvoicePopup(orderId, orderData, cartItems) {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Tạo cấu trúc Modal Hóa đơn động
    const invoiceHTML = `
        <div id="invoiceModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: slideUp 0.4s ease;">
                <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
                    <i class="bi bi-check-circle" style="font-size: 40px;"></i>
                    <h2 style="margin: 10px 0 5px 0; color: white;">ĐẶT HÀNG THÀNH CÔNG!</h2>
                    <p style="margin: 0; opacity: 0.9;">Mã đơn hàng: #${orderId}</p>
                </div>
                
                <div style="padding: 25px; max-height: 70vh; overflow-y: auto;">
                    <div style="margin-bottom: 20px; border-bottom: 1px dashed #eee; padding-bottom: 15px;">
                        <p style="margin: 5px 0;"><strong>👤 Người nhận:</strong> ${orderData.receiver_name}</p>
                        <p style="margin: 5px 0;"><strong>📞 SĐT:</strong> ${orderData.receiver_phone}</p>
                        <p style="margin: 5px 0;"><strong>📍 Địa chỉ:</strong> ${orderData.shipping_address}</p>
                    </div>

                    <h4 style="margin: 0 0 10px 0;">Sản phẩm đã đặt:</h4>
                    <div style="margin-bottom: 20px;">
                        ${cartItems.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                <span style="flex: 1; margin-right: 10px;">${item.name} <span style="color: #888;">x${item.quantity}</span></span>
                                <span style="font-weight: 600;">${formatVND(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; font-size: 16px;">TỔNG THANH TOÁN:</span>
                        <span style="font-weight: 800; font-size: 20px; color: #667eea;">${formatVND(totalAmount)}</span>
                    </div>
                    
                    <p style="text-align: center; color: #27ae60; font-weight: 600; margin-top: 15px; font-size: 14px;">
                        <i class="bi bi-truck"></i> Đơn hàng đang được chuẩn bị giao!
                    </p>
                </div>

                <div style="padding: 0 25px 25px 25px;">
                    <button onclick="window.location.href='user_cart.php'" style="width: 100%; padding: 14px; background: #667eea; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                        XEM LỊCH SỬ ĐƠN HÀNG
                    </button>
                </div>
            </div>
        </div>
        <style>
            @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', invoiceHTML);
}

// Hàm Load thông tin người dùng vào form
async function loadUserInfo() {
    if (!window.currentUserData) return;
    
    const addressRadio = document.querySelector('input[name="address_source"]:checked');
    if (!addressRadio) return; 

    const addressSource = addressRadio.value;
    const isProfile = addressSource === 'profile';

    if (isProfile) {
        // Điền thông tin mặc định từ hồ sơ
        document.getElementById('receiver-name').value = window.currentUserData.fullName || window.currentUserData.fullname || '';
        document.getElementById('receiver-phone').value = window.currentUserData.phone || '';
        document.getElementById('receiver-email').value = window.currentUserData.email || '';

        const addr = window.currentUserData.address || "";
        const parts = addr.split(",").map(p => p.trim());
        const street = parts[0] || "";
        const ward = parts[1] || "";
        const province = parts[2] || "";

        document.getElementById('street').value = street;
        await loadProvincesForCheckout(province, ward);
        document.getElementById('address-desc').textContent = "Sử dụng địa chỉ từ hồ sơ của bạn.";
    } else {
        // Xóa sạch thông tin để người dùng nhập mới
        document.getElementById('receiver-name').value = "";
        document.getElementById('receiver-phone').value = "";
        document.getElementById('receiver-email').value = "";
        document.getElementById('street').value = "";
        
        await loadProvincesForCheckout();
        document.getElementById('address-desc').textContent = "Vui lòng nhập họ tên, SĐT và địa chỉ người nhận mới.";
    }

    // Thiết lập trạng thái khóa/mở sau khi đã tải xong dữ liệu để tránh bị ghi đè
    document.getElementById('street').disabled = isProfile;
    document.getElementById('province').disabled = isProfile;
    document.getElementById('ward').disabled = isProfile;
}

async function loadProvincesForCheckout(selectProvName = "", selectWardName = "") {
    try {
        const response = await fetch('api/get_provinces.php');
        const text = await response.text();
        let res;
        try {
            res = JSON.parse(text);
        } catch (e) {
            console.error('Lỗi định dạng JSON:', text);
            const pSel = document.getElementById('province');
            if (pSel) pSel.innerHTML = '<option value="">Lỗi tải dữ liệu (JSON Error)</option>';
            return;
        }

        const pSel = document.getElementById('province');
        if (res.success && pSel) {
            pSel.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>' +
                res.provinces.map(p => `<option value="${p.id}" ${p.name == selectProvName ? 'selected' : ''}>${p.name}</option>`).join('');

            if (pSel.value) {
                await loadWardsForCheckout(pSel.value, selectWardName);
            }
        } else {
            console.error('API Error:', res.message);
            if (pSel) pSel.innerHTML = `<option value="">Lỗi: ${res.message || 'Unknown'}</option>`;
        }
    } catch (e) {
        console.error('Lỗi load tỉnh:', e);
    }
}

async function loadWardsForCheckout(pId, selectWardName = "") {
    const wSel = document.getElementById('ward');
    if (!wSel) return;
    wSel.disabled = true;
    wSel.innerHTML = '<option>Đang tải...</option>';
    try {
        const response = await fetch(`api/get_wards.php?province_id=${pId}`);
        const text = await response.text();
        let res;
        try {
            res = JSON.parse(text);
        } catch (e) {
            console.error('Lỗi định dạng JSON xã:', text);
            wSel.innerHTML = '<option value="">Lỗi JSON</option>';
            return;
        }

        if (res.success) {
            wSel.innerHTML = '<option value="">Chọn Phường/Xã</option>' +
                res.wards.map(w => `<option value="${w.name}" ${w.name == selectWardName ? 'selected' : ''}>${w.name}</option>`).join('');
            wSel.disabled = false;
        } else {
            console.error('API Error Wards:', res.message);
            wSel.innerHTML = `<option value="">Lỗi: ${res.message || 'Unknown'}</option>`;
        }
    } catch (e) {
        console.error('Lỗi load xã:', e);
    }
}

// Hàm khởi tạo sự kiện
function initializeCheckoutEvents() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (!placeOrderBtn) return;

    // Toggle Address Source
    const addressRadios = document.querySelectorAll('input[name="address_source"]');
    addressRadios.forEach(radio => {
        radio.addEventListener('change', async function () {
            await loadUserInfo();
        });
    });

    // Toggle thông tin chuyển khoản
    const paymentRadios = document.querySelectorAll('input[name="paymentOption"]');
    const transferInfo = document.getElementById('transfer-info');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'transfer') {
                transferInfo.style.display = 'block';
            } else {
                transferInfo.style.display = 'none';
            }
        });
    });

    // Dropdown change listener
    const provinceSelect = document.getElementById('province');
    if (provinceSelect) {
        provinceSelect.addEventListener('change', function () {
            if (this.value) loadWardsForCheckout(this.value);
            else {
                const wSel = document.getElementById('ward');
                wSel.innerHTML = '<option value="">Chọn Tỉnh/Thành trước</option>';
                wSel.disabled = true;
            }
        });
    }

    placeOrderBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const receiverName = document.getElementById('receiver-name').value.trim();
        const receiverPhone = document.getElementById('receiver-phone').value.trim();
        const receiverEmail = document.getElementById('receiver-email').value.trim();

        const pSel = document.getElementById('province');
        const provinceName = pSel.selectedIndex > 0 ? pSel.options[pSel.selectedIndex].text : "";
        const wardName = document.getElementById('ward').value;
        const street = document.getElementById('street').value.trim();

        const paymentRadio = document.querySelector('input[name="paymentOption"]:checked');
        const paymentMethod = paymentRadio ? paymentRadio.value : 'cod';
        const orderNote = document.getElementById('order-note').value.trim();

        let errors = [];
        if (!receiverName) errors.push("- Họ tên người nhận.");
        if (!receiverPhone) errors.push("- Số điện thoại.");
        else if (!/^[0-9]{10}$/.test(receiverPhone.replace(/\s/g, ''))) errors.push("- Số điện thoại phải có 10 chữ số.");

        if (receiverEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiverEmail)) errors.push("- Email không đúng định dạng.");

        if (!provinceName) errors.push("- Tỉnh/Thành phố.");
        if (!wardName) errors.push("- Phường/Xã.");
        if (!street) errors.push("- Số nhà, tên đường.");

        if (errors.length > 0) {
            alert('⚠️ Vui lòng hoàn thành các thông tin sau:\n' + errors.join('\n'));
            return;
        }

        // ... (Kiem tra ton kho giu nguyen)
        if (window.sessionCart && window.sessionCart.length > 0) {
            for (const item of window.sessionCart) {
                if (item.quantity > item.max_stock) {
                    alert(`⚠️ Sản phẩm "${item.name}" chỉ còn ${item.max_stock} cái trong kho. Vui lòng cập nhật lại giỏ hàng.`);
                    window.location.href = 'cart.php';
                    return;
                }
            }
        }

        // Allow 'online' for demonstration
        if (paymentMethod === 'online') {
            console.log('Online payment selected (Demo Mode)');
        }

        const shippingAddress = `${street}, ${wardName}, ${provinceName}`;

        let formData = new FormData();
        formData.append('receiver_name', receiverName);
        formData.append('receiver_phone', receiverPhone);
        formData.append('receiver_email', receiverEmail);
        formData.append('shipping_address', shippingAddress);
        formData.append('payment_method', paymentMethod);
        formData.append('order_note', orderNote);

        const orderDataForInvoice = {
            receiver_name: receiverName,
            receiver_phone: receiverPhone,
            shipping_address: shippingAddress
        };

        try {
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'ĐANG XỬ LÝ...';

            const response = await fetch('api/place_order.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                // Thay vì alert đơn giản, hiện Pop-up hóa đơn cực đẹp
                showInvoicePopup(result.order_id, orderDataForInvoice, window.sessionCart);
            } else {
                alert('❌ Lỗi: ' + result.message);
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'ĐẶT HÀNG NGAY';
            }
        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            alert('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'ĐẶT HÀNG NGAY';
        }
    });
}

// Khối chạy chính khi DOM load
window.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('checkout-form')) {
        initCheckoutData();
        initializeCheckoutEvents();
    }
});