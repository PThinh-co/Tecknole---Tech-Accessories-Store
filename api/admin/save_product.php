<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
    exit;
}

$id = isset($data['id']) ? (int)$data['id'] : 0;
$name = mysqli_real_escape_string($conn, $data['name'] ?? '');
$category_id = (int)($data['category_id'] ?? 0);
$brand_name = mysqli_real_escape_string($conn, $data['brand_name'] ?? $data['brand'] ?? '');
$image = mysqli_real_escape_string($conn, $data['image'] ?? '');
$description = mysqli_real_escape_string($conn, $data['description'] ?? $data['short_desc'] ?? '');
$supplier = isset($data['supplier']) ? mysqli_real_escape_string($conn, $data['supplier']) : '';
$unit = isset($data['unit']) ? mysqli_real_escape_string($conn, $data['unit']) : 'Cái';
$profit_margin = isset($data['profit_margin']) ? (int)$data['profit_margin'] : 20;
$stock = isset($data['stock']) ? (int)$data['stock'] : 0;
$status = isset($data['status']) ? mysqli_real_escape_string($conn, $data['status']) : 'Hiện';

if ($id > 0) {
    // Cập nhật
    $sql = "UPDATE tk_products SET 
            name = '$name', 
            category_id = $category_id, 
            brand_name = '$brand_name', 
            image = '$image', 
            description = '$description', 
            profit_margin = $profit_margin,
            stock = $stock,
            status = '$status',
            supplier = '$supplier'
            WHERE id = $id";
}
else {
    // Thêm mới
    $sql = "INSERT INTO tk_products (name, category_id, brand_name, image, description, profit_margin, stock, status, supplier, created_at) 
            VALUES ('$name', $category_id, '$brand_name', '$image', '$description', $profit_margin, $stock, '$status', '$supplier', NOW())";
}

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Lưu sản phẩm thành công', 'id' => ($id > 0 ? $id : $conn->insert_id)]);
}
else {
    echo json_encode(['success' => false, 'message' => 'Lỗi DB: ' . $conn->error]);
}
