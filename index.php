<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/image_helpers.php';

$featured = [];
$featRes = mysqli_query(
  $conn,
  "SELECT id, name, price, image, stock FROM v_products_simple WHERE status = 'Hiện' AND image != '' ORDER BY id ASC LIMIT 8"
);
if ($featRes && mysqli_num_rows($featRes) > 0) {
  while ($row = mysqli_fetch_assoc($featRes)) {
    $featured[] = $row;
  }
}
?>
<?php include 'includes/header.php'; ?>
    <!-- HERO -->
    <div class="hero-image-background">
      <img
        src="assets/images/banner.jpg"
        alt="hero_banner"
        class="hero-banner"
      />

      <section class="hero-content-wrapper">
        <h1>Chào mừng đến Tecknole Store</h1>
        <p>Nơi bán phụ kiện công nghệ với giá tốt</p>
        <a href="products.php" class="hero-btn">Khám phá ngay</a>
      </section>
    </div>

    <!-- END HERO -->
    <div class="container">
      <h2 class="section-title">Các hãng nổi bật phổ biến</h2>
      <div class="categories">
        <div class="category-card">
          <a href="products.php?brand=razer" class="category-icon">
            <img
              src="assets/images/logo_brand/Razer_snake_logo.png"
              alt="razer_logo"
            />
          </a>
          <div class="category-name">Razer</div>
        </div>
        <div class="category-card">
          <a href="products.php?brand=logitech" class="category-icon">
            <img
              src="assets/images/logo_brand/logitech_logo.png"
              alt="logitech_logo"
            />
          </a>
          <div class="category-name">Logitech</div>
        </div>
        <div class="category-card">
          <a href="products.php?brand=jbl" class="category-icon">
            <img src="assets/images/logo_brand/jbl_logo.jpg" alt="Jbl_logo" />
          </a>
          <div class="category-name">JBL</div>
        </div>
        <div class="category-card">
          <a href="products.php?brand=akko" class="category-icon">
            <img src="assets/images/logo_brand/akko_logo.png" alt="akko_logo" />
          </a>
          <div class="category-name">Akko</div>
        </div>
        <div class="category-card">
          <a href="products.php?brand=apple" class="category-icon">
            <img
              src="assets/images/logo_brand/logo-apple-icon-size_256.png"
              alt="apple_logo"
            />
          </a>
          <div class="category-name">Apple</div>
        </div>
      </div>

      <div class="container featured-products">
        <h2 class="section-title">SẢN PHẨM NỔI BẬT</h2>
        <div class="products-grid" id="featured-products-container">
        <?php if (count($featured) === 0): ?>
            <p style="text-align: center; grid-column: 1 / -1; color: #777;">Hiện chưa có sản phẩm nào được bày bán.</p>
        <?php
else: ?>
            <?php foreach ($featured as $row): ?>
                <?php
    $safeId = (int)$row['id'];
    $safeName = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8');
    $imgUrl = resolve_product_image_url($row['image']);
    $safeImage = htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8');
    $priceFormatted = number_format($row['price'], 0, ',', '.') . 'đ';
?>
            <div class="product-card" data-id="<?php echo $safeId; ?>">
              <a href="product-detail.php?id=<?php echo $safeId; ?>">
                <div class="product-image">
                  <img src="<?php echo $safeImage; ?>" alt="<?php echo $safeName; ?>">
                </div>
              </a>
              <div class="product-info">
                <a href="product-detail.php?id=<?php echo $safeId; ?>" class="product-name"><?php echo $safeName; ?></a>
                <div class="product-price">
                    <?php echo $priceFormatted; ?>
                    <?php if ((int)$row['stock'] <= 0): ?>
                        <span style="color: #ef4444; font-size: 11px; margin-left: 5px; font-weight: 700;">(Hết hàng)</span>
                    <?php endif; ?>
                </div>
                <a href="product-detail.php?id=<?php echo $safeId; ?>" class="view-details" style="display: block; text-align: center; text-decoration: none; box-sizing: border-box;">Xem chi tiết</a>
              </div>
            </div>
          <?php
  endforeach; ?>
        <?php
endif; ?>
        </div>

      </div>
    </div>

      <?php include 'includes/footer.php'; ?>
  </body>
</html>
