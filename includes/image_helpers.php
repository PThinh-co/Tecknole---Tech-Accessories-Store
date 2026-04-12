<?php
/**
 * Chuẩn hóa đường dẫn ảnh: nếu file không tồn tại trên đĩa thì dùng ảnh mặc định (tránh ảnh vỡ khi up host).
 */
function resolve_product_image_url($relativePath)
{
    $relativePath = trim((string)$relativePath);
    if ($relativePath === '') {
        return '';
    }
    $relativePath = str_replace('\\', '/', $relativePath);
    $relativePath = ltrim($relativePath, '/');

    $base = dirname(__DIR__);
    $full = $base . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath);
    if (is_file($full)) {
        return $relativePath;
    }

    return '';
}
