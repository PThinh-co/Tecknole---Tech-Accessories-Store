// ==========================================
// HỆ THỐNG XÁC THỰC HOÀN CHỈNH - auth.js
// ==========================================

// Kiểm tra trạng thái đăng nhập
function isLoggedIn() {
  const user = localStorage.getItem('currentUser');
  return user !== null;
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Đăng xuất
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('currentUser');
    alert('Đã đăng xuất thành công!');
    window.location.href = 'index.html';
  }
}

// Kiểm tra và chuyển hướng nếu chưa đăng nhập
function requireLogin() {
  if (!isLoggedIn()) {
    sessionStorage.setItem('returnUrl', window.location.href);
    alert('Vui lòng đăng nhập để sử dụng chức năng này!');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Cập nhật số lượng trong giỏ hàng
function updateCartCount() {
  const cartBadge = document.querySelector('.cart-badge span');
  if (!cartBadge) return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.innerText = totalItems;
  } else {
    cartBadge.innerText = '0';
  }
}

// Cập nhật UI khi đã đăng nhập
function updateHeaderUI() {
  const userActions = document.querySelector('.user-actions');
  if (!userActions) return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    userActions.innerHTML = `
      <a href="profile.html" style="color: var(--text-color-one); font-weight: 600; background: white; padding: 10px 20px; border-radius: 10px; text-decoration: none;">
        👤 ${user.fullname || user.username}
      </a>
      <button onclick="logout()" class="login" style="cursor: pointer; border: none;">
        Đăng xuất
      </button>
      <a href="cart.html" class="cart cart-badge">
        Giỏ hàng
        <span>0</span>
      </a>
    `;
  } else {
    userActions.innerHTML = `
      <a href="login.html" class="login">Đăng nhập</a>
      <a href="register.html" class="register">Đăng kí</a>
      <a href="cart.html" class="cart cart-badge">
        Giỏ hàng
        <span>0</span>
      </a>
    `;
  }

  // Cập nhật số lượng giỏ hàng
  updateCartCount();
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

// Thêm sản phẩm vào giỏ
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
    if (existingItem.quantity < 999) {
      existingItem.quantity += 1;
      alert(`Đã tăng số lượng "${product.name}" lên ${existingItem.quantity}`);
    } else {
      alert('Số lượng tối đa là 999!');
      return false;
    }
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

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
  updateHeaderUI();
});

// Expose functions globally
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