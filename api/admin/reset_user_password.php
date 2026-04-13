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

// Kiểm tra quyền hạn (Role check)
$targetRes = $conn->query("SELECT role FROM tk_users WHERE id = $id");
$targetUser = $targetRes->fetch_assoc();
if (!$targetUser) {
    exit(json_encode(['success' => false, 'message' => 'Người dùng không tồn tại.']));
}

$myRole = $_SESSION['admin_role'] ?? 'admin';
$targetRole = $targetUser['role'];

// Bảo vệ Super Admin
if ($targetRole === 'super_admin') {
    exit(json_encode(['success' => false, 'message' => 'Hệ thống bảo vệ: Không thể tác động lên tài khoản Tối cao.']));
}

// Nếu là Admin thường thì không được tác động lên Admin khác
if ($myRole === 'admin' && $targetRole === 'admin') {
    exit(json_encode(['success' => false, 'message' => 'Hệ thống bảo vệ: Bạn không có quyền tác động lên Quản trị viên khác.']));
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
