document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập khi vào trang giỏ hàng
    if (!window.requireLogin()) {
      return;
    }
  
    const cartItemsContainer = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const emptyCartEl = document.getElementById("empty-cart");
    const totalSection = document.getElementById("total-section");
    const clearBtn = document.getElementById("clear-cart");
    const checkoutBtn = document.getElementById("checkout-btn");
    const confirmModal = document.getElementById("confirm-modal");
    const modalCancelBtn = document.getElementById("modal-cancel-btn");
    const modalConfirmBtn = document.getElementById("modal-confirm-btn");
  
    // Hàm tính và cập nhật tổng tiền
    function updateTotal() {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      totalEl.textContent = total.toLocaleString();
    }
  
    // Load giỏ hàng
    function loadCart() {
      let cart = getCart();
      cartItemsContainer.innerHTML = "";
  
      if (cart.length === 0) {
        emptyCartEl.style.display = "block";
        cartItemsContainer.style.display = "none";
        totalSection.style.display = "none";
        clearBtn.disabled = true;
        checkoutBtn.disabled = true;
      } else {
        emptyCartEl.style.display = "none";
        cartItemsContainer.style.display = "flex";
        totalSection.style.display = "block";
        clearBtn.disabled = false;
        checkoutBtn.disabled = false;
  
        cart.forEach((item, index) => {
          const subtotal = item.price * item.quantity;
  
          const cartItem = document.createElement("div");
          cartItem.className = "cart-item";
          cartItem.innerHTML = `
            <div class="item-image">
              <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price.toLocaleString()}đ</div>
            <div class="item-quantity">
              <button class="qty-btn qty-decrease" data-index="${index}">-</button>
              <input type="number" min="1" max="999" value="${item.quantity}" class="qty-input" data-index="${index}">
              <button class="qty-btn qty-increase" data-index="${index}">+</button>
            </div>
            <div class="item-subtotal subtotal-cell">${subtotal.toLocaleString()}đ</div>
            <button class="btn-delete" data-index="${index}">Xóa</button>
          `;
          cartItemsContainer.appendChild(cartItem);
        });
      }
  
      updateTotal();
      updateCartCount();
    }
  
    // Xử lý tăng/giảm số lượng
    cartItemsContainer.addEventListener("click", (e) => {
      let cart = getCart();
      
      if (e.target.classList.contains("qty-decrease")) {
        const index = parseInt(e.target.dataset.index);
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCart(cart);
          updateItemQuantity(index, cart[index].quantity, cart[index].price);
        }
      }
      
      if (e.target.classList.contains("qty-increase")) {
        const index = parseInt(e.target.dataset.index);
        if (cart[index].quantity < 999) {
          cart[index].quantity++;
          saveCart(cart);
          updateItemQuantity(index, cart[index].quantity, cart[index].price);
        }
      }
      
      if (e.target.classList.contains("btn-delete")) {
        const index = parseInt(e.target.dataset.index);
        cart.splice(index, 1);
        saveCart(cart);
        loadCart();
      }
    });
  
    // Cập nhật số lượng khi nhập trực tiếp
    cartItemsContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("qty-input")) {
        let cart = getCart();
        const index = parseInt(e.target.dataset.index);
        let inputValue = e.target.value;
        
        if (inputValue.length > 3) {
          e.target.value = inputValue.slice(0, 3);
          inputValue = e.target.value;
        }
        
        let newQty = parseInt(inputValue) || 1;
        
        if (newQty < 1) {
          newQty = 1;
        } else if (newQty > 999) {
          newQty = 999;
          e.target.value = 999;
        }
        
        cart[index].quantity = newQty;
        saveCart(cart);
        updateItemQuantity(index, newQty, cart[index].price);
      }
    });
  
    // Hàm cập nhật số lượng và thành tiền
    function updateItemQuantity(index, quantity, price) {
      const items = cartItemsContainer.querySelectorAll(".cart-item");
      const item = items[index];
      const input = item.querySelector(".qty-input");
      const subtotalCell = item.querySelector(".subtotal-cell");
      
      input.value = quantity;
      subtotalCell.textContent = (price * quantity).toLocaleString() + "đ";
      
      updateTotal();
      updateCartCount();
    }
  
    // Xóa tất cả - Mở modal xác nhận
    clearBtn.addEventListener("click", () => {
      confirmModal.classList.add("active");
    });
  
    // Đóng modal
    modalCancelBtn.addEventListener("click", () => {
      confirmModal.classList.remove("active");
    });
  
    // Click ngoài modal để đóng
    confirmModal.addEventListener("click", (e) => {
      if (e.target === confirmModal) {
        confirmModal.classList.remove("active");
      }
    });
  
    // Xác nhận xóa tất cả
    modalConfirmBtn.addEventListener("click", () => {
      clearCart();
      confirmModal.classList.remove("active");
      loadCart();
    });
  
    // Xử lý thanh toán
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
      }
  
      const user = getCurrentUser();
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const orderInfo = `
  Đơn hàng của: ${user.fullname}
  Email: ${user.email}
  ───────────────────
  ${cart.map(item => `${item.name} x${item.quantity}: ${(item.price * item.quantity).toLocaleString()}đ`).join('\n')}
  ───────────────────
  Tổng cộng: ${total.toLocaleString()}đ
      `;
  
      if (confirm('Xác nhận đặt hàng?\n\n' + orderInfo)) {
        // Lưu đơn hàng
        const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
        orders.push({
          items: cart,
          total: total,
          orderDate: new Date().toISOString(),
          status: 'pending'
        });
        localStorage.setItem(`orders_${user.username}`, JSON.stringify(orders));
  
        // Xóa giỏ hàng
        clearCart();
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
        loadCart();
      }
    });
  
    // Load giỏ hàng khi trang được tải
    document.querySelector(".cart-container").classList.add("fade-in");
    loadCart();
  });