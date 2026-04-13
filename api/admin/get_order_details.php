<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID hợp lệ không tồn tại.']);
    exit;
}

// Lấy thông tin đơn hàng
$orderSql = "SELECT * FROM tk_orders WHERE id = $id LIMIT 1";
$ordRes = $conn->query($orderSql);
if (!$ordRes || $ordRes->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy đơn hàng.']);
    exit;
}
$order = $ordRes->fetch_assoc();

// Lấy chi tiết sản phẩm
$itemSql = "SELECT i.*, p.name as product_name 
            FROM tk_order_items i 
            LEFT JOIN tk_products p ON i.product_id = p.id 
            WHERE i.order_id = $id 
            ORDER BY i.id ASC";
$itemRes = $conn->query($itemSql);
$items = [];
if ($itemRes && $itemRes->num_rows > 0) {
    while ($row = $itemRes->fetch_assoc()) {
        $items[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'order' => $order,
    'items' => $items
]);
?>
