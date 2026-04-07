<?php
session_start();
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

$user_id = $_SESSION['user_id'];
$fullname = mysqli_real_escape_string($conn, $_POST['fullname']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$phone = mysqli_real_escape_string($conn, $_POST['phone']);
$address = mysqli_real_escape_string($conn, $_POST['address']);

$sql = "UPDATE tk_users SET fullname = '$fullname', email = '$email', phone = '$phone', address = '$address' WHERE id = $user_id";

if (mysqli_query($conn, $sql)) {
    $_SESSION['fullname'] = $fullname; // Cập nhật session
    echo json_encode(['success' => true, 'message' => 'Cập nhật thành công']);
}
else {
    echo json_encode(['success' => false, 'message' => 'Lỗi cập nhật: ' . mysqli_error($conn)]);
}
?>
