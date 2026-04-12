<?php
session_start();
require_once 'includes/db.php';
include 'includes/header.php';
?>
    <div class="profile-container">
        <div class="top-title">
            <h2>Lịch sử mua hàng</h2>
            <a href="index.php">Quay về trang chủ</a>  
        </div>      

        <div id="order-list" class="order-list">
            </div>  
        <div id="no-orders" class="no-orders" style="display:none;">
            Bạn chưa có đơn hàng nào.
        </div>

    </div>
    <?php include 'includes/footer.php'; ?>
    <script src="assets/js/user-cart.js?v=<?php echo time(); ?>"></script>