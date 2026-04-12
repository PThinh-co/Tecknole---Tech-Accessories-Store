<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../../includes/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$profit = isset($data['profit']) ? intval($data['profit']) : 0;
$price = isset($data['price']) ? intval($data['price']) : 0;

if ($id <= 0 || $price < 0) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ.']);
    exit;
}

// Update the profit margin
$stmt = $conn->prepare("UPDATE tk_products SET profit_margin = ? WHERE id = ?");
$stmt->bind_param("ii", $profit, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
}
else {
    echo json_encode(['success' => false, 'message' => 'Lỗi DB: ' . $stmt->error]);
}
?>
