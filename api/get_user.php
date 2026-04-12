<?php
session_start();
require_once '../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT id, username, fullname, email, phone, address, role, status FROM tk_users WHERE id = $user_id";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    
    // Kiểm tra nếu tài khoản bị khóa
    if ($user['status'] === 'locked') {
        session_destroy();
        echo json_encode(['success' => false, 'message' => 'Tài khoản hiện đang bị khóa', 'locked' => true]);
        exit;
    }

    // Đồng bộ tên field với JS (fullName thay vì fullname)
    $user['fullName'] = $user['fullname']; 
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy người dùng']);
}
?>
