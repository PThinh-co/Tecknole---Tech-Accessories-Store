<?php
session_start();
// Kiểm tra quyền admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Lấy thông tin admin từ session
$adminName = isset($_SESSION['admin_username']) ? $_SESSION['admin_username'] : 'Admin';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>BẢNG QUẢN TRỊ - Tecknole</title>
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="assets/css/advanced_admin.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" href="assets/bootstrap-icons-1.13.1/bootstrap-icons.min.css" />
</head>
<body>

<div class="admin-container" id="adminPage">
    <div class="sidebar">
        <div class="sidebar-header">
            <h3>TECKNOLE</h3>
            <div style="font-size: 13px; color: #94a3b8; font-weight: 500; margin-bottom: 15px;">Chào mừng, <?php echo htmlspecialchars($adminName); ?></div>
            <div class="admin-info" id="adminNameDisplay" style="display: none;"><?php echo htmlspecialchars($adminName); ?> <br> (Quản trị viên)</div>
        </div>
        <div class="menu-item active" data-section="dashboard"><i class="bi bi-grid-1x2-fill"></i> Tổng quan</div>
        <div class="menu-item" data-section="users"><i class="bi bi-people-fill"></i> Quản lý Người dùng</div>
        <div class="menu-item" data-section="categories"><i class="bi bi-folder-fill"></i> Quản lý Loại sản phẩm</div>
        <div class="menu-item" data-section="products"><i class="bi bi-box-seam-fill"></i> Quản lý Sản phẩm</div>
        <div class="menu-item" data-section="imports"><i class="bi bi-truck"></i> Nhập hàng Kho</div>
        <div class="menu-item" data-section="pricing"><i class="bi bi-tag-fill"></i> Quản lý Giá bán</div>
        <div class="menu-item" data-section="orders"><i class="bi bi-receipt"></i> Đơn hàng Khách</div>
        <div class="menu-item" data-section="inventory"><i class="bi bi-bar-chart-fill"></i> Tồn kho & Báo cáo</div>
        <div class="menu-item" data-section="account"><i class="bi bi-person-bounding-box"></i> Hồ sơ cá nhân</div>
        
        <div style="margin-top: auto; padding: 20px;">
            <button class="adv-btn adv-btn-danger" style="width: 100%; justify-content: center; display: flex; align-items: center; gap: 8px; background: #ef4444;" onclick="logoutAdmin()">
                <i class="bi bi-box-arrow-right"></i> Đăng xuất
            </button>
        </div>
    </div>

    <div class="main-content">
        <div class="top-bar">
            <h2 id="pageTitle">Tổng quan</h2>
            <div style="display: flex; align-items: center; gap: 15px;">
                <!-- Logout moved to sidebar -->
            </div>
        </div>

        <div class="content-area">
            <!-- DASHBOARD SECTION (MODERN REDESIGN) -->
            <div class="section active" id="dashboard">
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 40px;">
                    <!-- Doanh thu -->
                    <div class="stat-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #10b981;"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Doanh thu tổng</span>
                            <i class="bi bi-currency-dollar" style="font-size: 20px; color: #10b981;"></i>
                        </div>
                        <div class="stat-value" id="totalRevenue" style="font-size: 24px; font-weight: 800; color: #0f172a;">0 đ</div>
                        <div style="font-size: 12px; color: #10b981; margin-top: 8px; font-weight: 600;"><i class="bi bi-graph-up"></i> +12% vs tháng trước</div>
                    </div>

                    <!-- Khách hàng -->
                    <div class="stat-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #3b82f6;"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Khách hàng</span>
                            <i class="bi bi-people" style="font-size: 20px; color: #3b82f6;"></i>
                        </div>
                        <div class="stat-value" id="totalUsers" style="font-size: 24px; font-weight: 800; color: #0f172a;">0</div>
                        <div style="font-size: 12px; color: #3b82f6; margin-top: 8px; font-weight: 600;"><i class="bi bi-person-check"></i> Đang hoạt động</div>
                    </div>

                    <!-- Đơn hàng -->
                    <div class="stat-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #f59e0b;"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Đơn mới chờ duyệt</span>
                            <i class="bi bi-cart-check" style="font-size: 20px; color: #f59e0b;"></i>
                        </div>
                        <div class="stat-value" id="newOrders" style="font-size: 24px; font-weight: 800; color: #0f172a;">0</div>
                        <div style="font-size: 12px; color: #ef4444; margin-top: 8px; font-weight: 600;"><i class="bi bi-clock-history"></i> Cần xử lý ngay</div>
                    </div>

                    <!-- Sản phẩm -->
                    <div class="stat-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #6366f1;"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Sản phẩm</span>
                            <i class="bi bi-box-seam" style="font-size: 20px; color: #6366f1;"></i>
                        </div>
                        <div class="stat-value" id="totalProducts" style="font-size: 24px; font-weight: 800; color: #0f172a;">0</div>
                        <div style="font-size: 12px; color: #6366f1; margin-top: 8px; font-weight: 600;"><i class="bi bi-check2-circle"></i> Đang kinh doanh</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1.3fr; gap: 30px;">
                    <!-- CỘT TRÁI: ĐƠN HÀNG MỚI NHẤT -->
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size: 18px; font-weight: 800; color: #1e293b;"><i class="bi bi-receipt" style="color:#3b82f6;"></i> Đơn hàng vừa đặt</h3>
                        </div>
                        <div id="recentOrdersDashboard" style="display: flex; flex-direction: column; gap: 12px;">
                            <p style="color: #94a3b8; text-align: center; padding: 40px;">Đang tải danh sách đơn...</p>
                        </div>
                    </div>

                    <!-- CỘT PHẢI: CẢNH BÁO KHO -->
                    <div style="background: #fef2f2; border: 1px solid #fee2e2; border-radius: 24px; padding: 24px;">
                        <h3 style="font-size: 17px; font-weight: 800; color: #991b1b; margin-bottom: 20px;"><i class="bi bi-exclamation-triangle-fill"></i> Cảnh báo kho ( < 20 )</h3>
                        <div id="lowStockDashboard" style="display: flex; flex-direction: column; gap: 12px;">
                            <p style="color: #b91c1c; font-size: 13px; text-align: center; padding: 30px;">Đang kiểm tra hàng tồn...</p>
                        </div>
                        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px dashed #fecaca; text-align: center;">
                            <button class="adv-btn" style="background:#991b1b; color:white; border-radius:12px; width:100%; border:none; padding:12px;" onclick="document.querySelector('[data-section=\'imports\']').click()">Lập phiếu nhập ngay</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- USERS SECTION -->
            <div class="section" id="users">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1 style="font-size: 24px; font-weight: 700; color: #1e293b;">Quản lý Người dùng & Quản trị viên</h1>
                    <div style="display: flex; gap: 10px;">
                        <select id="userRoleFilter" class="adv-form-control" style="width: 150px; font-size: 13px;" onchange="loadUsers()">
                            <option value="">Tất cả vai trò</option>
                            <option value="user">Khách hàng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                        <button class="btn btn-add" onclick="openUserModal()" style="padding: 10px 20px;">+ Thêm Tài khoản</button>
                    </div>
                </div>
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Tài khoản</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody"></tbody>
                </table>
            </div>

            <!-- CATEGORIES SECTION -->
            <div class="section" id="categories">
                <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 24px;">Quản lý Loại Sản Phẩm</h2>
                
                <div style="display: grid; grid-template-columns: 350px 1fr; gap: 24px;">
                    <!-- Thêm loại mới -->
                    <div class="adv-card" style="align-self: start; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        <h3 id="inlineCategoryFormTitle" style="font-size: 18px; margin-bottom: 20px;">Thêm Loại Mới</h3>
                        <form id="inlineCategoryForm">
                            <input type="hidden" id="inlineCategoryId">
                            <div class="adv-form-group" style="margin-bottom: 16px;">
                                <label>Tên loại <span style="color:red">*</span></label>
                                <input type="text" class="adv-form-control" id="inlineCategoryName" required placeholder="VD: Màn hình">
                            </div>
                            <div class="adv-form-group" style="margin-bottom: 16px;">
                                <label>Slug Type (URL/Lọc) <span style="color:red">*</span></label>
                                <input type="text" class="adv-form-control" id="inlineCategoryType" required placeholder="VD: manhinh">
                            </div>
                            <div class="adv-form-group" style="margin-bottom: 16px;">
                                <label>Mã hiển thị <span style="color:red">*</span></label>
                                <input type="text" class="adv-form-control" id="inlineCategoryCode" required placeholder="VD: MN">
                            </div>

                            <div class="adv-form-group" style="margin-bottom: 20px;">
                                <label>Trạng thái</label>
                                <select class="adv-form-control" id="inlineCategoryStatus">
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Đã ẩn</option>
                                </select>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button type="button" class="adv-btn adv-btn-gray" style="flex:1" onclick="resetInlineCategoryForm()">Hủy</button>
                                <button type="submit" class="adv-btn adv-btn-primary" style="flex:1">Lưu</button>
                            </div>
                        </form>
                    </div>

                    <!-- Danh sách loại -->
                    <div class="adv-table-card">
                        <div class="adv-table-header" style="background: white; color: #1e293b; border-bottom: 1px solid #e2e8f0; font-size: 16px; display: flex; justify-content: space-between;">
                            <span>Danh sách Loại</span>
                            <div style="display:flex; gap: 10px;">
                                <input type="text" id="categorySearchInput" class="adv-form-control" placeholder="Tìm loại..." style="padding: 4px 10px; font-size: 13px;">
                            </div>
                        </div>
                        <table class="adv-table" id="categoriesTable">
                            <thead style="background:#f1f5f9;">
                                <tr>
                                    <th>MÃ</th>
                                    <th>TÊN LOẠI</th>
                                    <th>SLUG</th>

                                    <th>TRẠNG THÁI</th>
                                    <th>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody id="categoriesTableBody"></tbody>
                        </table>
                    </div>
                </div>

            </div>

            <!-- PRODUCTS SECTION -->
            <div class="section" id="products">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Quản lý Sản phẩm</h3>
                    <button class="btn btn-add" onclick="openProductModal()">+ Thêm Sản phẩm mới</button>
                </div>
                <div class="search-bar">
                    <input type="text" id="productSearchInput" placeholder="Tìm theo tên hoặc mã SP...">
                    <select id="productCategoryFilter"><option value="">-- Tất cả loại --</option></select>
                    <button class="btn btn-primary" onclick="loadProducts()">Tìm kiếm</button>
                </div>
                <table id="productsTable">
                    <thead>
                        <tr>
                            <th>Ảnh</th> 
                            <th>Tên sản phẩm</th>
                            <th>Loại / Hãng</th>
                            <th>Giá bán</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody"></tbody>
                </table>
            </div>

            <!-- NHẬP KHO (IMPORTS) SECTION -->
            <div id="imports" class="section">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:30px;">
                    <div>
                        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">📦 Quản Lý Nhập Kho</h1>
                        <p style="color:#64748b; font-size:14px; margin:0;">Quản lý và lập phiếu nhập hàng cho đa sản phẩm.</p>
                    </div>
                    <button class="adv-btn adv-btn-success" onclick="openImportModal()" style="height:45px; padding:0 25px; border-radius:12px; font-weight:bold;">
                        <i class="bi bi-file-earmark-plus"></i> + Lập Phiếu Nhập Mới
                    </button>
                </div>

                <div class="adv-search-card" style="display:flex; gap:12px; margin-bottom:20px; align-items:center;">
                    <div class="adv-form-group" style="margin:0;">
                        <input type="date" id="importStartDate" class="adv-form-control" style="width:160px;">
                    </div>
                    <div class="adv-form-group" style="margin:0;">
                        <input type="date" id="importEndDate" class="adv-form-control" style="width:160px;">
                    </div>
                    <div class="adv-form-group" style="margin:0;">
                        <select id="importStatusFilter" class="adv-form-control" style="width:180px;">
                            <option value="">-- Tất cả trạng thái --</option>
                            <option value="Nháp">Phiếu Nháp</option>
                            <option value="Hoàn thành">Đã Hoàn Thành</option>
                        </select>
                    </div>
                    <button class="adv-btn adv-btn-primary" onclick="loadImports()" style="height:42px; border-radius:10px;">Tìm phiếu</button>
                </div>

                <div class="adv-table-card">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 11px; text-transform: uppercase;">
                                <th style="padding: 20px; text-align: left;">MÃ PN</th>
                                <th style="padding: 20px; text-align: left;">NGÀY NHẬP</th>
                                <th style="padding: 20px; text-align: right;">TỔNG GIÁ VỐN</th>
                                <th style="padding: 20px; text-align: center;">TRẠNG THÁI</th>
                                <th style="padding: 20px; text-align: right;">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody id="importsTableBody">
                            <tr><td colspan="5" style="text-align:center; padding:50px; color:#94a3b8;">Đang tải danh sách...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section" id="pricing">
                <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 24px;">Quản lý Giá bán</h2>
                
                <div class="adv-search-card">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Tra cứu và Tinh chỉnh Giá bán</div>
                    <div class="adv-search-grid">
                        <div class="adv-form-group" style="flex: 2;">
                            <input type="text" class="adv-form-control" id="pricingSearchInput" placeholder="Tìm theo tên hoặc mã SKU...">
                        </div>
                        <div class="adv-form-group">
                            <select class="adv-form-control" id="pricingCategoryFilter">
                                <option value="">Tất cả loại sản phẩm</option>
                            </select>
                        </div>
                        <div class="adv-action-row">
                            <button class="adv-btn adv-btn-primary" onclick="loadPricing()" style="width: 120px;">Tìm</button>
                        </div>
                    </div>
                </div>

                <div class="adv-table-card">
                    <table class="adv-table" id="pricingTable">
                        <thead>
                            <tr style="background:#f1f5f9;">
                                <th>TÊN SẢN PHẨM</th>
                                <th>LOẠI SP</th>
                                <th>GIÁ VỐN</th>
                                <th>% LỢI NHUẬN</th>
                                <th>GIÁ BÁN DỰ KIẾN</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody id="pricingTableBody"></tbody>
                    </table>
                </div>
            </div>

            <!-- ORDERS SECTION -->
            <div class="section" id="orders">
                <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 24px;">Quản lý Đơn hàng</h2>
                
                <div class="adv-search-card">
                    <div class="adv-search-grid">
                        <div class="adv-form-group">
                            <label>Từ ngày</label>
                            <input type="date" class="adv-form-control" id="orderStart" />
                        </div>
                        <div class="adv-form-group">
                            <label>Đến ngày</label>
                            <input type="date" class="adv-form-control" id="orderEnd" />
                        </div>
                        <div class="adv-form-group" style="flex: 2;">
                            <label>Tìm theo Quận/Phường</label>
                            <input type="text" class="adv-form-control" id="orderAddressFilter" placeholder="VD: Phường Bến Nghé...">
                        </div>
                        <div class="adv-form-group">
                            <label>Tình trạng</label>
                            <select class="adv-form-control" id="orderStatusFilter">
                                <option value="">Tất cả</option>
                                <option>Chưa xử lý</option>
                                <option>Đã xác nhận</option>
                                <option>Đang giao</option>
                                <option>Đã giao thành công</option>
                                <option>Đã hủy</option>
                            </select>
                        </div>
                        <div class="adv-form-group">
                            <label>Sắp xếp</label>
                            <select class="adv-form-control" id="orderSortFilter">
                                <option value="">Mới nhất</option>
                                <option value="ward_asc">Theo Phường/Xã</option>
                            </select>
                        </div>
                        <div class="adv-action-row">
                            <button class="adv-btn adv-btn-primary" onclick="loadOrders()" style="width: 100px;">Tìm kiếm</button>
                        </div>
                    </div>
                </div>

                <div class="adv-table-card">
                    <div class="adv-table-header" style="background: white; color: #1e293b; border-bottom: 1px solid #e2e8f0; font-size: 16px;">
                        Danh sách đơn hàng
                    </div>
                    <table class="adv-table" id="ordersTable">
                        <thead>
                            <tr style="background:#f1f5f9;">
                                <th>MÃ ĐH</th>
                                <th>KHÁCH HÀNG</th>
                                <th>ĐỊA CHỈ GIAO HÀNG</th>
                                <th>NGÀY ĐẶT</th>
                                <th>TỔNG TIỀN</th>
                                <th>TÌNH TRẠNG</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody"></tbody>
                    </table>
                </div>
            </div>

            <!-- INVENTORY REPORT SECTION (NEW PREMIUM DESIGN) -->
            <div class="section" id="inventory">
                <div style="margin-bottom:30px;">
                    <div style="margin-bottom: 20px;">
                        <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">📊 Báo Cáo Kho</h2>
                        <p style="color:#64748b; font-size:14px; margin:0;">Theo dõi biến động và tình trạng hàng hóa chi tiết theo thời gian.</p>
                    </div>

                    <!-- NHÓM BỘ LỌC HIỆN ĐẠI -->
                    <div style="display:flex; flex-wrap:wrap; gap:20px; background:white; padding:24px; border-radius:20px; border:1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); align-items: flex-end;">
                        <div class="adv-form-group" style="margin:0; flex: 1; min-width: 150px;">
                            <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Loại SP</label>
                            <select id="reportCategory" class="adv-form-control" style="height:45px; width:100%; font-size:14px; border:1px solid #f1f5f9; background:#f8fafc; border-radius:12px; padding:0 15px;">
                                <option value="">-- Tất cả loại --</option>
                            </select>
                        </div>
                        <div class="adv-form-group" style="margin:0; flex: 1; min-width: 180px;">
                            <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Ngày báo cáo (Tồn tại thời điểm)</label>
                            <input type="date" class="adv-form-control" id="reportPointDate" style="height:45px; width:100%; font-size:14px; border:1px solid #f1f5f9; background:#f8fafc; border-radius:12px; padding:0 15px;">
                        </div>
                        <div class="adv-form-group" style="margin:0; flex: 1.5; min-width: 250px;">
                            <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Khoảng thời gian (Nhập/Xuất)</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="date" class="adv-form-control" id="reportStart" style="height:45px; flex:1; font-size:14px; border:1px solid #f1f5f9; background:#f8fafc; border-radius:12px; padding:0 10px;">
                                <input type="date" class="adv-form-control" id="reportEnd" style="height:45px; flex:1; font-size:14px; border:1px solid #f1f5f9; background:#f8fafc; border-radius:12px; padding:0 10px;">
                            </div>
                        </div>
                        <div class="adv-form-group" style="margin:0; min-width: 80px;">
                            <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Ngưỡng ( < )</label>
                            <input type="number" class="adv-form-control" id="reportThreshold" value="20" style="height:45px; width:80px; font-size:14px; border:1px solid #f1f5f9; background:#f8fafc; border-radius:12px; text-align:center;">
                        </div>
                        <button class="adv-btn adv-btn-primary" onclick="loadInventoryReport()" style="padding:0 30px; border-radius:12px; height:45px; font-size: 14px; font-weight:700; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);">
                             Tìm dữ liệu
                        </button>
                    </div>
                </div>

                <!-- THÔNG BÁO KHẨN CẤP (NẾU HẾT HÀNG) -->
                <div id="urgentInventoryNotification" style="display: none; margin-bottom: 25px;"></div>

                <!-- TỔNG QUAN CHỈ SỐ (STAT CARDS) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 24px; border-radius: 20px; color: white; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);">
                        <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px;">
                            <i class="bi bi-boxes"></i>
                        </div>
                        <div>
                            <div style="font-size:13px; opacity:0.8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Tổng loại SP</div>
                            <div id="totalReportItems" style="font-size:28px; font-weight:800;">0</div>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="width: 56px; height: 56px; background: #fff1f2; color:#ef4444; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px;">
                            <i class="bi bi-exclamation-octagon-fill"></i>
                        </div>
                        <div>
                            <div style="font-size:13px; color:#64748b; font-weight:600; text-transform:uppercase;">Hết hàng</div>
                            <div id="outOfStockCount" style="font-size:28px; font-weight:800; color:#ef4444;">0</div>
                        </div>
                    </div>

                    <div style="background: white; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="width: 56px; height: 56px; background: #fffbeb; color:#f59e0b; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px;">
                            <i class="bi bi-shield-exclamation"></i>
                        </div>
                        <div>
                            <div style="font-size:13px; color:#64748b; font-weight:600; text-transform:uppercase;">Sắp hết hàng</div>
                            <div id="lowStockCount" style="font-size:28px; font-weight:800; color:#f59e0b;">0</div>
                        </div>
                    </div>
                </div>

                <!-- BẢNG BÁO CÁO CHUYÊN NGHIỆP -->
                <div class="adv-table-card" style="border-radius: 24px; border: 1px solid #e2e8f0; border-top: 4px solid #3b82f6;">
                    <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight: 800; font-size: 18px; color:#1e293b;">📋 Chi tiết Nhập - Xuất - Tồn</span>
                        <div id="reportHeaderPeriod" style="background: #f1f5f9; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #475569;">
                            Kỳ báo cáo: Từ ... đến ...
                        </div>
                    </div>
                    <table class="adv-table" id="inventoryTable">
                        <thead>
                            <tr style="background: white;">
                                <th style="padding:15px 24px; color:#94a3b8; font-size:11px; text-transform:uppercase;">Mã SP</th>
                                <th style="padding:15px 24px; color:#94a3b8; font-size:11px; text-transform:uppercase;">Tên Sản Phẩm</th>
                                <th style="text-align:center; padding:15px 24px; color:#94a3b8; font-size:11px; text-transform:uppercase;">Tồn Tại Ngày</th>
                                <th style="text-align:center; padding:15px 24px; color:#22c55e; font-size:11px; text-transform:uppercase;">Nhập (Trong Kỳ)</th>
                                <th style="text-align:center; padding:15px 24px; color:#ef4444; font-size:11px; text-transform:uppercase;">Xuất (Trong Kỳ)</th>
                                <th style="text-align:center; padding:15px 24px; color:#3b82f6; font-size:11px; text-transform:uppercase; font-weight:800;">Hiện Tại</th>
                            </tr>
                        </thead>
                        <tbody id="inventoryTableBody"></tbody>
                    </table>
                </div>
                
                <!-- DANH SÁCH CHI TIẾT CẢNH BÁO (ẨN VÀO TOOLTIP HOẶC BOX DƯỚI) -->
                <div style="margin-top:20px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                     <div id="outOfStockListContainer" style="font-size:13px; color:#ef4444; padding:15px; border-radius:12px; background:#fef2f2; display:none;"></div>
                     <div id="lowStockListContainer" style="font-size:13px; color:#f59e0b; padding:15px; border-radius:12px; background:#fffbeb; display:none;"></div>
                </div>
            </div>

            <!-- ACCOUNT SECTION -->
            <div class="section" id="account">
                <h3>Cài Đặt Tài Khoản Quản Trị</h3>
                <div style="max-width: 500px; background: #f8fafc; padding: 25px; border-radius: 12px; margin-top: 20px;">
                    <p style="margin-bottom: 20px;"><strong>Tên đăng nhập:</strong> <?php echo htmlspecialchars($adminName); ?></p>
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label>Mật khẩu mới</label>
                            <input type="password" id="newPass" required />
                        </div>
                        <div class="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <input type="password" id="confirmPass" required />
                        </div>
                        <button type="submit" class="btn btn-primary">Đổi mật khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal common layout, script calls below items -->
<div class="modal" id="commonModal" onclick="closeModal('commonModal')">
    <div class="modal-content" onclick="event.stopPropagation()" id="commonModalContent">
        <!-- Content will be injected by JS -->
    </div>
</div>

    <!-- CATEGORY MODAL -->
    <div class="modal" id="categoryModal" onclick="closeModal('categoryModal')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <h3 id="categoryModalTitle">Thêm Loại Sản Phẩm</h3>
            <form id="categoryForm">
                <input type="hidden" id="categoryId">
                <div class="form-group">
                    <label>Tên loại</label>
                    <input type="text" id="categoryName" required placeholder="VD: Màn hình">
                </div>
                <div class="form-group">
                    <label>Slug Type (Dùng để lọc)</label>
                    <input type="text" id="categoryType" required placeholder="VD: manhinh">
                </div>
                <div class="form-group">
                    <label>Mã hiển thị</label>
                    <input type="text" id="categoryCode" required placeholder="VD: MN">
                </div>
                <div class="form-group">
                    <label>Lợi nhuận mặc định (%)</label>
                    <input type="number" id="categoryProfit" value="15" min="0" max="100">
                </div>
                <div class="form-group">
                    <label>Trạng thái</label>
                    <select id="categoryStatus">
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Đã ẩn</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('categoryModal')">Hủy</button>
                    <button type="submit" class="btn btn-primary">Lưu thông tin</button>
                </div>
            </form>
        </div>
    </div>

    <!-- BRAND MODAL -->
    <div class="modal" id="brandModal" onclick="closeModal('brandModal')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <h3 id="brandModalTitle">Thêm Hãng Sản Phẩm</h3>
            <form id="brandForm">
                <input type="hidden" id="brandId">
                <div class="form-group">
                    <label>Tên hãng</label>
                    <input type="text" id="brandName" required placeholder="VD: Acer">
                </div>
                <div class="form-group">
                    <label>Mã hãng (viết liền, không dấu)</label>
                    <input type="text" id="brandCode" required placeholder="VD: acer">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('brandModal')">Hủy</button>
                    <button type="submit" class="btn btn-primary">Lưu hãng</button>
                </div>
            </form>
        </div>
    </div>

    <!-- PRODUCT MODAL -->
    <div class="modal" id="productModal" onclick="closeModal('productModal')">
        <div class="modal-content" style="max-width: 900px; padding: 0" onclick="event.stopPropagation()">
            <div style="background: white; border-bottom: 1px solid #e2e8f0; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h3 id="productModalTitle" style="margin: 0; font-size: 20px; font-weight: 700; color: #1e293b;">Thông Tin Khóa Học/Sản Phẩm</h3>
                <button type="button" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: #64748b;" onclick="closeModal('productModal')">&times;</button>
            </div>
            
            <form id="productForm" style="padding: 24px; background: #f8fafc; border-radius: 0 0 12px 12px;">
                <input type="hidden" id="productId">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                    <!-- Cột Trái -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="adv-form-group">
                            <label>Mã (SKU) <span style="color:red">*</span></label>
                            <input type="text" class="adv-form-control" id="productCode" required placeholder="Nhập mã sản phẩm...">
                        </div>
                        <div class="adv-form-group">
                            <label>Tên Sản phẩm <span style="color:red">*</span></label>
                            <input type="text" class="adv-form-control" id="productName" required placeholder="Nhập tên sản phẩm...">
                        </div>
                        <div class="adv-form-group">
                            <label>Hãng Sản Xuất <span style="color:red">*</span></label>
                            <input type="text" class="adv-form-control" id="productBrand" required placeholder="VD: Razer, Aula, MSI...">
                        </div>
                        <div class="adv-form-group">
                            <label>Nhà cung cấp/Phân phối</label>
                            <input type="text" class="adv-form-control" id="productSupplier" placeholder="Tên nhà xuất bản, cung cấp...">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div class="adv-form-group">
                                <label>Giá Vốn (VNĐ)</label>
                                <input type="number" class="adv-form-control" id="productCost" required value="0">
                            </div>
                            <div class="adv-form-group">
                                <label>Lợi Nhuận Biên (%)</label>
                                <input type="number" class="adv-form-control" id="productProfit" required value="20">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Cột Phải -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="adv-form-group">
                            <label>Danh mục chính <span style="color:red">*</span></label>
                            <select class="adv-form-control" id="productType" required></select>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div class="adv-form-group">
                                <label>Số lượng kho (Chỉ xem)</label>
                                <input type="number" class="adv-form-control" id="productStock" readonly style="background: #e9ecef; cursor: not-allowed;" title="Số lượng được tự động cập nhật qua Phiếu Nhập Hàng">
                                <small style="font-size: 10px; color: #64748b;">Cập nhật qua Phiếu Nhập</small>
                            </div>
                            <div class="adv-form-group">
                                <label>Đơn vị tính</label>
                                <input type="text" class="adv-form-control" id="productUnit" value="Cái">
                            </div>
                        </div>
                        <div class="adv-form-group">
                            <label>Mô tả ngắn (Hiển thị ở danh sách)</label>
                            <textarea class="adv-form-control" id="productShortDesc" rows="2" placeholder="VD: Bàn phím cơ layout 75%, 3 chế độ kết nối..."></textarea>
                        </div>
                        <div class="adv-form-group">
                            <label>Hình Ảnh (assets/images/img/...)</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" class="adv-form-control" id="productImage" value="assets/images/img/loa/loa.jpg">
                                <button type="button" class="adv-btn adv-btn-success" onclick="openImagePicker()" style="white-space: nowrap; padding: 4px 10px;"><i class="bi bi-images"></i> Duyệt ảnh</button>
                            </div>
                        </div>
                        <div class="adv-form-group">
                            <label>Giá Bán Ra Dự Kiến (VNĐ)</label>
                            <input type="number" class="adv-form-control" id="productPrice" style="background:#f1f5f9; font-weight: 600;" required readonly>
                        </div>
                        <div class="adv-form-group">
                            <label>Trạng Thái Hiển Thị</label>
                            <select class="adv-form-control" id="productStatus">
                                <option value="Đang bán">Hoạt động (Đang bán)</option>
                                <option value="Ngừng kinh doanh">Ẩn (Dừng bán)</option>
                            </select>
                        </div>
                    </div>
                </div>

                
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="adv-btn adv-btn-gray" onclick="closeModal('productModal')">Hủy bỏ</button>
                    <button type="submit" class="adv-btn adv-btn-primary" id="btnSaveProduct">Lưu thay đổi</button>
                </div>
            </form>
        </div>
    </div>

    <!-- USER MODAL -->
    <div class="modal" id="userModal" onclick="closeModal('userModal')">
        <div class="modal-content" style="max-width: 500px;" onclick="event.stopPropagation()">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 id="userModalTitle">Thêm Tài Khoản</h3>
                <span class="close-modal" onclick="closeModal('userModal')" style="font-size: 28px; cursor: pointer;">&times;</span>
            </div>
            <form id="userForm">
                <input type="hidden" id="userIdForEdit">
                <div class="form-group" id="userUsernameGroup">
                    <label>Tên đăng nhập (Username)</label>
                    <input type="text" id="userUsername" required>
                </div>
                <div class="form-group" id="userPasswordGroup">
                    <label>Mật khẩu (Password)</label>
                    <input type="password" id="userPassword" placeholder="Nhập để đặt mới...">
                </div>
                <div class="form-group" id="userFullnameGroup">
                    <label>Họ và tên khách hàng</label>
                    <input type="text" id="userFullname" required>
                </div>
                <div class="form-group">
                    <label>Email liên hệ</label>
                    <input type="email" id="userEmail">
                </div>
                <div class="form-group">
                    <label>Số điện thoại</label>
                    <input type="text" id="userPhone">
                </div>
                <div class="form-group">
                    <label>Vai trò hệ thống</label>
                    <select id="userRole" class="adv-form-control" style="width: 100%; border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
                        <option value="user">Khách hàng (User)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                </div>
                <div class="modal-actions" style="margin-top: 25px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('userModal')">Hủy bỏ</button>
                    <button type="submit" class="btn btn-primary">Lưu thông tin</button>
                </div>
            </form>
        </div>
    </div>

    <!-- IMPORT MODAL (PREMIUM DESIGN) -->
    <div class="modal" id="importModal" onclick="closeModal('importModal')">
        <div class="modal-content" style="max-width: 950px; border-radius: 20px;" onclick="event.stopPropagation()">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h3 id="importModalTitle" style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">🆕 Lập Phiếu Nhập Hàng</h3>
                    <p style="color:#64748b; font-size:13px;">Nhập đa sản phẩm vào kho hệ thống.</p>
                </div>
                <span class="close-modal" onclick="closeModal('importModal')" style="font-size: 28px; cursor: pointer;">&times;</span>
            </div>
            
            <form id="importForm">
                <input type="hidden" id="importId">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                    <div class="adv-form-group">
                        <label style="font-weight: 700; color: #475569;">📅 Ngày nhập kho</label>
                        <input type="date" id="importDate" class="adv-form-control" required style="background: #f8fafc;">
                    </div>
                    <div class="adv-form-group">
                        <label style="font-weight: 700; color: #475569;">🔍 Tìm sản phẩm nhanh</label>
                        <div style="position: relative;">
                            <input type="text" id="importSearchProduct" placeholder="Nhập tên hoặc mã SP để tìm..." class="adv-form-control" style="background: #f0f9ff; border: 1px solid #bae6fd;">
                            <div id="importSearchResults" style="position: absolute; top: 100%; left: 0; right: 0; background: white; z-index: 999; border: 1px solid #e2e8f0; border-radius: 8px; max-height: 200px; overflow-y: auto; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); display: none;">
                                <!-- Results injected by JS -->
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; padding: 5px; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="color: #94a3b8; font-size: 11px; text-transform: uppercase; text-align: left;">
                                <th style="padding: 15px 10px;">Sản phẩm</th>
                                <th style="padding: 15px 10px; width: 120px; text-align: center;">Số lượng</th>
                                <th style="padding: 15px 10px; width: 180px;">Giá vốn (VND)</th>
                                <th style="padding: 15px 10px; width: 180px;">Thành tiền</th>
                                <th style="padding: 15px 10px; width: 50px;"></th>
                            </tr>
                        </thead>
                        <tbody id="importItemsContainer">
                            <!-- Rows will be added here by JS -->
                        </tbody>
                    </table>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #eff6ff; border-radius: 12px; margin-bottom: 24px;">
                    <div style="color: #1e40af; font-weight: 600;">📜 Tổng số mặt hàng: <span id="importItemCountDisplay">0</span></div>
                    <div style="color: #1e40af; font-size: 20px; font-weight: 800;">Tổng giá trị: <span id="importTotalDisplay">0 đ</span></div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <div style="color: #64748b; font-size: 13px;"><i class="bi bi-info-circle"></i> Phiếu nháp sẽ không làm thay đổi số lượng kho.</div>
                    <div style="display: flex; gap: 12px;">
                        <button type="button" class="adv-btn adv-btn-gray" onclick="closeModal('importModal')">Hủy bỏ</button>
                        <button type="button" onclick="submitImport('Nháp')" class="adv-btn adv-btn-warning" style="padding: 0 30px; height: 50px; font-weight: 700; color: #1e293b;">
                            Lưu Tạm (Nháp)
                        </button>
                        <button type="button" onclick="submitImport('Hoàn thành')" class="adv-btn adv-btn-primary" style="padding: 0 40px; height: 50px; font-weight: 700;">
                            Lưu & Hoàn Thành ➔
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- PRICING MODAL -->
    <div class="modal" id="pricingModal" onclick="closeModal('pricingModal')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <h3 id="pricingModalTitle">Thiết lập Giá & Lợi nhuận</h3>
            <form id="pricingForm">
                <input type="hidden" id="pricingProductId">
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p>Sản phẩm: <strong id="pricingProductName">-</strong></p>
                    <p>Giá vốn hiện tại: <strong id="pricingProductCost">0 đ</strong></p>
                </div>
                <div class="form-group">
                    <label>Lợi nhuận mong muốn (%) [Để trống nếu dùng mặc định loại]</label>
                    <input type="number" id="pricingProductProfit" placeholder="VD: 20">
                </div>
                <div class="form-group">
                    <label>Giá bán thực tế (VNĐ)</label>
                    <input type="number" id="pricingProductPrice" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('pricingModal')">Hủy</button>
                    <button type="submit" class="btn btn-primary">Cập nhật giá</button>
                </div>
            </form>
        </div>
    </div>

    <!-- IMAGE PICKER MODAL -->
    <div class="modal" id="imagePickerModal" onclick="closeModal('imagePickerModal')">
        <div class="modal-content" style="max-width: 900px;" onclick="event.stopPropagation()">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3><i class="bi bi-images"></i> Thư viện Hình ảnh hệ thống</h3>
                <button type="button" style="background:transparent; border:none; font-size: 24px; cursor:pointer;" onclick="closeModal('imagePickerModal')">&times;</button>
            </div>
            <div id="imageGalleryGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; max-height: 400px; overflow-y: auto; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <!-- Những ảnh từ assets/images/img/ sẽ được hiện ở đây -->
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                <button class="adv-btn adv-btn-gray" onclick="closeModal('imagePickerModal')">Đóng</button>
            </div>
        </div>
    </div>

    <!-- ORDER MODAL -->
    <div class="modal" id="orderModal" onclick="closeModal('orderModal')">
        <div class="modal-content" style="max-width: 600px;" onclick="event.stopPropagation()">
            <h3>Chi tiết Đơn hàng <span id="orderDetailCode">#000</span></h3>
            <div id="orderDetailContent" style="margin: 20px 0; line-height: 1.6; font-size: 14px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <!-- Injected by JS -->
            </div>
            <div class="adv-form-group">
                <label>Cập nhật trạng thái mới</label>
                <select id="orderStatusUpdate" class="adv-form-control">
                    <option value="Chưa xử lý">Chưa xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận (Chờ giao)</option>
                    <option value="Đang giao">Đang giao hàng</option>
                    <option value="Đã giao thành công">Đã giao thành công</option>
                    <option value="Đã hủy">Hủy đơn hàng</option>
                </select>
                <div style="font-size:11px; color:#ef4444; margin-top:4px;">* Lưu ý: Trạng thái chỉ được phép tiến tới, không được lùi lại.</div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal('orderModal')">Đóng</button>
                <button type="button" id="btnUpdateOrderStatus" class="btn btn-primary">Lưu cập nhật</button>
            </div>
        </div>
    </div>

    <!-- IMPORT DETAIL MODAL -->
    <div class="modal" id="importDetailModal" onclick="closeModal('importDetailModal')">
        <div class="modal-content" style="max-width: 700px;" onclick="event.stopPropagation()">
            <h3>📦 Chi tiết Phiếu Nhập <span id="importDetailCode">#000</span></h3>
            <div id="importDetailContent" style="margin: 20px 0; font-size: 14px; background: #f0f9ff; padding: 20px; border-radius: 12px; border: 1px solid #bae6fd;">
                <!-- Injected by JS -->
            </div>
            <div class="modal-actions">
                <button type="button" class="adv-btn adv-btn-gray" onclick="closeModal('importDetailModal')">Đóng</button>
            </div>
        </div>
    </div>

<script src="assets/js/admin_main.js?v=<?php echo time(); ?>"></script>
<script>
async function logoutAdmin() {
    if (!confirm('Bạn có chắc muốn đăng xuất khỏi trang quản trị?')) return;
    try {
        await fetch('../api/admin/logout.php');
        window.location.href = 'login.php';
    } catch (e) {
        window.location.href = 'login.php';
    }
}
</script>

</body>
</html>
