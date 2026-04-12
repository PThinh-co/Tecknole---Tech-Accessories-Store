<?php
session_start();
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Bạn chưa đăng nhập']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$oldPass = $data['oldPass'] ?? '';
$newPass = $data['newPass'] ?? '';
$user_id = $_SESSION['user_id'];

if (empty($oldPass) || empty($newPass)) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin']);
    exit;
}

// 1. Kiểm tra mật khẩu cũ
$sql = "SELECT password FROM tk_users WHERE id = $user_id";
$res = $conn->query($sql);
if (!$res || $res->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Người dùng không tồn tại']);
    exit;
}

$user = $res->fetch_assoc();
$currentHash = $user['password'];

// Kiểm tra khớp mật khẩu cũ (Hỗ trợ cả hash và plain text cũ)
if (!password_verify($oldPass, $currentHash) && $oldPass !== $currentHash) {
    echo json_encode(['success' => false, 'message' => 'Mật khẩu hiện tại không chính xác']);
    exit;
}

// 2. Hash mật khẩu mới và cập nhật
$newHash = password_hash($newPass, PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE tk_users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $newHash, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Mật khẩu đã được cập nhật thành công']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi cập nhật database: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
