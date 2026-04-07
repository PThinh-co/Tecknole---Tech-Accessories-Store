<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // 1. Tổng doanh thu (Các đơn đã thành công)
    $qRevenue = "SELECT SUM(total_amount) as total FROM tk_orders WHERE status IN ('completed', 'Đã giao thành công', 'Hoàn thành')";
    $resRevenue = $conn->query($qRevenue);
    $totalRevenue = $resRevenue->fetch_assoc()['total'] ?? 0;

    // 2. Tổng khách hàng
    $qUsers = "SELECT COUNT(*) as total FROM tk_users WHERE role = 'user'";
    $resUsers = $conn->query($qUsers);
    $totalUsers = $resUsers->fetch_assoc()['total'] ?? 0;

    // 3. Đơn hàng mới (Chưa xử lý)
    $qNewOrders = "SELECT COUNT(*) as total FROM tk_orders WHERE status IN ('pending', 'Chưa xử lý')";
    $resNewOrders = $conn->query($qNewOrders);
    $newOrders = $resNewOrders->fetch_assoc()['total'] ?? 0;

    // 4. Tổng sản phẩm đang kinh doanh
    $qProducts = "SELECT COUNT(*) as total FROM tk_products WHERE status NOT IN ('Ngừng kinh doanh', 'deleted')";
    $resProducts = $conn->query($qProducts);
    $totalProducts = $resProducts->fetch_assoc()['total'] ?? 0;

    // 5. Danh sách 5 đơn hàng mới nhất
    $recentOrders = [];
    $resRecent = $conn->query("SELECT id, receiver_name, total_amount, status, order_date FROM tk_orders ORDER BY order_date DESC LIMIT 5");
    while($row = $resRecent->fetch_assoc()) {
        $recentOrders[] = $row;
    }

    // 6. Top sản phẩm bán chạy (Mô phỏng hoặc thực tế nếu có view)
    $topProducts = [];
    $resTop = $conn->query("SELECT name, stock, code FROM tk_products WHERE status = 'Đang bán' ORDER BY stock ASC LIMIT 5");
    while($row = $resTop->fetch_assoc()) {
        $topProducts[] = $row;
    }

    echo json_encode([
        'success' => true,
        'stats' => [
            'revenue' => (float)$totalRevenue,
            'users' => (int)$totalUsers,
            'new_orders' => (int)$newOrders,
            'products' => (int)$totalProducts,
            'recent_orders' => $recentOrders,
            'low_stock' => $topProducts
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
