// ==================== MODAL FUNCTIONS ====================

// Mở modal đăng nhập
function openLoginModal() {
  document.getElementById('loginModal').classList.add('show');
  document.body.style.overflow = 'hidden'; // Ngăn scroll body
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

// Mở modal profile
function openProfileModal() {
  const userStr = localStorage.getItem('bs_user');
  if (!userStr) {
    openLoginModal();
    return;
  }
  
  const user = JSON.parse(userStr);
  document.getElementById('profile-fullname').textContent = 'Xin chào, ' + user.fullName + '!';
  document.getElementById('profile-name-value').textContent = user.fullName;
  document.getElementById('profile-username-value').textContent = user.username;
  document.getElementById('profile-email-value').textContent = user.email;
  document.getElementById('profile-phone-value').textContent = user.phone;
  document.getElementById('profile-address-value').textContent = user.address;
  
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