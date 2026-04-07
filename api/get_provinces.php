<?php
ob_start(); // Prevent early output
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

try {
    $res = $conn->query("SELECT DISTINCT province_id as id, province_name as name FROM tk_locations ORDER BY province_name ASC");
    if (!$res) {
        throw new Exception($conn->error);
    }
    $provinces = [];
    while ($row = $res->fetch_assoc()) {
        $provinces[] = $row;
    }

    echo json_encode(['success' => true, 'provinces' => $provinces]);
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
