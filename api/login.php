<?php
session_start();
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

$username = mysqli_real_escape_string($conn, $_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin']);
    exit;
}

$sql = "SELECT * FROM tk_users WHERE username = '$username'";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    // Hỗ trợ cả mật khẩu đã hash và chưa hash (tùy thuộc vào dữ liệu cũ)
    if (password_verify($password, $user['password']) || $password === $user['password']) {
        if ($user['status'] === 'locked') {
            echo json_encode(['success' => false, 'message' => 'Tài khoản của bạn đã bị khóa']);
        } else {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['fullname'] = $user['fullname'];
            $_SESSION['role'] = $user['role'];
            
            // Trả về dữ liệu user để JS update UI
            echo json_encode([
                'success' => true, 
                'user' => [
                    'username' => $user['username'],
                    'fullName' => $user['fullname'],
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                    'address' => $user['address'],
                    'role' => $user['role']
                ]
            ]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Sai mật khẩu']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Tài khoản không tồn tại']);
}
?>
