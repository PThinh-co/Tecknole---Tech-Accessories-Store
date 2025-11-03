const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const emptyCartSection = document.getElementById('empty-cart');
        const totalSection = document.getElementById('total-section');
        const confirmModal = document.getElementById('confirm-modal');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');

        // Hiển thị/Cập nhật Giỏ hàng
        function renderCart() {
            const cart = getCart();
            let total = 0;
            cartItemsContainer.innerHTML = '';

            if (cart.length === 0) {
                cartItemsContainer.style.display = 'none';
                emptyCartSection.style.display = 'block';
                totalSection.style.display = 'none';
                clearCartBtn.disabled = true;
                checkoutBtn.disabled = true;
                return;
            }

            cartItemsContainer.style.display = 'flex';
            emptyCartSection.style.display = 'none';
            totalSection.style.display = 'block';
            clearCartBtn.disabled = false;
            checkoutBtn.disabled = false;

            cart.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                // Sử dụng item.image thay vì item.img
                const itemHTML = `
                    <div class="cart-item fade-in" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${formatVND(item.price)}</div>
                        <div class="item-quantity">
                            <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${item.stock || 99}" data-id="${item.id}">
                            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                        <div class="item-subtotal">${formatVND(itemTotal)}</div>
                        <button class="btn-delete" data-id="${item.id}">Xóa</button>
                    </div>
                `;
                cartItemsContainer.innerHTML += itemHTML;
            });

            cartTotalElement.textContent = formatVND(total);
            updateAuthUI(); // Cập nhật số lượng giỏ hàng ở header
        }
        
        // Cập nhật số lượng (sử dụng hàm saveCart/getCart từ modal.js)
        function updateQuantity(id, newQuantity) {
            let cart = getCart();
            const index = cart.findIndex(item => item.id == id);
            
            if (index > -1) {
                newQuantity = Math.max(1, newQuantity); // Quantity tối thiểu là 1
                const maxStock = cart[index].stock || 99;
                newQuantity = Math.min(maxStock, newQuantity); // Quantity tối đa là stock

                cart[index].quantity = newQuantity;
                saveCart(cart);
                renderCart(); // Render lại giỏ hàng
            }
        }

        // Xóa một sản phẩm
        function removeItem(id) {
            let cart = getCart();
            const newCart = cart.filter(item => item.id != id);
            saveCart(newCart);
            renderCart();
        }

        // Xử lý sự kiện click trên container (Delegate)
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.getAttribute('data-id');
            
            if (target.classList.contains('qty-btn')) {
                const input = target.closest('.item-quantity').querySelector('.qty-input');
                let currentQty = parseInt(input.value);
                const action = target.getAttribute('data-action');

                if (action === 'increase') {
                    updateQuantity(id, currentQty + 1);
                } else if (action === 'decrease') {
                    if (currentQty > 1) {
                         updateQuantity(id, currentQty - 1);
                    } else {
                        // Nếu số lượng là 1 và nhấn giảm, hỏi xác nhận xóa
                        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                            removeItem(id);
                        }
                    }
                }
            } else if (target.classList.contains('btn-delete')) {
                // Nút Xóa
                if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                    removeItem(id);
                }
            }
        });
        
        // Xử lý thay đổi thủ công trong input
        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const id = e.target.getAttribute('data-id');
                let newQty = parseInt(e.target.value);
                
                if (isNaN(newQty) || newQty < 1) {
                    newQty = 1; // Mặc định là 1 nếu nhập giá trị không hợp lệ
                }
                updateQuantity(id, newQty);
            }
        });
        
        // Xử lý nút Xóa tất cả (Mở modal)
        clearCartBtn.addEventListener('click', () => {
            if (getCart().length > 0) {
                confirmModal.classList.add('active');
            }
        });

        // Xử lý modal xác nhận
        modalCancelBtn.addEventListener('click', () => {
            confirmModal.classList.remove('active');
        });

        modalConfirmBtn.addEventListener('click', () => {
            clearCart();
            confirmModal.classList.remove('active');
            renderCart();
            alert('Đã xóa tất cả sản phẩm khỏi giỏ hàng.');
        });
        
        // Chuyển hướng thanh toán
        checkoutBtn.addEventListener('click', () => {
            if (getCart().length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Giỏ hàng trống. Vui lòng thêm sản phẩm để thanh toán.');
            }
        });

        // Khởi tạo trang: Yêu cầu đăng nhập và hiển thị giỏ hàng
        window.addEventListener('DOMContentLoaded', () => {
            if (requireLogin()) {
                renderCart();
            }
        });