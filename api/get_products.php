<?php
require_once '../includes/db.php';
require_once '../includes/image_helpers.php';

header('Content-Type: application/json; charset=utf-8');

// Lấy tham số lọc từ GET
$type = isset($_GET['type']) ? trim($_GET['type']) : '';
$brand = isset($_GET['brand']) ? strtolower(trim($_GET['brand'])) : '';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : '';
$min_price = isset($_GET['min_price']) ? (float)$_GET['min_price'] : 0;
$max_price = isset($_GET['max_price']) && $_GET['max_price'] !== '' ? (float)$_GET['max_price'] : 0;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

$whereSql = " WHERE status = 'Đang bán' AND category_status = 'Hiển thị'";
$params = [];
$types = "";

if ($type !== '') {
    $whereSql .= " AND type = ?";
    $params[] = $type;
    $types .= "s";
}
if ($brand !== '') {
    $whereSql .= " AND brand_slug = ?";
    $params[] = $brand;
    $types .= "s";
}
if ($search !== '') {
    $whereSql .= " AND (name LIKE ? OR code LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= "ss";
}
if ($min_price > 0) {
    $whereSql .= " AND price >= ?";
    $params[] = $min_price;
    $types .= "d";
}
if ($max_price > 0) {
    $whereSql .= " AND price <= ?";
    $params[] = $max_price;
    $types .= "d";
}

$orderBy = " ORDER BY id ASC";
if ($sort === 'price_asc' || $sort === 'price-asc') {
    $orderBy = " ORDER BY price ASC";
} elseif ($sort === 'price_desc' || $sort === 'price-desc') {
    $orderBy = " ORDER BY price DESC";
} elseif ($sort === 'name_asc' || $sort === 'name-asc') {
    $orderBy = " ORDER BY name ASC";
} elseif ($sort === 'name_desc' || $sort === 'name-desc') {
    $orderBy = " ORDER BY name DESC";
}

$sql = "SELECT id, code, name, price, sale_price, old_price, stock, image, type, brand, badge, short_desc, full_desc, brand_slug 
        FROM v_products_full $whereSql $orderBy LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

$stmt = mysqli_prepare($conn, $sql);
if ($stmt) {
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Resolve image URL
        $row['image'] = resolve_product_image_url($row['image']);
        
        // Convert prices to numbers
        $row['price'] = (int)$row['price'];
        $row['oldPrice'] = (int)$row['old_price']; // Align with JS expected key
        $row['salePrice'] = (int)$row['sale_price'];
        unset($row['old_price']);
        unset($row['sale_price']);
        
        $products[] = $row;
    }
    echo json_encode(['success' => true, 'products' => $products]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi truy vấn SQL: ' . mysqli_error($conn)]);
}
?>
