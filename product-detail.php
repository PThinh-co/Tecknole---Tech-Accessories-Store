<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/image_helpers.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$sql = 'SELECT * FROM v_products_full WHERE id = ? AND status = \'Đang bán\' LIMIT 1';
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
    $safeType = htmlspecialchars((string)$p['type'], ENT_QUOTES, 'UTF-8');
    $safeName = htmlspecialchars((string)$p['name'], ENT_QUOTES, 'UTF-8');
    $safeBrand = htmlspecialchars((string)$p['brand'], ENT_QUOTES, 'UTF-8');
    $safeCode = htmlspecialchars((string)$p['code'], ENT_QUOTES, 'UTF-8');
    $safeShortDesc = htmlspecialchars((string)$p['short_desc'], ENT_QUOTES, 'UTF-8');

    $galleryRaw = !empty($p['gallery_images']) ? explode('|', $p['gallery_images']) : [$p['image']];
    $gallery = [];
    foreach ($galleryRaw as $g) {
        $g = trim((string)$g);
        if ($g === '') {
            continue;
        }
        $resolved = resolve_product_image_url($g);
        if (!in_array($resolved, $gallery, true)) {
            $gallery[] = $resolved;
        }
    }
    if (count($gallery) === 0) {
        $gallery[] = resolve_product_image_url($p['image']);
    }

    $specsRaw = !empty($p['specs_list']) ? explode('||', $p['specs_list']) : [];
    $specs = array_values(array_unique(array_filter(array_map('trim', $specsRaw))));
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
            <div style="display: flex; gap: 10px; margin-top: 15px; overflow-x: auto; padding-bottom: 10px;">
                <?php foreach ($gallery as $index => $img): ?>
                    <img src="<?php echo htmlspecialchars($img, ENT_QUOTES, 'UTF-8'); ?>"
                         onclick="document.getElementById('product-main-image').src=this.src"
                         style="width: 80px; height: 80px; object-fit: contain; background: #fff; border-radius: 8px; cursor: pointer; border: 2px solid <?php echo $index === 0 ? '#667eea' : '#ddd'; ?>; transition: 0.3s;"
                         onmouseover="this.style.borderColor='#667eea'"
                         onmouseout="if(document.getElementById('product-main-image').src !== this.src) this.style.borderColor='#ddd'">
                <?php
    endforeach; ?>
            </div>
        </div>

        <div class="product-info-detail">
            <h1 style="font-size: 28px; margin-bottom: 10px; line-height: 1.3;"><?php echo $safeName; ?></h1>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Thương hiệu: <strong style="color: #333; text-transform: uppercase;"><?php echo $safeBrand; ?></strong> | Mã SP: <?php echo $safeCode; ?></p>

            <div class="product-price-block">
                <span class="product-detail-main-price" style="font-weight: bold; color: <?php echo($p['old_price'] > 0) ? '#ff4757' : 'var(--color-one)'; ?> !important;">
                    <?php echo number_format($p['price'], 0, ',', '.'); ?>đ
                    <?php if ($p['old_price'] > 0): ?>
                        <span class="old-price" style="text-decoration: line-through; color: #999; font-size: 18px; margin-left: 15px; font-weight: 400;"><?php echo number_format($p['old_price'], 0, ',', '.'); ?>đ</span>
                    <?php
    endif; ?>
                </span>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                <p style="margin: 0; line-height: 1.6;"><?php echo $safeShortDesc; ?></p>
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

    <div style="margin-top: 60px; border-top: 1px solid #eee; padding-top: 40px;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
            <div style="line-height: 1.8; font-size: 15px;">
                <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; display: inline-block; margin-bottom: 20px;">Mô tả chi tiết</h3>
                <div class="full-desc-content">
                    <?php echo !empty($p['full_desc']) ? $p['full_desc'] : '<p style="color: #666; font-style: italic;">Đang cập nhật mô tả chi tiết cho sản phẩm này. Quý khách vui lòng quay lại sau hoặc liên hệ Hotline để được tư vấn.</p>'; ?>
                </div>
            </div>

            <div>
                <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; display: inline-block; margin-bottom: 20px;">Thông số kỹ thuật</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tbody>
                        <?php
    if (empty($specs)) {
        // Thông số mặc định nếu DB trống
        echo "<tr><th style='padding: 12px; border: 1px solid #ddd; background: #f8f9fa; width: 40%; text-align: left; font-weight: 600;'>Bảo hành</th><td style='padding: 12px; border: 1px solid #ddd;'>12 tháng chính hãng</td></tr>";
        echo "<tr><th style='padding: 12px; border: 1px solid #ddd; background: #f8f9fa; width: 40%; text-align: left; font-weight: 600;'>Tình trạng</th><td style='padding: 12px; border: 1px solid #ddd;'>Mới 100% fullbox</td></tr>";
    } else {
        foreach ($specs as $spec) {
            if (!is_string($spec))
                continue;
            $parts = explode(':', $spec, 2);

            if (count($parts) >= 2) {
                $specLabel = htmlspecialchars(trim($parts[0]), ENT_QUOTES, 'UTF-8');
                $specValue = htmlspecialchars(trim($parts[1]), ENT_QUOTES, 'UTF-8');
                echo "<tr>
                                            <th style='padding: 12px; border: 1px solid #ddd; background: #f8f9fa; width: 40%; text-align: left; font-weight: 600;'>{$specLabel}</th>
                                            <td style='padding: 12px; border: 1px solid #ddd;'>{$specValue}</td>
                                          </tr>";
            }
        }
    }
?>
                    </tbody>
                </table>
            </div>
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
