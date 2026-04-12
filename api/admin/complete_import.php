<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = (int)($_POST['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID phiếu không hợp lệ.']);
    exit;
}

mysqli_begin_transaction($conn);

try {
    // 1. Kiểm tra trạng thái hiện tại (Phải là Nháp)
    $res = $conn->query("SELECT status FROM tk_imports WHERE id = $id");
    $import = $res->fetch_assoc();

    if (!$import) throw new Exception("Không tìm thấy phiếu nhập.");
    if ($import['status'] !== 'Nháp') throw new Exception("Chỉ có thể hoàn thành phiếu đang ở trạng thái 'Nháp'.");

    // 2. Duyệt từng sản phẩm trong phiếu nhập
    $resItems = $conn->query("SELECT product_id, quantity, import_price FROM tk_import_items WHERE import_id = $id");
    
    while ($item = $resItems->fetch_assoc()) {
        $p_id = (int)$item['product_id'];
        $imp_qty = (int)$item['quantity'];

        // Cập nhật Kho (Giá vốn sẽ tự động tính từ VIEW v_product_costs sau khi đổi status phiếu)
        $conn->query("UPDATE tk_products SET stock = stock + $imp_qty WHERE id = $p_id");
    }

    // 3. Cập nhật trạng thái phiếu nhập
    $conn->query("UPDATE tk_imports SET status = 'Hoàn thành' WHERE id = $id");

    mysqli_commit($conn);
    echo json_encode(['success' => true, 'message' => 'Đã hoàn thành phiếu nhập. Kho đã được cập nhật, giá vốn bình quân sẽ tự động tính lại.']);

} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();
?>
