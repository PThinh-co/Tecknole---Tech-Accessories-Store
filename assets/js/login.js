document.addEventListener('DOMContentLoaded', function() {
  // Nếu đã đăng nhập thì chuyển về trang chủ
  if (isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const loginForm = document.querySelector('form');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );

    if (!user) {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
      return;
    }

    const userInfo = {
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userInfo));

    // CẬP NHẬT GIAO DIỆN NGAY TRƯỚC KHI CHUYỂN TRANG
    window.updateHeaderUI(); // DÒNG QUAN TRỌNG

    alert('Đăng nhập thành công!');
    
    const returnUrl = sessionStorage.getItem('returnUrl') || 'index.html';
    sessionStorage.removeItem('returnUrl');
    window.location.href = returnUrl;
  });
});