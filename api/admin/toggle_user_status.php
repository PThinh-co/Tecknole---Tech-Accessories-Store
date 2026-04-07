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
$status = mysqli_real_escape_string($conn, $data['status']);

// Determine the new status
$newStatus = ($status === 'active') ? 'locked' : 'active';

$sql = "UPDATE tk_users SET status = '$newStatus' WHERE id = $id AND role = 'user'";

if ($conn->query($sql)) {
    if ($conn->affected_rows > 0) {
        echo json_encode(['success' => true, 'newStatus' => $newStatus]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy người dùng hoặc bạn không có quyền khóa admin.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
