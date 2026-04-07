<?php
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT id, name, type FROM tk_categories WHERE status = 'Hiển thị' ORDER BY id";
$result = mysqli_query($conn, $sql);
$categories = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // Map data to match the JS expectation
        $categories[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'type' => strtolower($row['type']), // Just in case
            'status' => 'active'
        ];
    }
    echo json_encode(['success' => true, 'categories' => $categories]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi truy vấn danh mục']);
}
?>
