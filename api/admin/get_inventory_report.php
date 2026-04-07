<?php
session_start();
require_once '../../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in'])) {
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$start = $_GET['start'] ?? date('Y-m-d', strtotime('-30 days'));
$end = $_GET['end'] ?? date('Y-m-d');
$point_date = $_GET['point_date'] ?? '';
$category = $_GET['category'] ?? '';
$threshold = isset($_GET['threshold']) ? intval($_GET['threshold']) : 20;

try {
    $where = "WHERE 1=1";
    if ($category) {
        $where .= " AND p.type = '" . mysqli_real_escape_string($conn, $category) . "'";
    }

    $res = $conn->query("SELECT p.id, p.code, p.name, p.stock, p.type FROM tk_products p $where");

    $products = [];
    while ($p = $res->fetch_assoc()) {
        $p_id = (int)$p['id'];
        $current_stock = (int)$p['stock'];

        // 2. Nhập trong kỳ
        $qIn = "SELECT SUM(ii.qty) as total FROM tk_import_items ii 
                JOIN tk_imports i ON ii.import_id = i.id 
                WHERE ii.product_id = $p_id 
                AND i.status = 'Hoàn thành'
                AND DATE(i.import_date) BETWEEN '$start' AND '$end'";
        $inRes = $conn->query($qIn);
        $inData = $inRes->fetch_assoc();
        $total_import = isset($inData['total']) ? (int)$inData['total'] : 0;

        // 3. Xuất trong kỳ
        $qOut = "SELECT SUM(oi.qty) as total FROM tk_order_items oi 
                 JOIN tk_orders o ON oi.order_id = o.id 
                 WHERE oi.product_id = $p_id 
                 AND LOWER(o.status) NOT IN ('đã hủy', 'cancelled', 'hủy', 'failed', 'thất bại')
                 AND DATE(o.order_date) BETWEEN '$start' AND '$end'";
        $outRes = $conn->query($qOut);
        $outData = $outRes->fetch_assoc();
        $total_export = isset($outData['total']) ? (int)$outData['total'] : 0;

        // 4. Tồn tại điểm
        $stock_at_point = $current_stock;
        if ($point_date) {
            $fInRes = $conn->query("SELECT SUM(ii.qty) as total FROM tk_import_items ii 
                                    JOIN tk_imports i ON ii.import_id = i.id 
                                    WHERE ii.product_id = $p_id 
                                    AND i.status = 'Hoàn thành'
                                    AND DATE(i.import_date) > '$point_date'");
            $fInData = $fInRes->fetch_assoc();
            $future_imports = isset($fInData['total']) ? (int)$fInData['total'] : 0;

            $fOutRes = $conn->query("SELECT SUM(oi.qty) as total FROM tk_order_items oi 
                                     JOIN tk_orders o ON oi.order_id = o.id 
                                     WHERE oi.product_id = $p_id 
                                     AND LOWER(o.status) NOT IN ('đã hủy', 'cancelled', 'hủy', 'failed', 'thất bại')
                                     AND DATE(o.order_date) > '$point_date'");
            $fOutData = $fOutRes->fetch_assoc();
            $future_exports = isset($fOutData['total']) ? (int)$fOutData['total'] : 0;

            $stock_at_point = $current_stock - $future_imports + $future_exports;
        }

        $products[] = [
            'id' => $p_id,
            'code' => $p['code'] ?? 'N/A',
            'name' => $p['name'],
            'category' => $p['type'] ?? 'Chưa phân loại',
            'starting' => $stock_at_point,
            'imported' => $total_import,
            'exported' => $total_export,
            'ending' => $current_stock,
            'is_out' => ($current_stock <= 0),
            'is_low' => ($current_stock > 0 && $current_stock <= $threshold)
        ];
    }

    echo json_encode(['success' => true, 'report' => $products]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
