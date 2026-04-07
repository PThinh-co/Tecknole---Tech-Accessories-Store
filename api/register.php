<?php
session_start();
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

$fullname = mysqli_real_escape_string($conn, $_POST['fullname'] ?? '');
$username = mysqli_real_escape_string($conn, $_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
$email = mysqli_real_escape_string($conn, $_POST['email'] ?? '');
$phone = mysqli_real_escape_string($conn, $_POST['phone'] ?? '');
$address = mysqli_real_escape_string($conn, $_POST['address'] ?? '');

if (empty($fullname) || empty($username) || empty($password) || empty($email) || empty($phone) || empty($address)) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin']);
    exit;
}

// Kiểm tra username hoặc email đã tồn tại
$check = mysqli_query($conn, "SELECT username, email FROM tk_users WHERE username = '$username' OR email = '$email'");
if (mysqli_num_rows($check) > 0) {
    $existing = mysqli_fetch_assoc($check);
    if ($existing['username'] === $username) {
        echo json_encode(['success' => false, 'message' => 'Tên đăng nhập đã tồn tại']);
    }
    else {
        echo json_encode(['success' => false, 'message' => 'Email đã được sử dụng']);
    }
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO tk_users (fullname, username, password, email, phone, address, role, created_at) 
        VALUES ('$fullname', '$username', '$hashed_password', '$email', '$phone', '$address', 'user', NOW())";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true, 'message' => 'Đăng ký thành công']);
}
else {
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . mysqli_error($conn)]);
}
?>
