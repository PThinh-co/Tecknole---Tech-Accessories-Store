<?php
session_start();
require_once '../../includes/db.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) ? (int)$input['id'] : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID không hợp lệ.']);
    exit;
}

$newPass = isset($input['new_password']) ? trim($input['new_password']) : '';

if (strlen($newPass) < 6) {
    echo json_encode(['success' => false, 'message' => 'Mật khẩu mới phải có ít nhất 6 ký tự.']);
    exit;
}

$stmt = mysqli_prepare($conn, "UPDATE tk_users SET password = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "si", $newPass, $id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Đã thay đổi mật khẩu của người dùng thành công.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi database: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
