<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../../includes/db.php'; // Chỉnh lại path chuẩn

$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? (int)$data['id'] : 0;
// status sent from frontend is either 'Hiển thị' or 'Ẩn'
$status = isset($data['status']) ? trim($data['status']) : '';

if ($id <= 0 || !in_array($status, ['Hiển thị', 'Ẩn'])) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ.']);
    exit;
}

// BƯỚC 1: CẬP NHẬT TRẠNG THÁI DANH MỤC
$stmt = $conn->prepare("UPDATE tk_categories SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    // BƯỚC 2: ĐỒNG BỘ ẨN SẢN PHẨM TRONG DANH MỤC NẾU CẦN
    $productStatus = ($status === 'Ẩn') ? 'Ẩn' : 'Hiện';
    
    // Sử dụng category_id để update sản phẩm vì database tk_products dùng id loại
    $stmt2 = $conn->prepare("UPDATE tk_products SET status = ? WHERE category_id = ?");
    $stmt2->bind_param("si", $productStatus, $id);
    $stmt2->execute();

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Query error: ' . $stmt->error]);
}
?>
