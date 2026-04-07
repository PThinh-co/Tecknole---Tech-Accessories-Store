<?php
ob_start();
require_once '../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

try {
    $p_id = isset($_GET['province_id']) ? (int)$_GET['province_id'] : 0;
    if ($p_id <= 0) {
        throw new Exception('Missing province ID');
    }

    $stmt = $conn->prepare("SELECT ward_id as id, ward_name as name FROM tk_locations WHERE province_id = ? ORDER BY ward_name ASC");
    if (!$stmt) {
        throw new Exception($conn->error);
    }
    $stmt->bind_param("i", $p_id);
    $stmt->execute();
    $res = $stmt->get_result();

    $wards = [];
    while ($row = $res->fetch_assoc()) {
        $wards[] = $row;
    }

    echo json_encode(['success' => true, 'wards' => $wards]);
}
catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
