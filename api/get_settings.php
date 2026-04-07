<?php
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT key_name, value_text FROM tk_settings";
$result = mysqli_query($conn, $sql);

$settings = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $settings[$row['key_name']] = $row['value_text'];
    }
}

echo json_encode(['success' => true, 'settings' => $settings]);
?>
