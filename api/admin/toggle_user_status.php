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

// Không cho phép tự khóa chính mình
if ($id === $_SESSION['admin_user_id']) {
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
