<?php
session_start();
require_once '../includes/db.php'; // Cần cho Prepared Statements khi update số lượng
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Lỗi phương thức']);
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Xóa 1 sản phẩm
if ($action === 'remove') {
    if (isset($_SESSION['cart'][$product_id])) {
        unset($_SESSION['cart'][$product_id]);
    }
}

// Cập nhật số lượng
elseif ($action === 'update') {
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;
    if (isset($_SESSION['cart'][$product_id])) {
        // Query DB để lấy tồn kho thực tế mới nhất
        $sql = "SELECT stock FROM tk_products WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "i", $product_id);
            mysqli_stmt_execute($stmt);
            $res = mysqli_stmt_get_result($stmt);
            $product = mysqli_fetch_assoc($res);
            $maxStock = $product ? (int)$product['stock'] : 0;
            mysqli_stmt_close($stmt);

            // Cốt lõi bảo vệ tồn kho nằm ở đây:
            if ($quantity > $maxStock) {
                echo json_encode([
                    'success' => false,
                    'message' => "Kho chỉ còn tối đa $maxStock sản phẩm!",
                    'force_qty' => $maxStock
                ]);
                exit;
            }
            if ($quantity < 1)
                $quantity = 1;

            $_SESSION['cart'][$product_id]['quantity'] = $quantity;
            $_SESSION['cart'][$product_id]['max_stock'] = $maxStock; // Cập nhật lại cache trong session
        }
    }
}

// Xóa sạch giỏ hàng
elseif ($action === 'clear') {
    $_SESSION['cart'] = [];
}

$total_items = 0;
$total_price = 0;
$id_mismatch = false;

foreach ($_SESSION['cart'] as $id => &$item) {
    if (!isset($item['price']) || !isset($item['name']) || !isset($item['image'])) {
        $clean_id = (int)$id;
        $res = mysqli_query($conn, "SELECT name, price, stock, image FROM tk_products WHERE id = $clean_id");
        if ($res && $prod = mysqli_fetch_assoc($res)) {
            $item['id'] = $id;
            $item['name'] = $prod['name'];
            $item['price'] = (int)$prod['price'];
            $item['image'] = $prod['image'];
            $item['max_stock'] = (int)$prod['stock'];
        }
        else {
            unset($_SESSION['cart'][$id]);
            $id_mismatch = true;
            continue;
        }
    }
    $total_items += $item['quantity'];
    $total_price += $item['price'] * $item['quantity'];
}
unset($item);

echo json_encode([
    'success' => true,
    'cart_count' => $total_items,
    'total_price' => number_format($total_price, 0, ',', '.'),
    'items' => array_values($_SESSION['cart']),
    'id_mismatch' => $id_mismatch // Báo cho JS biết có sự thay đổi ID do Migration
]);

?>