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

// Lấy thông tin phiếu nhập
$importSql = "SELECT * FROM tk_imports WHERE id = $id LIMIT 1";
$impRes = $conn->query($importSql);
if (!$impRes || $impRes->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy phiếu nhập.']);
    exit;
}
$import = $impRes->fetch_assoc();

// Lấy chi tiết sản phẩm nhập
$itemSql = "SELECT ii.*, p.name as product_name, p.profit_margin, p.price as current_price
            FROM tk_import_items ii 
            LEFT JOIN v_products_full p ON ii.product_id = p.id 
            WHERE ii.import_id = $id 
            ORDER BY ii.id ASC";
$itemRes = $conn->query($itemSql);
$items = [];
if ($itemRes && $itemRes->num_rows > 0) {
    while ($row = $itemRes->fetch_assoc()) {
        $items[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'import' => $import,
    'items' => $items
]);
?>
