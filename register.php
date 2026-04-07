<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once 'includes/db.php';

    // Lấy dữ liệu
    $fullname = trim($_POST['fullname']);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);

    if (empty($fullname) || empty($username) || empty($password) || empty($email) || empty($phone)) {
        echo "<script>alert('Vui lòng điền đầy đủ thông tin!'); window.history.back();</script>";
        exit;
    }

    // Kiểm tra username hoặc email đã tồn tại
    $check_query = "SELECT username, email FROM tk_users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $check_result = $stmt->get_result();

    if ($check_result->num_rows > 0) {
        $existing = $check_result->fetch_assoc();
        if ($existing['username'] === $username) {
            echo "<script>alert('Tên đăng nhập đã tồn tại!'); window.history.back();</script>";
        }
        else {
            echo "<script>alert('Email đã được sử dụng!'); window.history.back();</script>";
        }
    }
    else {
        // Mã hóa mật khẩu
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Lưu vào Database (Chuẩn với bảng tk_users)
        $sql = "INSERT INTO tk_users (fullname, username, password, email, phone, role, created_at) 
                VALUES (?, ?, ?, ?, ?, 'user', NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $fullname, $username, $hashed_password, $email, $phone);

        if ($stmt->execute()) {
            echo "<script>alert('🎉 Đăng ký thành công! Vui lòng đăng nhập.'); window.location.href='index.php';</script>";
        }
        else {
            error_log("Lỗi SQL: " . $stmt->error);
            echo "<script>alert('Lỗi hệ thống! Vui lòng thử lại sau.'); window.history.back();</script>";
        }
    }
}
?>