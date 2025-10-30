document.addEventListener('DOMContentLoaded', function() {
  // Nếu đã đăng nhập thì chuyển về trang chủ
  if (window.isLoggedIn()) { // SỬA: window.isLoggedIn
    window.location.href = 'index.html';
    return;
  }

  const registerForm = document.querySelector('form');
  
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // === VALIDATE (giữ nguyên) ===
    if (!fullname || !email || !username || !password || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ!');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      alert('Username phải từ 3-20 ký tự và chỉ chứa chữ cái, số hoặc dấu gạch dưới!');
      return;
    }

    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.username === username)) {
      alert('Tên đăng nhập đã tồn tại!');
      return;
    }

    if (users.find(u => u.email === email)) {
      alert('Email đã được đăng ký!');
      return;
    }

    const newUser = {
      fullname: fullname,
      email: email,
      username: username,
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // === CẬP NHẬT UI (TÙY CHỌN) ===
    if (typeof window.updateHeaderUI === 'function') {
      window.updateHeaderUI();
    }

    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    window.location.href = 'login.html';
  });
});