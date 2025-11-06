// File: assets/js/modal.js (Đã cập nhật)

// ==================== HÀM MỚI ĐỂ KIỂM TRA KHÓA ====================
function checkUserLockStatus() {
  // 1. Lấy thông tin user đang đăng nhập (nếu có)
  const loggedInUserStr = localStorage.getItem('bs_user');
  if (!loggedInUserStr) return; // Không đăng nhập, bỏ qua

  // 2. Lấy username
  const loggedInUser = JSON.parse(loggedInUserStr);
  const username = loggedInUser.username;

  // 3. Lấy danh sách tổng (do admin quản lý)
  const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
  
  // 4. Tìm dữ liệu mới nhất của user
  const currentUserData = users.find(u => u.username === username);

  // 5. Kiểm tra
  // Nếu user không còn tồn tại HOẶC user đã bị khóa
  if (!currentUserData || currentUserData.status === 'locked') {
      // 6. Đăng xuất
      localStorage.removeItem('bs_user');
      
      // 7. Hiển thị thông báo (dùng sessionStorage để chỉ báo 1 lần)
      if (sessionStorage.getItem('lockout_alert_shown') !== 'true') {
          alert('Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.');
          sessionStorage.setItem('lockout_alert_shown', 'true'); // Đánh dấu đã hiển thị
      }
      
      // 8. Tải lại trang để cập nhật UI
      location.reload(); 
  } else {
      // Nếu user hợp lệ và không bị khóa, xóa cờ thông báo
      sessionStorage.removeItem('lockout_alert_shown');
  }
}
// ==================== KẾT THÚC HÀM MỚI ====================


// ==================== MODAL FUNCTIONS ====================
// (Giữ nguyên các hàm: requireLogin, formatVND, getCurrentUser)
// ... (Hàm requireLogin, formatVND, getCurrentUser giữ nguyên) ...
function requireLogin() {
const user = getCurrentUser();
if (!user) {
    alert('Vui lòng đăng nhập để tiếp tục.');
    window.location.href = 'index.html'; // Chuyển hướng về trang chủ
    return false;
}
return true;
}
function formatVND(price) {
return price.toLocaleString('vi-VN') + 'đ';
}
function getCurrentUser() {
const userStr = localStorage.getItem('bs_user');
return userStr ? JSON.parse(userStr) : null;
}


// ==================== CART FUNCTIONS ====================
// ... (Hàm getCart, saveCart, clearCart, updateCartCount giữ nguyên) ...
function getCart() {
const user = getCurrentUser();
if (!user) return [];
const cartKey = `cart_${user.username}`;
return JSON.parse(localStorage.getItem(cartKey)) || [];
}
function saveCart(cart) {
const user = getCurrentUser();
if (!user) return;
const cartKey = `cart_${user.username}`;
localStorage.setItem(cartKey, JSON.stringify(cart));
updateCartCount();
}
function clearCart() {
const user = getCurrentUser();
if (!user) return;
const cartKey = `cart_${user.username}`;
localStorage.removeItem(cartKey);
updateCartCount();
}
function updateCartCount() {
const cartCountSpan = document.querySelector('.cart-badge span');
if (!cartCountSpan) return;
const cart = getCart();
const totalItems = cart.reduce((total, item) => total + item.quantity, 0); 
cartCountSpan.textContent = totalItems;
}


// ==================== MODAL LOGIN/REGISTER ====================
// ... (Hàm openLoginModal, closeLoginModal, openRegisterModal, closeRegisterModal, 
//      openProfileModal, closeProfileModal, switchToRegister, switchToLogin,
//      clearFormErrors, togglePassword, validateEmail, validatePhone giữ nguyên) ...
function openLoginModal() {
document.getElementById('loginModal').classList.add('show');
document.body.style.overflow = 'hidden';
}
function closeLoginModal() {
document.getElementById('loginModal').classList.remove('show');
document.body.style.overflow = 'auto';
clearFormErrors();
}
function openRegisterModal() {
document.getElementById('registerModal').classList.add('show');
document.body.style.overflow = 'hidden';
}
function closeRegisterModal() {
document.getElementById('registerModal').classList.remove('show');
document.body.style.overflow = 'auto';
clearFormErrors();
}
function openProfileModal() {
const userStr = localStorage.getItem('bs_user');
if (!userStr) {
  openLoginModal();
  return;
}
const user = JSON.parse(userStr);
const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
const currentUserData = users.find(u => u.username === user.username) || user;
document.getElementById('profile-fullname').textContent = 'Xin chào, ' + currentUserData.fullName + '!';
document.getElementById('profile-name-value').textContent = currentUserData.fullName;
document.getElementById('profile-username-value').textContent = currentUserData.username;
document.getElementById('profile-email-value').textContent = currentUserData.email;
document.getElementById('profile-phone-value').textContent = currentUserData.phone;
document.getElementById('profile-address-value').textContent = currentUserData.address;
document.getElementById('profileModal').classList.add('show');
document.body.style.overflow = 'hidden';
}
function closeProfileModal() {
document.getElementById('profileModal').classList.remove('show');
document.body.style.overflow = 'auto';
}
function switchToRegister() {
closeLoginModal();
setTimeout(() => openRegisterModal(), 200);
}
function switchToLogin() {
closeRegisterModal();
setTimeout(() => openLoginModal(), 200);
}
function clearFormErrors() {
document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}
function togglePassword(inputId, iconId) {
const input = document.getElementById(inputId);
const icon = document.getElementById(iconId);
if (input.type === 'password') {
  input.type = 'text';
  icon.textContent = '👁️';
} else {
  input.type = 'password';
  icon.textContent = '👁️‍🗨️';
}
}
function validateEmail(email) {
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(email);
}
function validatePhone(phone) {
const re = /^[0-9]{10}$/;
return re.test(phone.replace(/\s/g, ''));
}

// Xử lý đăng nhập (Đã có kiểm tra khóa)
function handleLogin(e) {
e.preventDefault();

const username = document.getElementById('login-username').value.trim();
const password = document.getElementById('login-password').value;

clearFormErrors();

let hasError = false;

if (!username) {
  document.getElementById('error-login-username').textContent = 'Vui lòng nhập tài khoản';
  hasError = true;
}

if (!password) {
  document.getElementById('error-login-password').textContent = 'Vui lòng nhập mật khẩu';
  hasError = true;
}

if (hasError) return;

const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
const user = users.find(u => u.username === username);

if (!user) {
  document.getElementById('error-login-username').textContent = 'Tài khoản không tồn tại';
  return;
}

// KIỂM TRA TRẠNG THÁI TÀI KHOẢN (Đã thêm ở lần trước)
if (user.status === 'locked') {
  document.getElementById('error-login-username').textContent = 'Tài khoản của bạn đã bị khóa.';
  return; 
}

if (user.password !== password) {
  document.getElementById('error-login-password').textContent = 'Mật khẩu không chính xác';
  return;
}

localStorage.setItem('bs_user', JSON.stringify({ 
  username: user.username,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  address: user.address
}));

closeLoginModal();
alert('Đăng nhập thành công!');
updateAuthUI(); 
location.reload(); 
}

// Xử lý đăng ký
function handleRegister(e) {
e.preventDefault();

const fullName = document.getElementById('reg-fullname').value.trim();
const username = document.getElementById('reg-username').value.trim();
const password = document.getElementById('reg-password').value;
const confirmPassword = document.getElementById('reg-confirm-password').value;
const email = document.getElementById('reg-email').value.trim();
const phone = document.getElementById('reg-phone').value.trim();
const address = document.getElementById('reg-address').value.trim();

clearFormErrors();

let hasError = false;

if (!fullName) {
  document.getElementById('error-fullname').textContent = 'Vui lòng nhập họ tên';
  hasError = true;
}
if (!username) {
  document.getElementById('error-username').textContent = 'Vui lòng nhập tài khoản';
  hasError = true;
} else if (username.length < 4) {
  document.getElementById('error-username').textContent = 'Tài khoản phải có ít nhất 4 ký tự';
  hasError = true;
}
if (!password) {
  document.getElementById('error-password').textContent = 'Vui lòng nhập mật khẩu';
  hasError = true;
} else if (password.length < 6) {
  document.getElementById('error-password').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
  hasError = true;
}
if (password !== confirmPassword) {
  document.getElementById('error-confirm-password').textContent = 'Mật khẩu không khớp';
  hasError = true;
}
if (!email) {
  document.getElementById('error-email').textContent = 'Vui lòng nhập email';
  hasError = true;
} else if (!validateEmail(email)) {
  document.getElementById('error-email').textContent = 'Email không hợp lệ';
  hasError = true;
}
if (!phone) {
  document.getElementById('error-phone').textContent = 'Vui lòng nhập số điện thoại';
  hasError = true;
} else if (!validatePhone(phone)) {
  document.getElementById('error-phone').textContent = 'Số điện thoại phải có 10 chữ số';
  hasError = true;
}
if (!address) {
  document.getElementById('error-address').textContent = 'Vui lòng nhập địa chỉ';
  hasError = true;
}

if (hasError) return;

const existingUsers = JSON.parse(localStorage.getItem('bs_users') || '[]');
if (existingUsers.some(u => u.username === username)) {
  document.getElementById('error-username').textContent = 'Tài khoản đã tồn tại';
  return;
}

const newUser = {
  fullName,
  username,
  password, 
  email,
  phone,
  address,
  status: 'active', // Thêm trạng thái mặc định
  createdAt: new Date().toISOString()
};

existingUsers.push(newUser);
localStorage.setItem('bs_users', JSON.stringify(existingUsers));

closeRegisterModal();
alert('Đăng ký thành công! Vui lòng đăng nhập.');
setTimeout(() => openLoginModal(), 300);
}

// Đăng xuất từ modal
function handleLogoutModal() {
if (confirm('Bạn có chắc muốn đăng xuất?')) {
  localStorage.removeItem('bs_user');
  closeProfileModal();
  updateAuthUI(); 
  location.reload(); 
}
}

// ==================== USER DROPDOWN MENU ====================
// ... (Hàm toggleUserDropdown, logic click bên ngoài, openAccountInfoModal, 
//      closeAccountInfoModal, handleLogoutFromModal, openUpdateProfileModal, 
//      closeUpdateProfileModal, handleUpdateProfile, handleLogout giữ nguyên) ...
function toggleUserDropdown(event) {
if (event) event.stopPropagation();
const dropdown = document.getElementById('userDropdownMenu');
if (dropdown) {
  dropdown.classList.toggle('show');
}
}
document.addEventListener('click', function (event) {
const dropdown = document.getElementById('userDropdownMenu');
if (dropdown && !event.target.closest('.user-dropdown-container')) {
  dropdown.classList.remove('show');
}
});
function openAccountInfoModal() {
const userStr = localStorage.getItem('bs_user');
if (!userStr) {
  openLoginModal();
  return;
}
const user = JSON.parse(userStr);
const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
const currentUserData = users.find(u => u.username === user.username) || user;
const dropdown = document.getElementById('userDropdownMenu');
if (dropdown) dropdown.classList.remove('show');
const modalHTML = `
  <div id="accountInfoModal" class="auth-modal show">
    <div class="auth-modal-overlay" onclick="closeAccountInfoModal()"></div>
    <div class="auth-modal-content">
      <button class="auth-modal-close" onclick="closeAccountInfoModal()">&times;</button>
      <div class="auth-modal-header">
        <div class="profile-avatar-small">👤</div>
        <h2>Xin chào, ${currentUserData.fullName}!</h2>
        <p>Thông tin tài khoản của bạn</p>
      </div>
      <div class="profile-info-modal">
        <div class="info-row"><span class="info-label">👤 Họ và tên:</span><span class="info-value">${currentUserData.fullName}</span></div>
        <div class="info-row"><span class="info-label">🔑 Tài khoản:</span><span class="info-value">${currentUserData.username}</span></div>
        <div class="info-row"><span class="info-label">📧 Email:</span><span class="info-value">${currentUserData.email}</span></div>
        <div class="info-row"><span class="info-label">📱 Số điện thoại:</span><span class="info-value">${currentUserData.phone}</span></div>
        <div class="info-row"><span class="info-label">📍 Địa chỉ:</span><span class="info-value">${currentUserData.address}</span></div>
      </div>
      <button type="button" class="btn-auth-submit" onclick="openUpdateProfileModal()">Điều chỉnh thông tin</button>
      <button type="button" class="btn-auth-submit" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); margin-top: 10px;" onclick="handleLogoutFromModal()">Đăng xuất</button>
    </div>
  </div>
`;
const existingModal = document.getElementById('accountInfoModal');
if (existingModal) {
  existingModal.remove();
}
document.body.insertAdjacentHTML('beforeend', modalHTML);
document.body.style.overflow = 'hidden';
}
function closeAccountInfoModal() {
const modal = document.getElementById('accountInfoModal');
if (modal) {
  modal.remove();
}
document.body.style.overflow = 'auto';
}
function handleLogoutFromModal() {
if (confirm('Bạn có chắc muốn đăng xuất?')) {
  localStorage.removeItem('bs_user');
  closeAccountInfoModal();
  updateAuthUI();
  location.reload();
}
}
function openUpdateProfileModal() {
closeAccountInfoModal();
const userStr = localStorage.getItem('bs_user');
if (!userStr) {
  openLoginModal();
  return;
}
const user = JSON.parse(userStr);
const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
const currentUserData = users.find(u => u.username === user.username) || user;
const dropdown = document.getElementById('userDropdownMenu');
if (dropdown) dropdown.classList.remove('show');
const modalHTML = `
  <div id="updateProfileModal" class="auth-modal show">
    <div class="auth-modal-overlay" onclick="closeUpdateProfileModal()"></div>
    <div class="auth-modal-content">
      <button class="auth-modal-close" onclick="closeUpdateProfileModal()">&times;</button>
      <div class="auth-modal-header">
        <h2>Cập nhật thông tin</h2>
        <p>Chỉnh sửa thông tin cá nhân của bạn</p>
      </div>
      <form id="update-profile-form" class="auth-modal-form" style="max-height: 450px; overflow-y: auto">
        <div class="form-group"><label for="update-fullname">Họ và tên</label><div class="input-with-icon"><span class="input-icon">👤</span><input type="text" id="update-fullname" value="${currentUserData.fullName}" placeholder="Nhập họ và tên" /></div><span id="error-update-fullname" class="error-msg"></span></div>
        <div class="form-group"><label for="update-email">Email</label><div class="input-with-icon"><span class="input-icon">📧</span><input type="email" id="update-email" value="${currentUserData.email}" placeholder="Nhập email" /></div><span id="error-update-email" class="error-msg"></span></div>
        <div class="form-group"><label for="update-phone">Số điện thoại</label><div class="input-with-icon"><span class="input-icon">📱</span><input type="tel" id="update-phone" value="${currentUserData.phone}" placeholder="Nhập số điện thoại" /></div><span id="error-update-phone" class="error-msg"></span></div>
        <div class="form-group"><label for="update-address">Địa chỉ</label><div class="input-with-icon"><span class="input-icon">📍</span><input type="text" id="update-address" value="${currentUserData.address}" placeholder="Nhập địa chỉ" /></div><span id="error-update-address" class="error-msg"></span></div>
        <button type="submit" class="btn-auth-submit">Cập nhật</button>
      </form>
    </div>
  </div>
`;
const existingModal = document.getElementById('updateProfileModal');
if (existingModal) {
  existingModal.remove();
}
document.body.insertAdjacentHTML('beforeend', modalHTML);
document.body.style.overflow = 'hidden';
document.getElementById('update-profile-form').addEventListener('submit', handleUpdateProfile);
}
function closeUpdateProfileModal() {
const modal = document.getElementById('updateProfileModal');
if (modal) {
  modal.remove();
}
document.body.style.overflow = 'auto';
}
function handleUpdateProfile(e) {
e.preventDefault();
const fullName = document.getElementById('update-fullname').value.trim();
const email = document.getElementById('update-email').value.trim();
const phone = document.getElementById('update-phone').value.trim();
const address = document.getElementById('update-address').value.trim();
document.querySelectorAll('#updateProfileModal .error-msg').forEach(el => el.textContent = '');
let hasError = false;
if (!fullName) { document.getElementById('error-update-fullname').textContent = 'Vui lòng nhập họ tên'; hasError = true; }
if (!email) { document.getElementById('error-update-email').textContent = 'Vui lòng nhập email'; hasError = true; } else if (!validateEmail(email)) { document.getElementById('error-update-email').textContent = 'Email không hợp lệ'; hasError = true; }
if (!phone) { document.getElementById('error-update-phone').textContent = 'Vui lòng nhập số điện thoại'; hasError = true; } else if (!validatePhone(phone)) { document.getElementById('error-update-phone').textContent = 'Số điện thoại phải có 10 chữ số'; hasError = true; }
if (!address) { document.getElementById('error-update-address').textContent = 'Vui lòng nhập địa chỉ'; hasError = true; }
if (hasError) return;
const currentUser = getCurrentUser();
const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
const userIndex = users.findIndex(u => u.username === currentUser.username);
if (userIndex !== -1) {
  users[userIndex].fullName = fullName;
  users[userIndex].email = email;
  users[userIndex].phone = phone;
  users[userIndex].address = address;
  localStorage.setItem('bs_users', JSON.stringify(users));
  localStorage.setItem('bs_user', JSON.stringify({
    username: currentUser.username,
    fullName: fullName,
    email: email,
    phone: phone,
    address: address
  }));
  alert('Cập nhật thông tin thành công!');
  closeUpdateProfileModal();
  updateAuthUI();
}
}
function handleLogout() {
if (confirm('Bạn có chắc muốn đăng xuất?')) {
  localStorage.removeItem('bs_user');
  const dropdown = document.getElementById('userDropdownMenu');
  if (dropdown) dropdown.classList.remove('show');
  updateAuthUI();
  location.reload();
}
}


// ==================== CẬP NHẬT GIAO DIỆN XÁC THỰC ====================
// ... (Hàm updateAuthUI giữ nguyên) ...
function updateAuthUI() {
const authArea = document.getElementById('authArea');
const userStr = localStorage.getItem('bs_user');
if (authArea) {
  if (userStr) {
    const user = JSON.parse(userStr);
    const firstName = user.fullName.split(' ').slice(-1)[0]; 
    authArea.innerHTML = `
      <div class="user-dropdown-container">
        <button class="btn-profile" onclick="toggleUserDropdown(event)">
          <span class="user-avatar">👤</span>
          <span class="user-name">Xin chào, ${firstName}</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div class="dropdown-header">
            <div class="user-avatar-large">👤</div>
            <div class="user-info">
              <div class="user-fullname">${user.fullName}</div>
              <div class="user-email">${user.email}</div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <a href="user_cart.html" class="dropdown-item">
            <span class="dropdown-icon">📦</span>
            <span>Lịch sử mua hàng</span>
          </a>
          <button class="dropdown-item" onclick="openAccountInfoModal()">
            <span class="dropdown-icon">👤</span>
            <span>Thông tin tài khoản</span>
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onclick="handleLogout()" style="color: #e74c3c;">
            <span class="dropdown-icon">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      <a href="cart.html" class="cart cart-badge">Giỏ hàng <span>0</span></a>
    `;
  } else {
    authArea.innerHTML = `
      <button class="btn-auth" onclick="openLoginModal()">Đăng nhập</button>
      <button class="btn-auth btn-signup" onclick="openRegisterModal()">
        Đăng ký
      </button>
      <a href="cart.html" class="cart cart-badge">Giỏ hàng <span>0</span></a>
    `;
  }
}
updateCartCount();
}

// ==================== CẬP NHẬT KHỞI TẠO ====================

// Chạy hàm này khi toàn bộ DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Kiểm tra trạng thái khóa TRƯỚC khi làm bất cứ điều gì
  checkUserLockStatus();
  
  // 2. Cập nhật UI (nếu user bị đăng xuất, UI sẽ tự động
  //    hiển thị "Đăng nhập")
  updateAuthUI();
  
  // 3. Cập nhật động các menu danh mục
  // (Kiểm tra xem hàm này tồn tại không, vì nó ở cuối file)
  if (typeof syncAllCategories === 'function') {
      syncAllCategories();
  }

  // 4. Gắn sự kiện submit cho form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
  }
});


// =========================================================
// === CODE ĐỒNG BỘ TẤT CẢ DANH MỤC (Thêm từ lần trước) ===
// =========================================================

function getSyncedCategories() {
  const defaultCategories = [
      { id: 1, code: 'PK', name: 'Phụ kiện', type: 'pk', profit: 20, status: 'active' },
      { id: 2, code: 'MN', name: 'Màn hình', type: 'manhinh', profit: 15, status: 'active' },
      { id: 3, code: 'BP', name: 'Bàn phím', type: 'banphim', profit: 15, status: 'active' },
      { id: 4, code: 'CH', name: 'Chuột', type: 'chuot', profit: 18, status: 'active' },
      { id: 5, code: 'TN', name: 'Tai nghe', type: 'tainghe', profit: 22, status: 'active' },
      { id: 6, code: 'LOA', name: 'Loa', type: 'loa', profit: 20, status: 'active' }
  ];
  let categories = JSON.parse(localStorage.getItem('admin_categories')) || defaultCategories;
  return categories.filter(cat => cat.status === 'active' || cat.status === undefined);
}

function populateCategorySelects(categories) {
  const selectDropdowns = document.querySelectorAll(
      'select[name="scat_id"], #filter-type'
  );
  if (selectDropdowns.length === 0) return;

  selectDropdowns.forEach(selectElement => {
      const currentSelectedValue = selectElement.value; 
      const firstOption = selectElement.querySelector('option');
      selectElement.innerHTML = ''; 
      if (firstOption) {
          selectElement.appendChild(firstOption);
      }
      categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.type; 
          option.textContent = cat.name;
          selectElement.appendChild(option);
      });
      if (currentSelectedValue) {
          selectElement.value = currentSelectedValue;
      }
  });
}

function populateCategoryNavMenu(categories) {
  const navMenu = document.querySelector('nav .dropdown-menu');
  if (!navMenu) return;

  navMenu.innerHTML = ''; 

  categories.forEach(cat => {
      const li = document.createElement('li');
      // Lưu ý: Code này sẽ thay thế menu tĩnh cũ, 
      // bao gồm cả các submenu thương hiệu (Acer, Asus...)
      li.innerHTML = `<a href="category.html?type=${cat.type}">${cat.name}</a>`;
      navMenu.appendChild(li);
  });
}

function syncAllCategories() {
  const categories = getSyncedCategories();
  populateCategorySelects(categories);
  populateCategoryNavMenu(categories);
}

// (Sự kiện này đã được chuyển vào listener chính ở trên)
// document.addEventListener('DOMContentLoaded', syncAllCategories);

// Tự động cập nhật nếu admin thay đổi
window.addEventListener('adminDataChanged', syncAllCategories);