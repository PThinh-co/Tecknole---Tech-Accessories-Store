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
$whereSql = " WHERE status = 'Hiện'";
$paramTypes = '';
$paramValues = [];

if ($type !== '') {
    $whereSql .= ' AND category_id = ?';
    $paramTypes .= 'i';
    $paramValues[] = (int)$type;
}
if ($brand !== '') {
    $whereSql .= ' AND brand_name = ?';
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
          $nameRes = mysqli_query($conn, "SELECT name FROM tk_categories WHERE id = " . (int)$type . " LIMIT 1");
          if ($nameRes && $nr = mysqli_fetch_assoc($nameRes)) {
              $displayTitle = "Sản phẩm " . $nr['name'];
          }
      }
      ?>
      <h2 class="section-title" id="category-title"><?php echo $displayTitle; ?></h2>
      <p id="category-desc" style="display: none;"></p>
      <form method="GET" action="products.php" class="advanced-filter-bar">
        <?php if ($sort !== ''): ?>
          <input type="hidden" name="sort" value="<?php echo htmlspecialchars($sort, ENT_QUOTES, 'UTF-8'); ?>">
        <?php endif; ?>
        
        <div class="filter-group">
          <select name="type">
            <option value="">Theo mục lục</option>
            <?php
            $catSql = "SELECT id, name FROM tk_categories WHERE status = 'Hiển thị' ORDER BY id";
            $catRes = mysqli_query($conn, $catSql);
            if ($catRes) {
                while ($c = mysqli_fetch_assoc($catRes)) {
                    $selected = ($type == $c['id']) ? 'selected' : '';
                    echo '<option value="'.$c['id'].'" '.$selected.'>'.htmlspecialchars($c['name'], ENT_QUOTES, 'UTF-8').'</option>';
                }
            }
            ?>
          </select>
        </div>

        <div class="filter-group group-name">
          <input type="text" name="search" placeholder="Tên sản phẩm..." value="<?php echo htmlspecialchars($search, ENT_QUOTES, 'UTF-8'); ?>">
        </div>

        <div class="filter-group">
          <select name="sort">
              <option value="">Sắp xếp mặc định</option>
              <option value="price_asc" <?php echo ($sort === 'price_asc') ? 'selected' : ''; ?>>Giá: Thấp đến Cao</option>
              <option value="price_desc" <?php echo ($sort === 'price_desc') ? 'selected' : ''; ?>>Giá: Cao xuống Thấp</option>
          </select>
        </div>

        <div class="filter-group price-inputs">
          <input type="number" name="min_price" placeholder="Giá từ..." value="<?php echo $min_p > 0 ? $min_p : ''; ?>">
          <input type="number" name="max_price" placeholder="Giá đến..." value="<?php echo $max_p > 0 ? $max_p : ''; ?>">
        </div>

        <div class="filter-actions">
          <button type="submit" class="btn-search">Tìm kiếm</button>
          <a href="products.php" class="btn-clear">Đặt lại</a>
        </div>
      </form>

      <style>
        .advanced-filter-bar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 25px;
          background: #ffffff;
          padding: 10px 15px;
          border-radius: 12px;
          align-items: center;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
        }

        .filter-group {
          flex: 1;
          min-width: 140px;
        }

        .filter-group.group-name {
          flex: 1.2;
          min-width: 150px;
        }

        .filter-group.price-inputs {
          flex: 1.5;
          display: flex;
          gap: 6px;
          min-width: 220px;
        }

        .filter-group select, 
        .filter-group input {
          width: 100%;
          padding: 0 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fcfdfe;
          font-size: 13.5px;
          color: #1e293b;
          outline: none;
          transition: all 0.2s ease;
          height: 40px;
          font-family: inherit;
        }

        .filter-group input::placeholder {
          color: #94a3b8;
        }

        .filter-group input:focus, 
        .filter-group select:focus {
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          padding-left: 12px;
          border-left: 1px solid #f1f5f9;
        }

        .btn-search {
          padding: 0 20px;
          height: 40px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 13.5px;
          transition: all 0.2s;
        }

        .btn-search:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        .btn-clear {
          padding: 0 15px;
          height: 40px;
          line-height: 38px;
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          font-size: 13.5px;
          box-sizing: border-box;
          text-align: center;
        }

        .btn-clear:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #334155;
        }

        @media (max-width: 1024px) {
          .filter-actions {
            border-left: none;
            padding-left: 0;
            margin-top: 5px;
            width: 100%;
          }
          .btn-search, .btn-clear {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .filter-group {
            min-width: 100%;
          }
        }
      </style>

      <div class="products-grid" id="products-container">
          <?php
          if ($result && mysqli_num_rows($result) > 0) {
              while ($row = mysqli_fetch_assoc($result)) {
                  $priceFormatted = number_format($row['price'], 0, ',', '.') . 'đ';
                  $safeName = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8');
                  $imgUrl = resolve_product_image_url($row['image']);
                  $safeImage = htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8');
                  $safeId = (int) $row['id'];
                  $safeBadge = htmlspecialchars((string) ($row['badge'] ?? ''), ENT_QUOTES, 'UTF-8');

                  $oldPriceHtml = "";
                  $badgeHtml = $safeBadge !== '' ? "<span class='product-badge'>{$safeBadge}</span>" : "";

                  echo '
                  <div class="product-card" data-id="'.$safeId.'">
                      <a href="product-detail.php?id='.$safeId.'">
                          <div class="product-image">
                              <img src="'.$safeImage.'" alt="'.$safeName.'">
                          </div>
                      </a>
                      <div class="product-info">
                          <a href="product-detail.php?id='.$safeId.'" class="product-name">'.$safeName.'</a>
                          <div class="product-price">
                              '.$priceFormatted.'
                              '.((int)$row['stock'] <= 0 ? '<span style="color: #ef4444; font-size: 11px; margin-left: 5px; font-weight: 700;">(Hết hàng)</span>' : '').'
                          </div>
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
