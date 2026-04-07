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
$type = mysqli_real_escape_string($conn, $data['type'] ?? '');
$code = mysqli_real_escape_string($conn, $data['code'] ?? '');
$status = mysqli_real_escape_string($conn, $data['status'] ?? 'active');

// Uniqueness checks
$checkSql = "SELECT id FROM tk_categories WHERE (code = '$code' OR name = '$name' OR type = '$type') AND id != $id LIMIT 1";
$resCheck = $conn->query($checkSql);
if ($resCheck && $resCheck->num_rows > 0) {
    exit(json_encode(['success' => false, 'message' => 'Lỗi: Tên, Mã hoặc Thuộc tính Thể loại đã tồn tại hoặc bị trùng!']));
}

$default_profit = isset($data['default_profit']) ? (int)$data['default_profit'] : 15;

if ($id > 0) {
    $sql = "UPDATE tk_categories SET name = '$name', type = '$type', code = '$code', status = '$status', default_profit = $default_profit WHERE id = $id";
} else {
    $sql = "INSERT INTO tk_categories (name, type, code, status, default_profit) VALUES ('$name', '$type', '$code', '$status', $default_profit)";
}

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'id' => ($id > 0 ? $id : $conn->insert_id)]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
