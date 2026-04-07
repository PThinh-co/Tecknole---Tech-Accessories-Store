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
$name = mysqli_real_escape_string($conn, $data['name']);
$code = mysqli_real_escape_string($conn, $data['code']);

$status = mysqli_real_escape_string($conn, $data['status'] ?? 'Hiển thị');

// Uniqueness checks
$checkSql = "SELECT id FROM tk_brands WHERE (code = '$code' OR name = '$name') AND id != $id LIMIT 1";
$resCheck = $conn->query($checkSql);
if ($resCheck && $resCheck->num_rows > 0) {
    exit(json_encode(['success' => false, 'message' => 'Lỗi: Tên hoặc Mã Hãng đã tồn tại hoặc bị trùng!']));
}

if ($id > 0) {
    $sql = "UPDATE tk_brands SET name = '$name', code = '$code', status = '$status' WHERE id = $id";
} else {
    $sql = "INSERT INTO tk_brands (name, code, status) VALUES ('$name', '$code', '$status')";
}

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'id' => ($id > 0 ? $id : $conn->insert_id)]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
