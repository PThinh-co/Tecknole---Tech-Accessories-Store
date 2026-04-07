<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

// Kiểm tra quyền Admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // Lấy dữ liệu từ View v_products_full (đã bao gồm category_name và brand văn bản)
    $sql = "SELECT * FROM v_products_full ORDER BY id DESC";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        throw new Exception(mysqli_error($conn));
    }

    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Ép kiểu dữ liệu số cho JS xử lý chính xác
        $row['id'] = (int)$row['id'];
        $row['price'] = (int)$row['price'];
        $row['old_price'] = (int)$row['old_price'];
        $row['stock'] = (int)$row['stock'];
        $row['cost'] = (int)$row['cost'];
        $row['profit'] = (int)($row['profit'] ?? 0);

        $products[] = $row;
    }

    echo json_encode(['success' => true, 'products' => $products]);

}
catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi kết nối DB: ' . $e->getMessage()
    ]);
}
?>
