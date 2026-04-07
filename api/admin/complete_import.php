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
    $resItems = $conn->query("SELECT product_id, qty, cost_price FROM tk_import_items WHERE import_id = $id");
    
    while ($item = $resItems->fetch_assoc()) {
        $p_id = (int)$item['product_id'];
        $imp_qty = (int)$item['qty'];
        $imp_cost = (float)$item['cost_price'];

        // Lấy dữ liệu tồn kho & giá vốn hiện tại
        $pRes = $conn->query("SELECT stock, cost, profit FROM tk_products WHERE id = $p_id");
        $p = $pRes->fetch_assoc();
        if (!$p) continue;

        $old_stock = (int)$p['stock'];
        $old_cost = (float)$p['cost'];
        $profit_margin = (int)($p['profit'] ?? 15); // Lấy tỷ lệ lợi nhuận đã lưu hoặc mặc định 15%

        // TÍNH GIÁ NHẬP BÌNH QUÂN (Weighted Average Cost)
        // Rule: (Tồn * Giá cũ + Nhập * Giá mới) / (Tổng số lượng)
        $total_qty = $old_stock + $imp_qty;
        
        $new_avg_cost = $imp_cost; // Mặc định nếu trước đó chưa có hoặc tổng = 0
        if ($total_qty > 0) {
            $new_avg_cost = ($old_stock * $old_cost + $imp_qty * $imp_cost) / $total_qty;
        }

        // TÍNH GIÁ BÁN MỚI (Dựa trên tỷ lệ lợi nhuận đã lưu)
        // Giá bán = Giá nhập * (100% + % Lợi nhuận)
        $new_sale_price = round($new_avg_cost * (1 + $profit_margin / 100));

        // Cập nhật Sản phẩm: Kho mới, Giá vốn bình quân mới, Giá bán mới
        $stmtUpdateProduct = $conn->prepare("UPDATE tk_products SET stock = ?, cost = ?, price = ? WHERE id = ?");
        $stmtUpdateProduct->bind_param("idii", $total_qty, $new_avg_cost, $new_sale_price, $p_id);
        $stmtUpdateProduct->execute();
        $stmtUpdateProduct->close();
    }

    // 3. Cập nhật trạng thái phiếu nhập
    $conn->query("UPDATE tk_imports SET status = 'Hoàn thành' WHERE id = $id");

    mysqli_commit($conn);
    echo json_encode(['success' => true, 'message' => 'Đã hoàn thành phiếu nhập. Giá vốn bình quân và Giá bán đã được tự động cập nhật!']);

} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();
?>
