<?php
session_start();
require_once '../../includes/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    exit(json_encode(['success' => false]));
}

try {
    $result = $conn->query("SELECT * FROM tk_brands ORDER BY name ASC");
    $brands = [];
    while($row = $result->fetch_assoc()) {
        $brands[] = $row;
    }
    echo json_encode(['success' => true, 'brands' => $brands]);
} catch (Exception $e) {
    echo json_encode(['success' => false]);
}
