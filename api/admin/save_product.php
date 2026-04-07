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
$code = mysqli_real_escape_string($conn, $data['code'] ?? '');
$price = (int)($data['price'] ?? 0);
$category_id = (int)($data['category_id'] ?? 0);
$brand = mysqli_real_escape_string($conn, $data['brand'] ?? '');
$image = mysqli_real_escape_string($conn, $data['image'] ?? '');
$short_desc = mysqli_real_escape_string($conn, $data['short_desc'] ?? '');
$type = mysqli_real_escape_string($conn, $data['type'] ?? '');
$supplier = isset($data['supplier']) ? mysqli_real_escape_string($conn, $data['supplier']) : '';
$unit = isset($data['unit']) ? mysqli_real_escape_string($conn, $data['unit']) : 'Cái';
$cost = isset($data['cost']) ? (int)$data['cost'] : 0;
$profit = isset($data['profit']) ? (int)$data['profit'] : 15;
$stock = isset($data['stock']) ? (int)$data['stock'] : 0;
$status = isset($data['status']) ? mysqli_real_escape_string($conn, $data['status']) : 'Đang bán';

// Nếu chưa có category_id từ JS, thử tìm dựa trên type (danh mục cũ dùng type string)
if ($category_id === 0) {
    // Để giữ nguyên tính tương thích
    $resCat = $conn->query("SELECT id FROM tk_categories WHERE type = '$type' LIMIT 1");
    if ($resCat && $resCat->num_rows > 0) {
        $category_id = (int)$resCat->fetch_assoc()['id'];
    }
}

// Uniqueness checks
$checkSql = "SELECT id FROM tk_products WHERE code = '$code' AND id != $id LIMIT 1";
$resCheck = $conn->query($checkSql);
if ($resCheck && $resCheck->num_rows > 0) {
    exit(json_encode(['success' => false, 'message' => 'Lỗi: Mã sản phẩm (SKU) đã tồn tại! Vui lòng chọn mã khác.']));
}

if ($id > 0) {
    // Cập nhật
    $sql = "UPDATE tk_products SET 
            name = '$name', 
            code = '$code', 
            price = $price, 
            category_id = $category_id, 
            brand = '$brand', 
            image = '$image', 
            short_desc = '$short_desc', 
            type = '$type',
            cost = $cost,
            profit = $profit,
            stock = $stock,
            status = '$status'
            WHERE id = $id";
}
else {
    // Thêm mới
    $sql = "INSERT INTO tk_products (name, code, price, category_id, brand, image, short_desc, type, cost, profit, stock, status, created_at) 
            VALUES ('$name', '$code', $price, $category_id, '$brand', '$image', '$short_desc', '$type', $cost, $profit, $stock, '$status', NOW())";
}

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Lưu sản phẩm thành công', 'id' => ($id > 0 ? $id : $conn->insert_id)]);
}
else {
    echo json_encode(['success' => false, 'message' => 'Lỗi DB: ' . $conn->error]);
}
