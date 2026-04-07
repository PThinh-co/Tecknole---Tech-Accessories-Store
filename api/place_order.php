<?php
session_start();
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    echo json_encode(['success' => false, 'message' => 'Giỏ hàng trống']);
    exit;
}

$user_id = $_SESSION['user_id'];
$receiver_name = mysqli_real_escape_string($conn, $_POST['receiver_name']);
$receiver_phone = mysqli_real_escape_string($conn, $_POST['receiver_phone']);
$receiver_email = mysqli_real_escape_string($conn, $_POST['receiver_email']);
$shipping_address = mysqli_real_escape_string($conn, $_POST['shipping_address']);
$payment_method = mysqli_real_escape_string($conn, $_POST['payment_method']);
$order_note = mysqli_real_escape_string($conn, $_POST['order_note']);

// Tính tổng tiền từ session cart
$total_amount = 0;
foreach ($_SESSION['cart'] as $item) {
    $total_amount += $item['price'] * $item['quantity'];
}
// Lược bỏ phí ship (Set bằng 0 theo yêu cầu)
$shipping_fee = 0;

$total_amount += $shipping_fee;

// Insert vào tk_orders (Khớp 100% với database/tecknole_db_v10.sql)
$sql = "INSERT INTO tk_orders (user_id, status, total_amount, payment_method, shipping_address, receiver_name, receiver_phone, receiver_email, note, order_date) 
        VALUES ($user_id, 'Chưa xử lý', $total_amount, '$payment_method', '$shipping_address', '$receiver_name', '$receiver_phone', '$receiver_email', '$order_note', NOW())";

if (mysqli_query($conn, $sql)) {
    $order_id = mysqli_insert_id($conn);

    // Insert chi tiết đơn hàng
    foreach ($_SESSION['cart'] as $item) {
        $product_id = $item['id'];
        $qty = $item['quantity'];
        $price = $item['price'];
        $sql_item = "INSERT INTO tk_order_items (order_id, product_id, qty, price) VALUES ($order_id, $product_id, $qty, $price)";
        mysqli_query($conn, $sql_item);
        
        // Cập nhật tồn kho
        $sql_stock = "UPDATE tk_products SET stock = stock - $qty WHERE id = $product_id";
        mysqli_query($conn, $sql_stock);
    }

    // Xóa giỏ hàng
    unset($_SESSION['cart']);

    echo json_encode(['success' => true, 'order_id' => $order_id, 'total' => $total_amount]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . mysqli_error($conn)]);
}
?>
