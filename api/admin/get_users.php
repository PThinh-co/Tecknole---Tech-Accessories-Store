<?php
session_start();
require_once '../../includes/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

try {
    $roleFilter = isset($_GET['role']) ? mysqli_real_escape_string($conn, $_GET['role']) : '';
    $q = "SELECT id, username, fullname, email, phone, address, role, status, created_at FROM tk_users";
    if ($roleFilter) {
        $q .= " WHERE role = '$roleFilter'";
    }
    $q .= " ORDER BY id DESC";
    $result = $conn->query($q);
    $users = [];
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode([
        'success' => true, 
        'users' => $users,
        'current_id' => $_SESSION['admin_user_id'] ?? 0,
        'current_role' => $_SESSION['admin_role'] ?? 'admin'
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
