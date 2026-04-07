<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int)$data['id'] : 0;
$status = mysqli_real_escape_string($conn, $data['status']);

if ($id > 0) {
    $stmt = $conn->prepare("UPDATE tk_products SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi DB: ' . $stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID không hợp lệ.']);
}
