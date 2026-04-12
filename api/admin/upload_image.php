<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

if (!isset($_FILES['image'])) {
    exit(json_encode(['success' => false, 'message' => 'Không tìm thấy file tải lên']));
}

$file = $_FILES['image'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];
$fileError = $file['error'];

$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'webp'];

if (in_array($fileExt, $allowed)) {
    if ($fileError === 0) {
        if ($fileSize < 5000000) { // 5MB limit
            $fileNewName = uniqid('', true) . "." . $fileExt;
            
            // Determine relative path based on category if needed, but for now just assets/images/products
            $uploadDir = '../../assets/images/products/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileDestination = $uploadDir . $fileNewName;
            
            if (move_uploaded_file($fileTmpName, $fileDestination)) {
                // Return relative path for DB
                $dbPath = 'assets/images/products/' . $fileNewName;
                echo json_encode(['success' => true, 'image_path' => $dbPath]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Lỗi khi di chuyển file']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'File quá lớn (tối đa 5MB)']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi khi tải file: ' . $fileError]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Định dạng file không được hỗ trợ (chỉ JPG, PNG, WEBP)']);
}
