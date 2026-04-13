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

$sql = "SELECT * FROM tk_orders ORDER BY order_date DESC, id DESC";
$result = $conn->query($sql);

$orders = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Also fetch order details for simplicity if needed, or just return basic order data
        $orders[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'orders' => $orders
]);
?>
