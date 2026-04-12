<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/image_helpers.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$sql = 'SELECT * FROM v_products_full WHERE id = ? AND status = \'Hiện\' AND stock > 0 LIMIT 1';
$stmt = mysqli_prepare($conn, $sql);
$result = false;
$p = null;
if ($stmt) {
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
}

if ($result && mysqli_num_rows($result) > 0) {
    $p = mysqli_fetch_assoc($result);
    $safeType = htmlspecialchars((string)($p['category_name'] ?? 'Khác'), ENT_QUOTES, 'UTF-8');
    $safeName = htmlspecialchars((string)$p['name'], ENT_QUOTES, 'UTF-8');
    $safeBrand = htmlspecialchars((string)$p['brand_name'], ENT_QUOTES, 'UTF-8');
    $safeDescription = htmlspecialchars((string)$p['description'], ENT_QUOTES, 'UTF-8');

    $gallery = [resolve_product_image_url($p['image'])];
}
?>
<?php include 'includes/header.php'; ?>

<?php if ($p): ?>
<div class="container" style="margin-top: 30px; margin-bottom: 50px;">



    <div id="product-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">

        <div class="product-gallery">
            <div style="position: relative;">
                <img id="product-main-image" src="<?php echo htmlspecialchars($gallery[0], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo $safeName; ?>" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); object-fit: contain; background: #fff;">
            </div>
        </div>

        <div class="product-info-detail">
            <h1 style="font-size: 28px; margin-bottom: 10px; line-height: 1.3;"><?php echo $safeName; ?></h1>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Thương hiệu: <strong style="color: #333; text-transform: uppercase;"><?php echo $safeBrand; ?></strong></p>

            <div class="product-price-block">
                <span class="product-detail-main-price" style="font-weight: bold; color: var(--color-one) !important;">
                    <?php echo number_format($p['price'], 0, ',', '.'); ?>đ
                </span>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                <p style="margin: 0; line-height: 1.6;"><?php echo $safeDescription; ?></p>
            </div>

            <div style="margin-bottom: 25px;">
                <p>Tình trạng: <span style="font-weight: bold; color: <?php echo $p['stock'] > 0 ? '#2ecc71' : '#e74c3c'; ?>;"><?php echo $p['stock'] > 0 ? "Còn {$p['stock']} sản phẩm" : "Hết hàng"; ?></span></p>
            </div>

            <?php if ($p['stock'] > 0): ?>
            <div style="display: flex; gap: 15px; align-items: center;">
                <input type="number" id="quantity" value="1" min="1" max="<?php echo (int)$p['stock']; ?>" style="width: 80px; padding: 12px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 16px;">
                <button type="button" class="add-to-cart" data-id="<?php echo (int)$p['id']; ?>" style="flex: 1; padding: 14px; background: #6c9bff; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    Thêm vào giỏ
                </button>
            </div>
            <?php
    endif; ?>
        </div>
    </div>

</div>


<?php
else: ?>
<div class="container" style="text-align: center; padding: 100px 0;">
    <img src="assets/images/sadmeme.jpg" style="width: 150px; opacity: 0.5; margin-bottom: 20px; border-radius: 8px;" alt="">
    <h2 style="color: #e74c3c; margin-bottom: 15px;">Sản phẩm không tồn tại hoặc đã ngừng bán!</h2>
    <p style="color: #666; margin-bottom: 30px;">Rất tiếc, sản phẩm bạn đang tìm kiếm không có sẵn lúc này.</p>
    <a href="products.php" style="display: inline-block; padding: 12px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Quay lại cửa hàng</a>
</div>
<?php
endif; ?>

<?php
if (isset($stmt) && $stmt) {
    mysqli_stmt_close($stmt);
}
?>

<?php include 'includes/footer.php'; ?>
