<?php
session_start();
require_once '../../includes/db.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$start = $_GET['start'] ?? '';
$end = $_GET['end'] ?? '';
$status = $_GET['status'] ?? '';

try {
    $sql = "SELECT id, import_date, total_cost, status FROM tk_imports WHERE 1=1";
    if ($start) $sql .= " AND DATE(import_date) >= '" . mysqli_real_escape_string($conn, $start) . "'";
    if ($end) $sql .= " AND DATE(import_date) <= '" . mysqli_real_escape_string($conn, $end) . "'";
    if ($status) $sql .= " AND status = '" . mysqli_real_escape_string($conn, $status) . "'";
    
    $sql .= " ORDER BY import_date DESC";
    $result = $conn->query($sql);
    
    $imports = [];
    while ($row = $result->fetch_assoc()) {
        $imports[] = $row;
    }
    
    echo json_encode(['success' => true, 'imports' => $imports]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
