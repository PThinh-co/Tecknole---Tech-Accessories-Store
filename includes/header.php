<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Phụ kiện công nghệ Tecknole</title>
    <link rel="stylesheet" href="assets/css/reset.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/base.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/about.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="assets/css/category.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="assets/css/products-detail.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="assets/css/cart.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="assets/css/user-cart.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="admin/assets/bootstrap-icons-1.13.1/bootstrap-icons.min.css" />
    <script src="assets/js/modal.js?v=<?php echo time(); ?>"></script>
  </head>

  <body>
    <!-- HEADER  -->
    <header class="header">
      <div class="header-top">
        <div class="inner-logo">
          <a href="index.php">
            <img src="assets/images/logoteck.png" alt="logotecknole" />
            <span>Tecknole</span>
          </a>
        </div>
        <div class="header-search">
          <form
            method="get"
            action="products.php"
            class="search-form"
            role="search"
          >
            <select name="type" aria-label="Chọn danh mục" style="border: none; background: transparent; padding: 0 10px; height: 100%; font-size: 14px; color: #555; outline: none; cursor: pointer;">
              <option value="">Tất cả danh mục</option>
              <?php
                $res_header_cats = mysqli_query($conn, "SELECT name, type FROM tk_categories WHERE status = 'Hiển thị' ORDER BY id");
                if ($res_header_cats) {
                    while ($h_cat = mysqli_fetch_assoc($res_header_cats)) {
                        $selected = (isset($_GET['type']) && $_GET['type'] == $h_cat['type']) ? 'selected' : '';
                        echo "<option value='".htmlspecialchars($h_cat['type'], ENT_QUOTES, 'UTF-8')."' {$selected}>".htmlspecialchars($h_cat['name'], ENT_QUOTES, 'UTF-8')."</option>";
                    }
                }
              ?>
            </select>

            <div class="search-divider"></div>

            <input
              type="text"
              id="js-search"
              class="text_search"
              name="q"
              placeholder="Tìm kiếm sản phẩm..."
              autocomplete="off"
              value="<?php echo isset($_GET['q']) ? htmlspecialchars($_GET['q']) : ''; ?>"
            />
            <button type="submit" class="submit-search">
              <i class="bi bi-search"></i> Tìm kiếm
            </button>

            <div
              class="autocomplete-suggestions"
              id="autocomplete-list"
              role="listbox"
              aria-hidden="true"
            >
              <ul></ul>
            </div>
          </form>
        </div>

        <div class="auth-cart">
          <div id="authArea" style="display: flex; gap: 10px; align-items: center;">
            <!-- Nút Auth/Profile sẽ được JS render vào đây -->
            <button class="btn-auth" onclick="openLoginModal()">Đăng nhập</button>
            <a href="cart.php" class="cart cart-badge">Giỏ hàng <span>0</span></a>
          </div>
        </div>
      </div>
      <!-- THANH MENU -->
      <nav>
        <div class="nav-container">
          <ul class="nav-menu">
            <li><a href="index.php">Trang chủ</a></li>
            <li><a href="about.php">Giới thiệu</a></li>
            <li class="dropdown">
              <a href="products.php">Danh mục sản phẩm ▼</a>
              <ul class="dropdown-menu">
                <?php
                // Tự động quét các danh mục đang cho phép 'Hiển thị'
                $res_dyn_cats = mysqli_query($conn, "SELECT name, type FROM tk_categories WHERE status = 'Hiển thị' ORDER BY id");
                if ($res_dyn_cats) {
                    while ($cat = mysqli_fetch_assoc($res_dyn_cats)) {
                        $nm = htmlspecialchars($cat['name'], ENT_QUOTES, 'UTF-8');
                        $tp = htmlspecialchars($cat['type'], ENT_QUOTES, 'UTF-8');
                        
                        // Tìm hãng có SP
                        $bRes = mysqli_query($conn, "SELECT DISTINCT brand FROM tk_products WHERE type = '$tp' AND brand != '' LIMIT 6");
                        
                        echo "<li>";
                        echo "<a href='products.php?type={$tp}'>{$nm}</a>";
                        if ($bRes && mysqli_num_rows($bRes) > 0) {
                            echo "<ul class='submenu'>";
                            while ($br = mysqli_fetch_assoc($bRes)) {
                                $brN = htmlspecialchars($br['brand'], ENT_QUOTES, 'UTF-8');
                                $brLk = urlencode(strtolower($brN));
                                echo "<li><a href='products.php?type={$tp}&brand={$brLk}'>{$brN}</a></li>";
                            }
                            echo "</ul>";
                        }
                        echo "</li>";
                    }
                }
                ?>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <!-- END HEADER  -->    