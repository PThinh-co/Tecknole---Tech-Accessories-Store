
// ==================== HÀM MỚI ĐỂ KIỂM TRA KHÓA ====================
function checkUserLockStatus() {
  return;
}
// ==================== KẾT THÚC HÀM MỚI ====================


// ==================== MODAL FUNCTIONS ====================

function requireLogin() {
  if (!window.currentUserData) {
    openLoginModal();
    return false;
  }
  return true;
}

// 2. Định dạng tiền tệ
function formatVND(price) {
  if (typeof price !== 'number') price = parseFloat(price) || 0;
  return price.toLocaleString('vi-VN') + 'đ';
}

// 3. Lấy thông tin User hiện tại (từ biến toàn cục đã được populate bởi checkLoginSession)
function getCurrentUser() {
  return window.currentUserData || null;
}



// ==================== CART FUNCTIONS ====================
// ... (Hàm getCart, saveCart, clearCart, updateCartCount giữ nguyên) ...
// --- CART FUNCTIONS (Đồng bộ với api/update_cart.php) ---

function getCart() {

  return []; // Trả về rỗng để ép các UI dùng cơ chế render mới từ Session
}

function saveCart(cart) {
  // Các lệnh thêm/xóa đã được chuyển sang gọi api/add_to_cart.php
}

function clearCart() {
  let formData = new FormData();
  formData.append('action', 'clear');
  fetch('api/update_cart.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        updateCartCount();
      }
    });
}

function updateCartCount() {
  const cartCountSpan = document.querySelector('.cart-badge span');
  if (!cartCountSpan) return;

  // Fetch số lượng từ Session thay vì đọc localStorage
  fetch('api/update_cart.php', { method: 'POST', body: new FormData() }) // Request rỗng để lấy dữ liệu hiện tại
    .then(res => res.json())
    .then(data => {
      cartCountSpan.textContent = data.cart_count || 0;
    });
}

function globalAddToCart(productId, quantity = 1) {
  let formData = new FormData();
  formData.append('product_id', productId);
  formData.append('quantity', quantity);

  fetch('api/add_to_cart.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        updateCartCount();
        const goToCart = confirm('✅ Đã thêm sản phẩm vào giỏ hàng!\nBạn có muốn xem giỏ hàng ngay không?');
        if (goToCart) {
          window.location.href = 'cart.php';
        }
      } else {
        if (data.message === 'Chưa đăng nhập') {
          alert('🔒 Vui lòng đăng nhập để mua hàng.');
          openLoginModal();
        } else {
          alert('⚠️ ' + data.message);
        }
      }
    })
    .catch(err => {
      console.error('Lỗi thêm giỏ hàng:', err);
      alert('Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.');
    });
}

function globalRemoveFromCart(productId) {
  if (!confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
  let formData = new FormData();
  formData.append('action', 'remove');
  formData.append('product_id', productId);

  fetch('api/update_cart.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        updateCartCount();
        if (window.location.pathname.includes('cart.php')) location.reload();
      }
    });
}

// Delegated Click Listener cho các nút giỏ hàng toàn trang
document.addEventListener('click', function (e) {
  // Nút Thêm vào giỏ
  const addBtn = e.target.closest('.add-to-cart');
  if (addBtn && !addBtn.hasAttribute('onclick')) {
    e.preventDefault();
    const pid = addBtn.getAttribute('data-id') || addBtn.closest('[data-id]')?.getAttribute('data-id');
    const qtyInput = document.getElementById('quantity');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    if (pid) globalAddToCart(pid, qty);
  }

  // Nút Xóa khỏi giỏ
  const removeBtn = e.target.closest('.btn-remove');
  if (removeBtn && !removeBtn.hasAttribute('onclick')) {
    e.preventDefault();
    const pid = removeBtn.getAttribute('data-id') || removeBtn.closest('[data-id]')?.getAttribute('data-id');
    if (pid) globalRemoveFromCart(pid);
  }
});



// ==================== MODAL LOGIN/REGISTER ====================
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

  // Load provinces for registration
  const pSel = document.getElementById('reg-province');
  if (pSel && pSel.options.length <= 1) {
    pSel.innerHTML = '<option value="">Chọn...</option>';
    fetch('api/get_provinces.php').then(r => r.json()).then(data => {
      if (data.success) {
        pSel.innerHTML = '<option value="">Chọn Tỉnh/Thành</option>' +
          data.provinces.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      }
    });
  }
}
// Add listener for reg-province
document.addEventListener('change', function (e) {
  if (e.target && e.target.id === 'reg-province') {
    const pId = e.target.value;
    const wSel = document.getElementById('reg-ward');
    if (pId) {
      wSel.disabled = true; wSel.innerHTML = '<option>Đang tải...</option>';
      fetch(`api/get_wards.php?province_id=${pId}`).then(r => r.json()).then(data => {
        wSel.innerHTML = '<option value="">Chọn Phường/Xã</option>' +
          data.wards.map(w => `<option value="${w.name}">${w.name}</option>`).join('');
        wSel.disabled = false;
      });
    } else {
      wSel.disabled = true; wSel.innerHTML = '<option value="">Chọn Tỉnh/Thành trước</option>';
    }
  }
});
function closeRegisterModal() {
  document.getElementById('registerModal').classList.remove('show');
  document.body.style.overflow = 'auto';
  clearFormErrors();
}
function openProfileModal() {
  const user = window.currentUserData;
  if (!user) {
    openLoginModal();
    return;
  }
  document.getElementById('profile-fullname').textContent = 'Xin chào, ' + (user.fullName || user.fullname) + '!';
  document.getElementById('profile-name-value').textContent = (user.fullName || user.fullname);
  document.getElementById('profile-username-value').textContent = user.username;
  document.getElementById('profile-email-value').textContent = user.email;
  document.getElementById('profile-phone-value').textContent = user.phone;
  document.getElementById('profile-address-value').textContent = user.address || 'Chưa cập nhật';
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

// Xử lý đăng nhập
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  clearFormErrors();
  if (!username || !password) {
    if (!username) document.getElementById('error-login-username').textContent = 'Vui lòng nhập tài khoản';
    if (!password) document.getElementById('error-login-password').textContent = 'Vui lòng nhập mật khẩu';
    return;
  }

  let formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  fetch('api/login.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.currentUserData = data.user;
        closeLoginModal();
        alert('Đăng nhập thành công!');
        updateAuthUI();
        // Nếu đang ở trang checkout, hãy load lại data
        if (typeof initCheckoutData === 'function') initCheckoutData();
      } else {
        alert('❌ ' + data.message);
      }
    })
    .catch(err => console.error('Lỗi đăng nhập:', err));
}

// Xử lý đăng ký
function handleRegister(e) {
  e.preventDefault();
  const fullname = document.getElementById('reg-fullname').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();

  const street = document.getElementById('reg-street').value.trim();
  const pSel = document.getElementById('reg-province');
  const provinceName = pSel.selectedIndex > 0 ? pSel.options[pSel.selectedIndex].text : "";
  const wardName = document.getElementById('reg-ward').value;

  const address = (street && wardName && provinceName) ? `${street}, ${wardName}, ${provinceName}` : "";

  clearFormErrors();
  let hasError = false;

  if (!fullname) { document.getElementById('error-fullname').textContent = 'Vui lòng nhập họ tên'; hasError = true; }
  if (!username) { document.getElementById('error-username').textContent = 'Vui lòng nhập tên tài khoản'; hasError = true; }
  if (!password) {
    document.getElementById('error-password').textContent = 'Vui lòng nhập mật khẩu'; hasError = true;
  } else if (password.length < 6) {
    document.getElementById('error-password').textContent = 'Mật khẩu phải từ 6 ký tự trở lên'; hasError = true;
  }

  const confirmPassword = document.getElementById('reg-confirm-password').value;
  if (password !== confirmPassword) {
    document.getElementById('error-confirm-password').textContent = 'Mật khẩu nhập lại không khớp';
    hasError = true;
  }

  if (!email) {
    document.getElementById('error-email').textContent = 'Vui lòng nhập email'; hasError = true;
  } else if (!validateEmail(email)) {
    document.getElementById('error-email').textContent = 'Email không đúng định dạng'; hasError = true;
  }

  if (!phone) {
    document.getElementById('error-phone').textContent = 'Vui lòng nhập số điện thoại'; hasError = true;
  } else if (!validatePhone(phone)) {
    document.getElementById('error-phone').textContent = 'Số điện thoại phải có 10 chữ số'; hasError = true;
  }

  if (!address) { document.getElementById('error-address').textContent = 'Vui lòng nhập địa chỉ'; hasError = true; }

  if (hasError) return;

  let formData = new FormData();
  formData.append('fullname', fullname);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('address', address);

  fetch('api/register.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        closeRegisterModal();
        switchToLogin();
      } else {
        // Nếu server báo lỗi (VD: trùng email), hiển thị lỗi vào form luôn
        if (data.message.includes('tài khoản')) document.getElementById('error-username').textContent = data.message;
        else if (data.message.includes('email')) document.getElementById('error-email').textContent = data.message;
        else alert('⚠️ ' + data.message);
      }
    })
    .catch(err => console.error('Lỗi đăng ký:', err));
}

// Đăng xuất từ modal
function handleLogoutModal() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    // Chuyển hướng đến logout.php để xóa session/giỏ hàng phía server
    window.location.href = 'logout.php';
  }
}

// ==================== USER DROPDOWN MENU ====================

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
  fetch('api/get_user.php')
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        openLoginModal();
        return;
      }
      const user = data.user;
      const dropdown = document.getElementById('userDropdownMenu');
      if (dropdown) dropdown.classList.remove('show');

      const modalHTML = `
          <div id="accountInfoModal" class="auth-modal show">
            <div class="auth-modal-overlay" onclick="closeAccountInfoModal()"></div>
            <div class="auth-modal-content">
              <button class="auth-modal-close" onclick="closeAccountInfoModal()">&times;</button>
              <div class="auth-modal-header">
                <div class="profile-avatar-small">👤</div>
                <h2>Xin chào, ${user.fullname}!</h2>
                <p>Thông tin tài khoản của bạn</p>
              </div>
              <div class="profile-info-modal">
                <div class="info-row"><span class="info-label">Họ và tên:</span><span class="info-value">${user.fullname}</span></div>
                <div class="info-row"><span class="info-label">Tài khoản:</span><span class="info-value">${user.username}</span></div>
                <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${user.email}</span></div>
                <div class="info-row"><span class="info-label">Số điện thoại:</span><span class="info-value">${user.phone}</span></div>
                <div class="info-row"><span class="info-label">Địa chỉ:</span><span class="info-value">${user.address || 'Chưa cập nhật'}</span></div>
              </div>
              <div class="auth-modal-form">
                <button type="button" class="btn-auth-submit" onclick="openUpdateProfileModal()">Điều chỉnh thông tin</button>
                <button type="button" class="btn-auth-submit" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); margin-top: 0;" onclick="handleLogout()">Đăng xuất</button>
              </div>
            </div>
          </div>
        `;
      const existingModal = document.getElementById('accountInfoModal');
      if (existingModal) existingModal.remove();
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      document.body.style.overflow = 'hidden';
    });
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
    // Chuyển hướng đến logout.php để xóa session/giỏ hàng phía server
    window.location.href = 'logout.php';
  }
}
function openUpdateProfileModal() {
  closeAccountInfoModal();
  const user = window.currentUserData;
  if (!user) {
    openLoginModal();
    return;
  }
  const dropdown = document.getElementById('userDropdownMenu');
  if (dropdown) dropdown.classList.remove('show');
  const modalHTML = `
  <div id="updateProfileModal" class="auth-modal show">
    <div class="auth-modal-overlay" onclick="closeUpdateProfileModal()"></div>
    <div class="auth-modal-content">
      <button class="auth-modal-close" onclick="closeUpdateProfileModal()">&times;</button>
    <div class="auth-modal-header">
        <h2>Cập nhật thông tin</h2>
        <p>Cập nhật thông tin cá nhân của bạn để trải nghiệm tốt hơn.</p>
      </div>
      <form id="update-profile-form" class="auth-modal-form">
        <div class="form-group"><label>Họ và tên</label><input type="text" id="update-fullname" value="${user.fullName || user.fullname}" placeholder="Nhập họ và tên" /><span id="error-update-fullname" class="error-msg"></span></div>
        <div class="form-group"><label>Email</label><input type="email" id="update-email" value="${user.email}" placeholder="Nhập email" /><span id="error-update-email" class="error-msg"></span></div>
        <div class="form-group"><label>Số điện thoại</label><input type="tel" id="update-phone" value="${user.phone}" placeholder="Nhập số điện thoại" /><span id="error-update-phone" class="error-msg"></span></div>
        <div class="form-group"><label>Tỉnh/Thành phố</label><select id="update-province"><option value="">Chọn Tỉnh/Thành</option></select></div>
        <div class="form-group"><label>Phường/Xã</label><select id="update-ward" disabled><option value="">Chọn phường/xã</option></select></div>
        <div class="form-group full-width"><label>Số nhà, tên đường</label><input type="text" id="update-street" placeholder="Nhập số nhà, tên đường" /><span id="error-update-address" class="error-msg"></span></div>
        <button type="submit" class="btn-auth-submit">Cập nhật ngay</button>
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

  // --- Logic Split Địa chỉ cũ ---
  // Giả sử address lưu dạng: "Số nhà, Phường, Tỉnh"
  const addrParts = (user.address || "").split(",").map(s => s.trim());
  const oldStreet = addrParts[0] || "";
  const oldWard = addrParts[1] || "";
  const oldProv = addrParts[2] || "";
  if (oldStreet) document.getElementById('update-street').value = oldStreet;

  // Load Provinces
  fetch('api/get_provinces.php').then(r => r.json()).then(data => {
    const pSel = document.getElementById('update-province');
    pSel.innerHTML = '<option value="">Chọn Tỉnh/Thành</option>' +
      data.provinces.map(p => `<option value="${p.id}" ${p.name == oldProv ? 'selected' : ''}>${p.name}</option>`).join('');

    // Nếu có tỉnh cũ, load luôn xã/phường
    const selectedProvId = pSel.value;
    if (selectedProvId) {
      _loadUpdateWards(selectedProvId, oldWard);
    }
  });

  document.getElementById('update-province').addEventListener('change', function () {
    _loadUpdateWards(this.value);
  });

  function _loadUpdateWards(pId, selectName = "") {
    const wSel = document.getElementById('update-ward');
    wSel.disabled = true; wSel.innerHTML = '<option>Đang tải...</option>';
    fetch(`api/get_wards.php?province_id=${pId}`).then(r => r.json()).then(data => {
      wSel.innerHTML = '<option value="">Chọn Phường/Xã</option>' +
        data.wards.map(w => `<option value="${w.name}" ${w.name == selectName ? 'selected' : ''}>${w.name}</option>`).join('');
      wSel.disabled = false;
    });
  }

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

  const street = document.getElementById('update-street').value.trim();
  const pSel = document.getElementById('update-province');
  const provinceName = pSel.selectedIndex > 0 ? pSel.options[pSel.selectedIndex].text : "";
  const wardName = document.getElementById('update-ward').value;

  const fullAddress = street && wardName && provinceName ? `${street}, ${wardName}, ${provinceName}` : "";

  document.querySelectorAll('#updateProfileModal .error-msg').forEach(el => el.textContent = '');
  let hasError = false;
  if (!fullName) { document.getElementById('error-update-fullname').textContent = 'Vui lòng nhập họ tên'; hasError = true; }
  if (!email) { document.getElementById('error-update-email').textContent = 'Vui lòng nhập email'; hasError = true; } else if (!validateEmail(email)) { document.getElementById('error-update-email').textContent = 'Email không hợp lệ'; hasError = true; }
  if (!phone) { document.getElementById('error-update-phone').textContent = 'Vui lòng nhập số điện thoại'; hasError = true; } else if (!validatePhone(phone)) { document.getElementById('error-update-phone').textContent = 'Số điện thoại phải có 10 chữ số'; hasError = true; }
  if (!fullAddress) { document.getElementById('error-update-address').textContent = 'Vui lòng chọn đầy đủ địa chỉ'; hasError = true; }
  if (hasError) return;

  let formData = new FormData();
  formData.append('fullname', fullName);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('address', fullAddress);

  fetch('api/update_profile.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Cập nhật thông tin thành công!');
        closeUpdateProfileModal();
        updateAuthUI();
      } else {
        alert('Lỗi: ' + data.message);
      }
    });
}

function handleLogout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    window.location.href = 'logout.php';
  }
}


// ==================== CẬP NHẬT GIAO DIỆN XÁC THỰC ====================
function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  fetch('api/get_user.php')
    .then(res => res.json())
    .then(data => {
      window.currentUserData = data.success ? data.user : null;
      _renderAuthArea(authArea);
      // Phát sự kiện để các script khác biết auth đã sẵn sàng
      window.dispatchEvent(new CustomEvent('userAuthLoaded', { detail: window.currentUserData }));
    })
    .catch(() => {
      window.currentUserData = null;
      _renderAuthArea(authArea);
      window.dispatchEvent(new CustomEvent('userAuthLoaded', { detail: null }));
    });
}

function _renderAuthArea(authArea) {
  const user = window.currentUserData;
  if (authArea) {
    if (user) {
      const firstName = (user.fullName || user.fullname) ? (user.fullName || user.fullname).split(' ').slice(-1)[0] : 'Bạn';
      authArea.innerHTML = `
      <div class="user-dropdown-container">
        <button class="btn-profile" onclick="toggleUserDropdown(event)">
          <span class="user-avatar"><i class="bi bi-person-circle"></i></span>
          <span class="user-name">Xin chào, ${firstName}</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div class="dropdown-header">
            <div class="user-avatar-large"><i class="bi bi-person-circle"></i></div>
            <div class="user-info">
              <div class="user-fullname">${user.fullName || user.fullname}</div>
              <div class="user-email">${user.email}</div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <a href="user_cart.php" class="dropdown-item">
            <span class="dropdown-icon"><i class="bi bi-bag-heart"></i></span>
            <span>Lịch sử mua hàng</span>
          </a>
          <button class="dropdown-item" onclick="openAccountInfoModal()">
            <span class="dropdown-icon"><i class="bi bi-person-circle"></i></span>
            <span>Thông tin tài khoản</span>
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onclick="handleLogout()" style="color: #e74c3c;">
            <span class="dropdown-icon"></span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      <a href="cart.php" class="cart cart-badge">Giỏ hàng <span>0</span></a>
    `;
    } else {
      authArea.innerHTML = `
      <button class="btn-auth" onclick="openLoginModal()">Đăng nhập</button>
      <button class="btn-auth btn-signup" onclick="openRegisterModal()">
        Đăng ký
      </button>
      <a href="cart.php" class="cart cart-badge">Giỏ hàng <span>0</span></a>
    `;
    }
  }
  updateCartCount();
}

// ==================== CẬP NHẬT KHỞI TẠO ====================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', handleRegister);

  checkUserLockStatus();
  updateAuthUI(); // updateAuthUI đã gọi updateCartCount bên trong
  syncAllCategories();
});

// =========================================================
// === CODE ĐỒNG BỘ TẤT CẢ DANH MỤC (Phục hồi) ===
// =========================================================

function getSyncedCategories() {
  const defaultCategories = [
    { id: 1, name: 'Màn hình', type: 'manhinh' },
    { id: 2, name: 'Bàn phím', type: 'banphim' },
    { id: 3, name: 'Chuột', type: 'chuot' },
    { id: 4, name: 'Tai nghe', type: 'tainghe' },
    { id: 5, name: 'Loa', type: 'loa' }
  ];
  return defaultCategories;
}

function populateCategorySelects(categories) {
  const selectDropdowns = document.querySelectorAll(
    'select[name="type"], #filter-type'
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
    li.innerHTML = `<a href="products.php?type=${cat.type}">${cat.name}</a>`;
    navMenu.appendChild(li);
  });
}

function syncAllCategories() {
  fetch('api/get_categories.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        populateCategorySelects(data.categories);
        populateCategoryNavMenu(data.categories);
      }
    })
    .catch(err => console.error('Lỗi sync danh mục:', err));
}

// Tự động cập nhật nếu admin thay đổi
window.addEventListener('adminDataChanged', syncAllCategories);