<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['status'])) {
    exit(json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']));
}

$id = (int)$data['id'];
$newStatus = mysqli_real_escape_string($conn, $data['status']);

// Lấy role của người bị tác động
$targetRes = $conn->query("SELECT role FROM tk_users WHERE id = $id");
$targetUser = $targetRes->fetch_assoc();
if (!$targetUser) {
    exit(json_encode(['success' => false, 'message' => 'Người dùng không tồn tại.']));
}

$myRole = $_SESSION['admin_role'] ?? 'admin';
$targetRole = $targetUser['role'];

// Bảo vệ Super Admin: Không ai có thể tác động
if ($targetRole === 'super_admin') {
    exit(json_encode(['success' => false, 'message' => 'Hệ thống bảo vệ: Không thể tác động lên tài khoản Tối cao.']));
}

// Nếu là Admin thường thì không được tác động lên Admin khác
if ($myRole === 'admin' && $targetRole === 'admin') {
    exit(json_encode(['success' => false, 'message' => 'Hệ thống bảo vệ: Bạn không có quyền tác động lên Quản trị viên khác.']));
}

// Không cho phép tự khóa chính mình
if ($id == ($_SESSION['admin_user_id'] ?? 0)) {
    exit(json_encode(['success' => false, 'message' => 'Bạn không thể tự khóa tài khoản của chính mình.']));
}

$sql = "UPDATE tk_users SET status = '$newStatus' WHERE id = $id";

if ($conn->query($sql)) {
    if ($conn->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái thành công.', 'newStatus' => $newStatus]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy người dùng hoặc trạng thái không đổi.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
