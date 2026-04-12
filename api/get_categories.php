<?php
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT id, name FROM tk_categories WHERE status = 'Hiển thị' ORDER BY id";
$result = mysqli_query($conn, $sql);
$categories = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $categories[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'type' => (int)$row['id'], // Map ID to type for JS compatibility
            'status' => 'Hiển thị'
        ];
    }
    echo json_encode(['success' => true, 'categories' => $categories]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi truy vấn danh mục']);
}
?>
