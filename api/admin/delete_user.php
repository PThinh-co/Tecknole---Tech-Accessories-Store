<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID không hợp lệ.']);
    exit;
}

try {
    // Không cho phép tự xóa chính mình nếu đang login
    // Giả sử session lưu user_id của admin
    // if (isset($_SESSION['admin_user_id']) && $_SESSION['admin_user_id'] == $id) {
    //     echo json_encode(['success' => false, 'message' => 'Bạn không thể tự xóa tài khoản của chính mình.']);
    //     exit;
    // }

    $sql = "DELETE FROM tk_users WHERE id = $id";
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'message' => 'Đã xóa người dùng thành công.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $conn->error]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()]);
}
