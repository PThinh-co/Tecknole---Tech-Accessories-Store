// ==========================================
// XỬ LÝ ĐĂNG NHẬP - login.js
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  // Nếu đã đăng nhập thì chuyển về trang chủ
  if (isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const loginForm = document.querySelector('form');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Validate
    if (!username || !password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Lấy danh sách users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm user (có thể đăng nhập bằng username hoặc email)
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );

    if (!user) {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
      return;
    }

    // Đăng nhập thành công
    // Lưu thông tin user (không lưu password)
    const userInfo = {
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userInfo));

    alert('Đăng nhập thành công!');
    
    // Chuyển về trang trước đó hoặc trang chủ
    const returnUrl = sessionStorage.getItem('returnUrl') || 'index.html';
    sessionStorage.removeItem('returnUrl');
    window.location.href = returnUrl;
  });
});