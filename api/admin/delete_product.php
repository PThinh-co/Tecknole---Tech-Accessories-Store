<?php
session_start();
require_once '../../includes/db.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) ? (int)$input['id'] : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID không hợp lệ.']);
    exit;
}

// Kiểm tra xem sản phẩm có trong tồn kho không
$inventStmt = mysqli_prepare($conn, "SELECT COUNT(*) as total FROM tk_import_items WHERE product_id = ?");
mysqli_stmt_bind_param($inventStmt, "i", $id);
mysqli_stmt_execute($inventStmt);
$inventRes = mysqli_stmt_get_result($inventStmt);
$inventData = mysqli_fetch_assoc($inventRes);

if ($inventData['total'] > 0) {
    // ĐÃ TỪNG NHẬP HÀNG -> CHỈ ẨN ĐI
    $stmt = mysqli_prepare($conn, "UPDATE tk_products SET status = 'Ngừng kinh doanh' WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'action' => 'hide', 'message' => 'Sản phẩm đã có lịch sử nhập hàng nên hệ thống đã tạm ẨN đi thay vì xóa vĩnh viễn.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi cập nhật trạng thái: ' . mysqli_error($conn)]);
    }
} else {
    // CHƯA NHẬP HÀNG -> XÓA THẬT
    $stmt = mysqli_prepare($conn, "DELETE FROM tk_products WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'action' => 'delete', 'message' => 'Sản phẩm chưa có tồn kho nên hệ thống đã XÓA VĨNH VIỄN thành công.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi xóa sản phẩm: ' . mysqli_error($conn)]);
    }
}

mysqli_stmt_close($stmt);
mysqli_stmt_close($inventStmt);
mysqli_close($conn);
?>
