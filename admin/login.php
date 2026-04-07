<?php
session_start();
// Nếu đã đăng nhập admin rồi thì vào thẳng dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>ĐĂNG NHẬP QUẢN TRỊ - Tecknole</title>
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/style.css" />
    <link rel="stylesheet" href="assets/bootstrap-icons-1.13.1/bootstrap-icons.min.css" />
    <style>
        .error-msg { color: #ff4d4d; font-size: 13px; margin-top: 5px; display: block; }
    </style>
</head>
<body>

<div class="login-container">
    <div class="login-box">
        <h2><i class="bi bi-gear-fill"></i> ĐĂNG NHẬP QUẢN TRỊ</h2>
        <form id="adminLoginForm">
            <div class="form-group">
                <label><i class="bi bi-person-circle"></i> Tài khoản </label>
                <input type="text" id="admin-username" name="username" required placeholder="Nhập tài khoản admin" />
                <span id="error-username" class="error-msg"></span>
            </div>
            <div class="form-group">
                <label><i class="bi bi-key-fill"></i> Mật khẩu</label>
                <input type="password" id="admin-password" name="password" required placeholder="••••••••" />
                <span id="error-password" class="error-msg"></span>
            </div>
            <button type="submit" class="btn-login" id="btnLogin">Đăng nhập</button>
        </form>
    </div>
</div>

<script>
document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    const btn = document.getElementById('btnLogin');
    const errorU = document.getElementById('error-username');
    const errorP = document.getElementById('error-password');

    errorU.textContent = '';
    errorP.textContent = '';

    if(!username || !password) return;

    btn.disabled = true;
    btn.textContent = 'Đang kiểm tra...';

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('../api/admin/login.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            // Lưu thông tin admin vào localStorage để JS cũ vẫn chạy được (nếu cần)
            localStorage.setItem('admin_logged_in_user', JSON.stringify(data.user));
            window.location.href = 'index.php';
        } else {
            if (data.message.includes('tài khoản')) errorU.textContent = data.message;
            else if (data.message.includes('mật khẩu')) errorP.textContent = data.message;
            else alert(data.message);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Đăng nhập';
    }
});
</script>

</body>
</html>
