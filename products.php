<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/image_helpers.php';

if (!function_exists('bindParamsByRef')) {
    function bindParamsByRef($stmt, $types, $values)
    {
        $refs = [];
        foreach ($values as $k => $v) {
            $refs[$k] = &$values[$k];
        }
        array_unshift($refs, $types);
        call_user_func_array([$stmt, 'bind_param'], $refs);
    }
}

$type = isset($_GET['type']) ? trim($_GET['type']) : '';
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : '';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;

$brand = isset($_GET['brand']) ? strtolower(trim($_GET['brand'])) : '';
if ($brand !== '' && !preg_match('/^[a-z0-9]+$/', $brand)) {
    $brand = '';
}

if (empty($search) && isset($_GET['q'])) {
    $search = trim($_GET['q']);
}
if ($page < 1) {
    $page = 1;
}

$limit = 8;
$whereSql = " WHERE status = 'Đang bán'";
$paramTypes = '';
$paramValues = [];

if ($type !== '') {
    $whereSql .= ' AND type = ?';
    $paramTypes .= 's';
    $paramValues[] = $type;
}
if ($brand !== '') {
    $whereSql .= ' AND brand = ?';
    $paramTypes .= 's';
    $paramValues[] = $brand;
}
if ($search !== '') {
    $whereSql .= ' AND name LIKE ?';
    $paramTypes .= 's';
    $paramValues[] = '%' . $search . '%';
}

$min_p = isset($_GET['min_price']) ? (float)$_GET['min_price'] : 0;
$max_p = isset($_GET['max_price']) && $_GET['max_price'] !== '' ? (float)$_GET['max_price'] : 0;

if ($min_p > 0) {
    $whereSql .= ' AND price >= ?';
    $paramTypes .= 'd';
    $paramValues[] = $min_p;
}
if ($max_p > 0) {
    $whereSql .= ' AND price <= ?';
    $paramTypes .= 'd';
    $paramValues[] = $max_p;
}

$countSql = 'SELECT COUNT(*) AS total FROM v_products_simple' . $whereSql;
$countStmt = mysqli_prepare($conn, $countSql);
if ($countStmt && $paramTypes !== '') {
    bindParamsByRef($countStmt, $paramTypes, $paramValues);
}
if ($countStmt) {
    mysqli_stmt_execute($countStmt);
    $countResult = mysqli_stmt_get_result($countStmt);
    $countRow = $countResult ? mysqli_fetch_assoc($countResult) : null;
    $total_products = $countRow ? (int) $countRow['total'] : 0;
    mysqli_stmt_close($countStmt);
} else {
    $total_products = 0;
}

$total_pages = max(1, (int) ceil($total_products / $limit));
if ($page > $total_pages) {
    $page = $total_pages;
}
$offset = ($page - 1) * $limit;

$orderBy = ' ORDER BY id ASC';
if ($sort === 'price_asc') {
    $orderBy = ' ORDER BY price ASC';
} elseif ($sort === 'price_desc') {
    $orderBy = ' ORDER BY price DESC';
}

$dataSql = 'SELECT * FROM v_products_simple' . $whereSql . $orderBy . ' LIMIT ? OFFSET ?';
$dataStmt = mysqli_prepare($conn, $dataSql);
$dataTypes = $paramTypes . 'ii';
$dataValues = $paramValues;
$dataValues[] = $limit;
$dataValues[] = $offset;

if ($dataStmt) {
    bindParamsByRef($dataStmt, $dataTypes, $dataValues);
    mysqli_stmt_execute($dataStmt);
    $result = mysqli_stmt_get_result($dataStmt);
} else {
    $result = false;
}
?>
<?php include 'includes/header.php'; ?>
    <style>
      /* Override CSS để 4 sản phẩm mỗi hàng */
      .products-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        margin-bottom: 30px;
      }

      @media (max-width: 1024px) {
        .products-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 768px) {
        .products-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
      }

      @media (max-width: 480px) {
        .products-grid {
          grid-template-columns: 1fr;
          gap: 15px;
        }
      }
    </style>
    <div class="container">
      <?php
      $displayTitle = "Tất cả sản phẩm";
      if ($type !== '') {
          $nameRes = mysqli_query($conn, "SELECT name FROM tk_categories WHERE type = '$type' LIMIT 1");
          if ($nameRes && $nr = mysqli_fetch_assoc($nameRes)) {
              $displayTitle = "Sản phẩm " . $nr['name'];
          }
      }
      ?>
      <h2 class="section-title" id="category-title"><?php echo $displayTitle; ?></h2>
      <p id="category-desc" style="display: none;"></p>
      <form method="GET" action="products.php" class="filter-bar" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 30px; align-items: center; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <?php if ($brand !== ''): ?>
        <input type="hidden" name="brand" value="<?php echo htmlspecialchars($brand, ENT_QUOTES, 'UTF-8'); ?>">
        <?php endif; ?>
        <select name="type" onchange="this.form.submit()" style="padding: 8px 12px; border-radius: 5px; border: 1px solid #ddd; outline: none;">
            <option value="">Tất cả danh mục</option>
            <?php
            $catSql = "SELECT name, type FROM tk_categories WHERE status = 'Hiển thị' ORDER BY id";
            $catRes = mysqli_query($conn, $catSql);
            if ($catRes) {
                while ($c = mysqli_fetch_assoc($catRes)) {
                    $selected = ($type === $c['type']) ? 'selected' : '';
                    echo '<option value="'.htmlspecialchars($c['type'], ENT_QUOTES, 'UTF-8').'" '.$selected.'>'.htmlspecialchars($c['name'], ENT_QUOTES, 'UTF-8').'</option>';
                }
            }
            ?>
        </select>

        <select name="sort" onchange="this.form.submit()" style="padding: 8px 12px; border-radius: 5px; border: 1px solid #ddd; outline: none;">
            <option value="">Sắp xếp mặc định</option>
            <option value="price_asc" <?php echo ($sort === 'price_asc') ? 'selected' : ''; ?>>Giá: Thấp đến Cao</option>
            <option value="price_desc" <?php echo ($sort === 'price_desc') ? 'selected' : ''; ?>>Giá: Cao xuống Thấp</option>
        </select>

        <div class="price-filter" style="display: flex; align-items: center; gap: 8px; background: #f9f9f9; padding: 4px 10px; border-radius: 8px; border: 1px solid #eee;">
            <span style="font-size: 13px; font-weight: 600; color: #666;">Giá:</span>
            <input type="number" name="min_price" id="filter-min-price" placeholder="Từ" value="<?php echo isset($_GET['min_price']) ? htmlspecialchars($_GET['min_price']) : ''; ?>" style="width: 80px; padding: 5px 8px; border: 1px solid #ddd; border-radius: 4px; outline: none; font-size: 13px;">
            <span style="color: #ccc;">-</span>
            <input type="number" name="max_price" id="filter-max-price" placeholder="Đến" value="<?php echo isset($_GET['max_price']) ? htmlspecialchars($_GET['max_price']) : ''; ?>" style="width: 80px; padding: 5px 8px; border: 1px solid #ddd; border-radius: 4px; outline: none; font-size: 13px;">
        </div>

        <div style="display: flex; margin-left: auto; gap: 5px;">
            <input type="text" name="search" placeholder="Nhập tên sản phẩm..." value="<?php echo isset($_GET['search']) ? htmlspecialchars($_GET['search'], ENT_QUOTES, 'UTF-8') : (isset($_GET['q']) ? htmlspecialchars($_GET['q'], ENT_QUOTES, 'UTF-8') : ''); ?>" style="padding: 8px 15px; border-radius: 5px; border: 1px solid #ddd; outline: none; width: 250px;">
            <button type="submit" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Tìm</button>
        </div>
      </form>

      <div class="products-grid" id="products-container">
          <?php
          if ($result && mysqli_num_rows($result) > 0) {
              while ($row = mysqli_fetch_assoc($result)) {
                  $priceFormatted = number_format($row['price'], 0, ',', '.') . 'đ';
                  $safeName = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8');
                  $imgUrl = resolve_product_image_url($row['image']);
                  $safeImage = htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8');
                  $safeId = (int) $row['id'];
                  $safeBadge = htmlspecialchars((string) $row['badge'], ENT_QUOTES, 'UTF-8');

                  $oldPriceHtml = ($row['old_price'] > 0) ? "<span class='old-price' style='text-decoration: line-through; color: #999; font-size: 14px; margin-left: 10px;'>" . number_format($row['old_price'], 0, ',', '.') . "đ</span>" : "";
                  $badgeHtml = $safeBadge !== '' ? "<span class='product-badge'>{$safeBadge}</span>" : "";

                  echo '
                  <div class="product-card" data-id="'.$safeId.'">
                      <a href="product-detail.php?id='.$safeId.'">
                          <div class="product-image">
                              <img src="'.$safeImage.'" alt="'.$safeName.'">
                              '.$badgeHtml.'
                          </div>
                      </a>
                      <div class="product-info">
                          <a href="product-detail.php?id='.$safeId.'" class="product-name">'.$safeName.'</a>
                          <div class="product-price '.($row['old_price'] > 0 ? 'price-discounted' : '').'">'.$priceFormatted . $oldPriceHtml.'</div>
                          <a href="product-detail.php?id='.$safeId.'" class="view-details" style="display: block; text-align: center; text-decoration: none; box-sizing: border-box;">Xem chi tiết</a>
                      </div>
                  </div>';
              }
          } else {
              echo '<p style="text-align: center; grid-column: 1 / -1; padding: 50px; font-size: 18px; color: #777;">Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.</p>';
          }
          ?>
      </div>

      <?php if ($total_pages > 1): ?>
      <div class="pagination" style="display: flex; justify-content: center; gap: 10px; margin-top: 40px; margin-bottom: 40px;">
          <?php for ($i = 1; $i <= $total_pages; $i++): ?>
              <?php
              $queryParams = $_GET;
              $queryParams['page'] = $i;
              $link = '?' . http_build_query($queryParams);
              ?>
              <a href="products.php<?php echo htmlspecialchars($link, ENT_QUOTES, 'UTF-8'); ?>" class="page-num" style="padding: 8px 15px; border-radius: 5px; text-decoration: none; border: 1px solid #667eea; <?php echo ($page == $i) ? 'background: #667eea; color: white;' : 'background: white; color: #667eea;'; ?>">
                  <?php echo $i; ?>
              </a>
          <?php endfor; ?>
      </div>
      <?php endif; ?>
      <?php if (isset($dataStmt) && $dataStmt) {
          mysqli_stmt_close($dataStmt);
      } ?>
</div>
<?php include 'includes/footer.php'; ?>
