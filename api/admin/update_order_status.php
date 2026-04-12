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

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) ? (int)$input['id'] : 0;
$new_status = isset($input['status']) ? mysqli_real_escape_string($conn, $input['status']) : '';

if ($id <= 0 || empty($new_status)) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ.']);
    exit;
}

try {
    // 1. Lấy trạng thái hiện tại của đơn hàng
    $res = $conn->query("SELECT status FROM tk_orders WHERE id = $id");
    if (!$res || $res->num_rows === 0) throw new Error("Không tìm thấy đơn hàng.");
    $old_status = $res->fetch_assoc()['status'];

    // 2. Logic hoàn tồn kho (Nếu chuyển SANG trạng thái Hủy từ trạng thái chưa hủy)
    $is_cancelled_now = ($new_status === 'Đã hủy' || $new_status === 'cancelled' || $new_status === 'hủy');
    $was_cancelled_before = ($old_status === 'Đã hủy' || $old_status === 'cancelled' || $old_status === 'hủy');

    if ($is_cancelled_now && !$was_cancelled_before) {
        // Cộng lại kho
        $items = $conn->query("SELECT product_id, quantity FROM tk_order_items WHERE order_id = $id");
        while ($item = $items->fetch_assoc()) {
            $pid = $item['product_id'];
            $quantity = $item['quantity'];
            $conn->query("UPDATE tk_products SET stock = stock + $quantity WHERE id = $pid");
        }
    } 
    // 3. Logic trừ lại kho (Nếu chuyển TỪ trạng thái Hủy sang trạng thái khác)
    else if (!$is_cancelled_now && $was_cancelled_before) {
        // Trừ lại kho
        $items = $conn->query("SELECT product_id, quantity FROM tk_order_items WHERE order_id = $id");
        while ($item = $items->fetch_assoc()) {
            $pid = $item['product_id'];
            $quantity = $item['quantity'];
            $conn->query("UPDATE tk_products SET stock = stock - $quantity WHERE id = $pid");
        }
    }

    // 4. Cập nhật trạng thái
    $stmt = $conn->prepare("UPDATE tk_orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $new_status, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái thành công.']);
    } else {
        throw new Error("Lỗi DB: " . $conn->error);
    }
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
