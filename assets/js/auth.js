// ==========================================
// HỆ THỐNG AUTH HOÀN CHỈNH - auth.js
// ==========================================

// Kiểm tra đăng nhập
function isLoggedIn() {
  return localStorage.getItem('currentUser') !== null;
}

// Lấy user hiện tại
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Đăng xuất
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

// BẮT BUỘC ĐĂNG NHẬP (cho cart.html)
function requireLogin() {
  if (!isLoggedIn()) {
    sessionStorage.setItem('returnUrl', window.location.href);
    alert('Vui lòng đăng nhập để sử dụng chức năng này!');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
  const badge = document.querySelector('.cart-badge span');
  if (!badge) return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    badge.textContent = total || 0;
  } else {
    badge.textContent = '0';
  }
}

// Cập nhật header UI
function updateHeaderUI() {
  const userActions = document.querySelector('.user-actions');
  if (!userActions) return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    userActions.innerHTML = `
      <span style="color: #fff; background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
        Xin chào, ${user.fullname || user.username}!
      </span>
      <button onclick="logout()" style="background: #34495e; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: 500;">
        Đăng xuất
      </button>
      <a href="cart.html" class="cart cart-badge">
        Giỏ hàng <span>0</span>
      </a>
    `;
  } else {
    userActions.innerHTML = `
      <a href="login.html" class="login" style="color: #fff; text-decoration: none;">Đăng nhập</a>
      <a href="register.html" class="register" style="color: #fff; text-decoration: none; margin: 0 10px;">Đăng ký</a>
      <a href="cart.html" class="cart cart-badge">
        Giỏ hàng <span>0</span>
      </a>
    `;
  }
  
  // Cập nhật số lượng sau khi render
  setTimeout(updateCartCount, 100);
}

// THÊM SẢN PHẨM VÀO GIỎ HÀNG
function addToCart(product) {
  if (!isLoggedIn()) {
    sessionStorage.setItem('returnUrl', window.location.href);
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
    window.location.href = 'login.html';
    return false;
  }

  const user = getCurrentUser();
  const cartKey = `cart_${user.username}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingItem = cart.find(item => item.name === product.name);
  
  if (existingItem) {
    existingItem.quantity += 1;
    alert(`Đã tăng số lượng "${product.name}" lên ${existingItem.quantity}`);
  } else {
    cart.push({
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
  return true;
}

// Lấy giỏ hàng
function getCart() {
  if (!isLoggedIn()) return [];
  const user = getCurrentUser();
  return JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
}

// Lưu giỏ hàng
function saveCart(cart) {
  if (!isLoggedIn()) return false;
  const user = getCurrentUser();
  localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
  updateCartCount();
  return true;
}

// Xóa giỏ hàng
function clearCart() {
  if (!isLoggedIn()) return false;
  const user = getCurrentUser();
  localStorage.removeItem(`cart_${user.username}`);
  updateCartCount();
  return true;
}

// ==========================================
// KHỞI TẠO KHI TRANG LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUI();
});

// ==========================================
// EXPOSE TOÀN BỘ HÀM CHO CÁC FILE KHÁC
// ==========================================
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.requireLogin = requireLogin;
window.updateHeaderUI = updateHeaderUI;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
window.getCart = getCart;
window.saveCart = saveCart;
window.clearCart = clearCart;