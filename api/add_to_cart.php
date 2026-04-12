<?php
session_start();
// Lùi ra 1 cấp (..) rồi chui vào includes để gọi db.php
require_once '../includes/db.php';


header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Lỗi phương thức']);
    exit;
}

// YÊU CẦU ĐĂNG NHẬP
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;
// Chấp nhận cả quantity và qty để tương thích ngược
$quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : (isset($_POST['qty']) ? (int)$_POST['qty'] : 1);

if ($product_id <= 0 || $quantity <= 0) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
    exit;
}

// Kiểm tra tồn kho và giá bán bằng Prepared Statement
$sql = "SELECT id, name, price, stock, image FROM v_products_full WHERE id = ? AND status = 'Hiện'";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Lỗi chuẩn bị truy vấn']);
    exit;
}
mysqli_stmt_bind_param($stmt, "i", $product_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    echo json_encode(['success' => false, 'message' => 'Sản phẩm không tồn tại hoặc đã ngừng bán!']);
    exit;
}

$product = mysqli_fetch_assoc($result);
$maxStock = (int)$product['stock'];

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$current_qty_in_cart = isset($_SESSION['cart'][$product_id]) ? $_SESSION['cart'][$product_id]['quantity'] : 0;
$new_total_qty = $current_qty_in_cart + $quantity;

// Chặn mua lố tồn kho
if ($new_total_qty > $maxStock) {
    echo json_encode([
        'success' => false,
        'message' => "Kho chỉ còn $maxStock sản phẩm. Trong giỏ bạn đã có $current_qty_in_cart cái, không thể thêm nữa!"
    ]);
    exit;
}

// Cấu hình giá bán chính thức (Sử dụng cột price)
$final_price = (int)$product['price'];

// Thêm vào Session
$_SESSION['cart'][$product_id] = [
    'id' => $product['id'],
    'name' => $product['name'],
    'price' => $final_price,
    'original_price' => (int)$product['price'],
    'image' => $product['image'],
    'quantity' => $new_total_qty,
    'max_stock' => $maxStock // Lưu trữ cho mục đích hiển thị nhanh, nhưng update_cart sẽ query lại DB
];

$total_items = array_sum(array_column($_SESSION['cart'], 'quantity'));

echo json_encode([
    'success' => true,
    'message' => 'Đã thêm vào giỏ hàng!',
    'cart_count' => $total_items
]);
?>