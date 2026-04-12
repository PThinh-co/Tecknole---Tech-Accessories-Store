<?php
session_start();
require_once '../../includes/db.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Lấy dữ liệu từ JSON input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    // Thử lấy từ $_POST nếu không phải JSON
    $input = $_POST;
}

$newPass = isset($input['new_password']) ? $input['new_password'] : '';

if (strlen($newPass) < 6) {
    echo json_encode(['success' => false, 'message' => 'Mật khẩu phải từ 6 ký tự trở lên.']);
    exit;
}

// Cập nhật cho admin hiện tại đang đăng nhập
$adminUsername = $_SESSION['admin_username'];
$stmt = mysqli_prepare($conn, "UPDATE tk_users SET password = ? WHERE role = 'admin' AND username = ?");
mysqli_stmt_bind_param($stmt, "ss", $newPass, $adminUsername);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Đã đổi mật khẩu thành công.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi database: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
