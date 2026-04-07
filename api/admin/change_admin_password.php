<?php
session_start();
require_once '../../includes/db.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_encode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST; // Fallback

// Lấy dữ liệu từ JSON input
$input = json_decode(file_get_contents('php://input'), true);
$newPass = isset($input['new_password']) ? $input['new_password'] : '';

if (strlen($newPass) < 6) {
    echo json_encode(['success' => false, 'message' => 'Mật khẩu phải từ 6 ký tự trở lên.']);
    exit;
}

// Cập nhật cho user mang role 'admin'
// Lưu ý: Ở đây ta cập nhật cho user 'admin' mặc định của hệ thống
$stmt = mysqli_prepare($conn, "UPDATE tk_users SET password = ? WHERE role = 'admin' AND username = 'admin'");
mysqli_stmt_bind_param($stmt, "s", $newPass);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Đã đổi mật khẩu thành công.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi database: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
