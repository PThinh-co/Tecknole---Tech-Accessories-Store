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
$name = mysqli_real_escape_string($conn, $data['name'] ?? '');
$status = mysqli_real_escape_string($conn, $data['status'] ?? 'Hiển thị');

// Uniqueness checks (Tên)
$checkSql = "SELECT id FROM tk_categories WHERE name = '$name' AND id != $id LIMIT 1";
$resCheck = $conn->query($checkSql);
if ($resCheck && $resCheck->num_rows > 0) {
    exit(json_encode(['success' => false, 'message' => 'Lỗi: Tên danh mục đã tồn tại!']));
}

if ($id > 0) {
    $sql = "UPDATE tk_categories SET name = '$name', status = '$status' WHERE id = $id";
}
else {
    $sql = "INSERT INTO tk_categories (name, status) VALUES ('$name', '$status')";
}

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'id' => ($id > 0 ? $id : $conn->insert_id)]);
}
else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
