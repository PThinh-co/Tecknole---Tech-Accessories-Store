<?php
session_start();
require_once '../../includes/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    exit(json_encode(['success' => false]));
}

try {
    $sql = "SELECT id, name, status FROM tk_categories ORDER BY id";
    $result = mysqli_query($conn, $sql);
    $categories = [];

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $categories[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'status' => $row['status']
            ];
        }
        echo json_encode(['success' => true, 'categories' => $categories]);
    }
    else {
        echo json_encode(['success' => false]);
    }
}
catch (Exception $e) {
    echo json_encode(['success' => false]);
}
