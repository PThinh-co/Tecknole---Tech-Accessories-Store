<?php
session_start();
require_once '../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT o.*, 
        (SELECT GROUP_CONCAT(CONCAT(qty, 'x ', p.name) SEPARATOR ', ') 
         FROM tk_order_items oi 
         JOIN tk_products p ON oi.product_id = p.id 
         WHERE oi.order_id = o.id) as items_summary
        FROM tk_orders o 
        WHERE o.user_id = $user_id 
        ORDER BY o.order_date DESC";

$result = mysqli_query($conn, $sql);
$orders = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }
    echo json_encode(['success' => true, 'orders' => $orders]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi truy vấn đơn hàng']);
}
?>
