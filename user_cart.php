<?php
session_start();
require_once 'includes/db.php';
include 'includes/header.php';
?>
    <div class="profile-container">
        <div class="top-title">
            <h2>Thông tin Tài khoản & Đơn hàng</h2>
            <a href="index.php">Quay về trang chủ</a>  
        </div>      
        <h3>Thông tin cá nhân</h3>
        <div id="user-profile-info" class="profile-info-modal">
            </div>

        <h3>Đơn hàng đã đặt</h3>
        <div id="order-list" class="order-list">
            </div>  
        <div id="no-orders" class="no-orders" style="display:none;">
            Bạn chưa có đơn hàng nào.
        </div>

    </div>
    <?php include 'includes/footer.php'; ?>
    <script src="assets/js/user-cart.js?v=<?php echo time(); ?>"></script>