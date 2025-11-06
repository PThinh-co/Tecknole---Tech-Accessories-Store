// File: assets/js/modal.js (Đã xóa các ký tự 'source' bị lỗi)

// ==================== MODAL FUNCTIONS ====================

// Hàm kiểm tra Đăng nhập
function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        alert('Vui lòng đăng nhập để tiếp tục.');
        window.location.href = 'index.html'; // Chuyển hướng về trang chủ
        return false;
    }
    return true;
  }
  
  // Hàm format tiền (Dùng chung cho nhiều file)
  function formatVND(price) {
    return price.toLocaleString('vi-VN') + 'đ';
  }
  
  // Lấy thông tin người dùng đang đăng nhập
  function getCurrentUser() {
    const userStr = localStorage.getItem('bs_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // ==================== CART FUNCTIONS ====================
  
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
  
  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng hiển thị trên Header
  function updateCartCount() {
    const cartCountSpan = document.querySelector('.cart-badge span');
    if (!cartCountSpan) return;
  
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0); 
  
    cartCountSpan.textContent = totalItems;
  }
  
  // ==================== MODAL LOGIN/REGISTER ====================
  
  // Mở modal đăng nhập
  function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  // Đóng modal đăng nhập
  function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    clearFormErrors();
  }
  
  // Mở modal đăng ký
  function openRegisterModal() {
    document.getElementById('registerModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  // Đóng modal đăng ký
  function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    clearFormErrors();
  }
  
  // Mở modal profile (GIỮ NGUYÊN - dùng cho trường hợp cần)
  function openProfileModal() {
    const userStr = localStorage.getItem('bs_user');
    if (!userStr) {
      openLoginModal();
      return;
    }
  
    // Đọc dữ liệu từ bs_users để có thông tin cập nhật mới nhất (nếu có)
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
  
  // Đóng modal profile
  function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('show');
    document.body.style.overflow = 'auto';
  }
  
  // Chuyển từ login sang register
  function switchToRegister() {
    closeLoginModal();
    setTimeout(() => openRegisterModal(), 200);
  }
  
  // Chuyển từ register sang login
  function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => openLoginModal(), 200);
  }
  
  // Xóa lỗi form
  function clearFormErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }
  
  // Toggle hiển thị mật khẩu
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
  
  // Validate email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Validate số điện thoại
  function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\s/g, ''));
  }
  
  // Xử lý đăng nhập
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
  
    // === ĐÃ THÊM: KIỂM TRA TRẠNG THÁI TÀI KHOẢN ===
    if (user.status === 'locked') {
      document.getElementById('error-login-username').textContent = 'Tài khoản của bạn đã bị khóa.';
      return; // Dừng đăng nhập
    }
    // === KẾT THÚC THÊM ===
  
    if (user.password !== password) {
      document.getElementById('error-login-password').textContent = 'Mật khẩu không chính xác';
      return;
    }
  
    // Lưu thông tin người dùng đang đăng nhập (bỏ password đi)
    localStorage.setItem('bs_user', JSON.stringify({ 
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address
    }));
  
    closeLoginModal();
    alert('Đăng nhập thành công!');
    updateAuthUI(); // Cập nhật giao diện sau khi đăng nhập
    location.reload(); // Tải lại trang để cập nhật các thành phần khác nếu cần
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
      password, // Lưu mật khẩu dưới dạng plain text (chỉ dùng cho mục đích demo)
      email,
      phone,
      address,
      status: 'active', // Thêm trạng thái mặc định khi đăng ký
      createdAt: new Date().toISOString()
    };
  
    existingUsers.push(newUser);
    localStorage.setItem('bs_users', JSON.stringify(existingUsers));
  
    closeRegisterModal();
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    // Logic hiện modal đăng nhập sau khi đăng ký thành công
    setTimeout(() => openLoginModal(), 300);
  }
  
  // Đăng xuất từ modal
  function handleLogoutModal() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('bs_user');
      closeProfileModal();
      updateAuthUI(); // Cập nhật giao diện sau khi đăng xuất
      location.reload(); // Tải lại trang để cập nhật giao diện
    }
  }
  
  // ==================== USER DROPDOWN MENU (MỚI) ====================
  
  // Toggle dropdown menu
  function toggleUserDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }
  
  // Đóng dropdown khi click bên ngoài
  document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown && !event.target.closest('.user-dropdown-container')) {
      dropdown.classList.remove('show');
    }
  });
  
  // Mở modal xem thông tin tài khoản
  function openAccountInfoModal() {
    const userStr = localStorage.getItem('bs_user');
    if (!userStr) {
      openLoginModal();
      return;
    }
  
    const user = JSON.parse(userStr);
    const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
    const currentUserData = users.find(u => u.username === user.username) || user;
  
    // Đóng dropdown nếu đang mở
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
  
    // Tạo modal hiển thị thông tin tài khoản
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
            <div class="info-row">
              <span class="info-label">👤 Họ và tên:</span>
              <span class="info-value">${currentUserData.fullName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">🔑 Tài khoản:</span>
              <span class="info-value">${currentUserData.username}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📧 Email:</span>
              <span class="info-value">${currentUserData.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📱 Số điện thoại:</span>
              <span class="info-value">${currentUserData.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 Địa chỉ:</span>
              <span class="info-value">${currentUserData.address}</span>
            </div>
          </div>
  
          <button type="button" class="btn-auth-submit" onclick="openUpdateProfileModal()">Điều chỉnh thông tin</button>
          <button type="button" class="btn-auth-submit" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); margin-top: 10px;" onclick="handleLogoutFromModal()">Đăng xuất</button>
        </div>
      </div>
    `;
  
    // Thêm modal vào body
    const existingModal = document.getElementById('accountInfoModal');
    if (existingModal) {
      existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
  }
  
  // Đóng modal thông tin tài khoản
  function closeAccountInfoModal() {
    const modal = document.getElementById('accountInfoModal');
    if (modal) {
      modal.remove();
    }
    document.body.style.overflow = 'auto';
  }
  
  // Đăng xuất từ modal thông tin tài khoản
  function handleLogoutFromModal() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('bs_user');
      closeAccountInfoModal();
      updateAuthUI();
      location.reload();
    }
  }
  
  // Mở modal cập nhật thông tin
  function openUpdateProfileModal() {
    // Đóng modal thông tin tài khoản nếu đang mở
    closeAccountInfoModal();
  
    const userStr = localStorage.getItem('bs_user');
    if (!userStr) {
      openLoginModal();
      return;
    }
  
    const user = JSON.parse(userStr);
    const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
    const currentUserData = users.find(u => u.username === user.username) || user;
  
    // Đóng dropdown nếu đang mở
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
  
    // Tạo modal cập nhật thông tin
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
            <div class="form-group">
              <label for="update-fullname">Họ và tên</label>
              <div class="input-with-icon">
                <span class="input-icon">👤</span>
                <input type="text" id="update-fullname" value="${currentUserData.fullName}" placeholder="Nhập họ và tên" />
              </div>
              <span id="error-update-fullname" class="error-msg"></span>
            </div>
  
            <div class="form-group">
              <label for="update-email">Email</label>
              <div class="input-with-icon">
                <span class="input-icon">📧</span>
                <input type="email" id="update-email" value="${currentUserData.email}" placeholder="Nhập email" />
              </div>
              <span id="error-update-email" class="error-msg"></span>
            </div>
  
            <div class="form-group">
              <label for="update-phone">Số điện thoại</label>
              <div class="input-with-icon">
                <span class="input-icon">📱</span>
                <input type="tel" id="update-phone" value="${currentUserData.phone}" placeholder="Nhập số điện thoại" />
              </div>
              <span id="error-update-phone" class="error-msg"></span>
            </div>
  
            <div class="form-group">
              <label for="update-address">Địa chỉ</label>
              <div class="input-with-icon">
                <span class="input-icon">📍</span>
                <input type="text" id="update-address" value="${currentUserData.address}" placeholder="Nhập địa chỉ" />
              </div>
              <span id="error-update-address" class="error-msg"></span>
            </div>
  
            <button type="submit" class="btn-auth-submit">Cập nhật</button>
          </form>
        </div>
      </div>
    `;
  
    // Thêm modal vào body
    const existingModal = document.getElementById('updateProfileModal');
    if (existingModal) {
      existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
  
    // Gắn sự kiện submit
    document.getElementById('update-profile-form').addEventListener('submit', handleUpdateProfile);
  }
  
  // Đóng modal cập nhật thông tin
  function closeUpdateProfileModal() {
    const modal = document.getElementById('updateProfileModal');
    if (modal) {
      modal.remove();
    }
    document.body.style.overflow = 'auto';
  }
  
  // Xử lý cập nhật thông tin
  function handleUpdateProfile(e) {
    e.preventDefault();
  
    const fullName = document.getElementById('update-fullname').value.trim();
    const email = document.getElementById('update-email').value.trim();
    const phone = document.getElementById('update-phone').value.trim();
    const address = document.getElementById('update-address').value.trim();
  
    // Clear errors
    document.querySelectorAll('#updateProfileModal .error-msg').forEach(el => el.textContent = '');
  
    let hasError = false;
  
    if (!fullName) {
      document.getElementById('error-update-fullname').textContent = 'Vui lòng nhập họ tên';
      hasError = true;
    }
  
    if (!email) {
      document.getElementById('error-update-email').textContent = 'Vui lòng nhập email';
      hasError = true;
    } else if (!validateEmail(email)) {
      document.getElementById('error-update-email').textContent = 'Email không hợp lệ';
      hasError = true;
    }
  
    if (!phone) {
      document.getElementById('error-update-phone').textContent = 'Vui lòng nhập số điện thoại';
      hasError = true;
    } else if (!validatePhone(phone)) {
      document.getElementById('error-update-phone').textContent = 'Số điện thoại phải có 10 chữ số';
      hasError = true;
    }
  
    if (!address) {
      document.getElementById('error-update-address').textContent = 'Vui lòng nhập địa chỉ';
      hasError = true;
    }
  
    if (hasError) return;
  
    // Cập nhật thông tin
    const currentUser = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('bs_users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
  
    if (userIndex !== -1) {
      users[userIndex].fullName = fullName;
      users[userIndex].email = email;
      users[userIndex].phone = phone;
      users[userIndex].address = address;
  
      localStorage.setItem('bs_users', JSON.stringify(users));
  
      // Cập nhật bs_user
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
  
  // Đăng xuất từ dropdown
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
  
  // Hàm bổ sung để cập nhật khu vực đăng nhập/profile trong header
  function updateAuthUI() {
    const authArea = document.getElementById('authArea');
    const userStr = localStorage.getItem('bs_user');
  
    if (authArea) {
      if (userStr) {
        // Đã đăng nhập - Hiển thị dropdown menu
        const user = JSON.parse(userStr);
        const firstName = user.fullName.split(' ').slice(-1)[0]; // Lấy tên cuối
        
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
        // Chưa đăng nhập (Giao diện mặc định từ HTML)
        authArea.innerHTML = `
          <button class="btn-auth" onclick="openLoginModal()">Đăng nhập</button>
          <button class="btn-auth btn-signup" onclick="openRegisterModal()">
            Đăng ký
          </button>
          <a href="cart.html" class="cart cart-badge">Giỏ hàng <span>0</span></a>
        `;
      }
    }
    // Cập nhật số lượng giỏ hàng
    updateCartCount();
  }
  
  // ==================== KHỞI TẠO ====================
  
  // Chạy hàm này khi toàn bộ DOM đã tải xong để kiểm tra trạng thái đăng nhập
  document.addEventListener('DOMContentLoaded', updateAuthUI);
  
  // Gắn sự kiện submit cho form đăng nhập và đăng ký
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
  });