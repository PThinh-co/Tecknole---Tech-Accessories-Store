<?php
header('Content-Type: application/json');

$dir = '../../assets/images/img/';
$result = [];

// Đọc thư mục đệ quy để lấy toàn bộ ảnh
function scanImages($dir, &$result, $basePath = 'assets/images/img/') {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $fullPath = $dir . $file;
        if (is_dir($fullPath)) {
            scanImages($fullPath . '/', $result, $basePath . $file . '/');
        } else {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
                $result[] = $basePath . $file;
            }
        }
    }
}

scanImages($dir, $result);
echo json_encode(['success' => true, 'images' => $result]);
?>
