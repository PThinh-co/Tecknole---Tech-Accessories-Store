<?php
session_start();
require_once '../../includes/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

try {
    $q = "SELECT o.*, u.fullname as customer_name, u.email as customer_email 
          FROM tk_orders o 
          LEFT JOIN tk_users u ON o.user_id = u.id 
          ORDER BY o.id DESC";
    $result = $conn->query($q);
    $orders = [];
    while($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    echo json_encode(['success' => true, 'orders' => $orders]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
