<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || empty($data['items'])) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu phiếu nhập trống.']);
    exit;
}

$import_date = $data['import_date'] ?? date('Y-m-d H:i:s');
$total_cost = (float)($data['total_cost'] ?? 0);
$status = $data['status'] ?? 'Hoàn thành';
$items = $data['items'];

mysqli_begin_transaction($conn);

try {
    // 1. Lưu phiếu nhập chính
    $stmt = $conn->prepare("INSERT INTO tk_imports (import_date, total_cost, status) VALUES (?, ?, ?)");
    $stmt->bind_param("sds", $import_date, $total_cost, $status);
    $stmt->execute();
    $import_id = $conn->insert_id;

    // 2. Lưu chi tiết và cập nhật kho (nếu hoàn thành)
    $stmtItem = $conn->prepare("INSERT INTO tk_import_items (import_id, product_id, quantity, import_price) VALUES (?, ?, ?, ?)");

    foreach ($items as $item) {
        $p_id = (int)$item['product_id'];
        $quantity = (int)($item['quantity'] ?? $item['qty'] ?? 1);
        $cost = (float)$item['cost'];

        if ($cost <= 1000) {
            throw new Exception("Sản phẩm ID {$p_id} có giá vốn quá thấp (<= 1000đ).");
        }

        // Lưu chi tiết phiếu nhập
        $stmtItem->bind_param("iiid", $import_id, $p_id, $quantity, $cost);
        $stmtItem->execute();

        // Cập nhật kho CHỈ KHI phiếu Hoàn thành ngay
        if ($status === 'Hoàn thành') {
            $conn->query("UPDATE tk_products SET stock = stock + $quantity WHERE id = $p_id");
        }
    }

    mysqli_commit($conn);
    $msg = $status === 'Hoàn thành'
        ? 'Lập phiếu nhập thành công. Đã cập nhật kho và giá vốn bình quân.'
        : 'Đã lưu tạm phiếu nháp. (Chưa cộng kho)';
    echo json_encode(['success' => true, 'message' => $msg]);

} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
}
?>
