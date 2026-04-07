<?php
session_start();
require_once 'includes/db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM tk_users WHERE username = '$username'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        
        if (password_verify($password, $user['password']) || $password == $user['password']) {
            if ($user['status'] == 'locked') {
                echo "<script>alert('Tài khoản của bạn đã bị khóa!'); window.history.back();</script>";
            } else {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['fullname'] = $user['fullname'];
                
                // Chỉ sử dụng Session PHP
                echo "<script>
                    alert('Đăng nhập thành công!'); 
                    window.location.href='index.php';
                </script>";
            }
        } else {
            echo "<script>alert('Sai mật khẩu!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Tài khoản không tồn tại!'); window.history.back();</script>";
    }
}
?>