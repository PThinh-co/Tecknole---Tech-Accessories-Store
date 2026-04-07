<?php

session_start();
require_once 'includes/db.php';
include 'includes/header.php';


// Lấy giỏ hàng từ Session
$cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
$totalAmount = 0;
?>

<!-- Styles are now in assets/css/cart.css -->

<div class="cart-page-wrapper">
    <div class="cart-header">
        <h2 class="cart-title">Giỏ hàng của bạn</h2>
        <?php if (!empty($cart)): ?>
            <button id="clear-cart" class="btn-clear-cart">
                <i class="bi bi-eraser"></i> Xóa tất cả
            </button>
        <?php
endif; ?>
    </div>

    <?php if (empty($cart)): ?>
        <div class="empty-cart-card">
            <img src="assets/images/sadmeme.jpg" alt="Empty Cart">
            <h3>Giỏ hàng đang trống!</h3>
            <p>Có vẻ như bạn chưa chọn được sản phẩm nào ưng ý.</p>
            <a href="products.php" class="btn-modern btn-primary-modern" style="max-width: 250px; margin: 0 auto;">
                <i class="bi bi-bag-plus"></i> Khám phá sản phẩm
            </a>
        </div>
    <?php
else: ?>
        <div class="cart-grid">
            <!-- Left Side: Items List -->
            <div class="cart-items-list" id="cart-items">
                <?php
  $subtotal = 0;
  foreach ($cart as $id => $item):
    $itemTotal = $item['price'] * $item['quantity'];
    $subtotal += $itemTotal;
?>
                    <div class="cart-item-card" data-id="<?php echo $id; ?>">
                        <a href="product-detail.php?id=<?php echo $id; ?>">
                            <img src="<?php echo $item['image']; ?>" class="cart-item-img" alt="<?php echo $item['name']; ?>">
                        </a>
                        
                        <div class="cart-item-info">
                            <h3 class="cart-item-name">
                                <a href="product-detail.php?id=<?php echo $id; ?>" style="text-decoration: none; color: inherit;">
                                    <?php echo $item['name']; ?>
                                </a>
                            </h3>
                            <div class="cart-item-price"><?php echo number_format($item['price'], 0, ',', '.'); ?>đ</div>
                            <span class="badge-stock">Còn <?php echo $item['max_stock']; ?> sản phẩm</span>
                        </div>

                        <div class="cart-item-controls">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div class="quantity-wrapper">
                                    <input type="number" class="qty-input" data-id="<?php echo $id; ?>" value="<?php echo $item['quantity']; ?>" min="1">
                                </div>
                                <div class="item-row-total"><?php echo number_format($itemTotal, 0, ',', '.'); ?>đ</div>
                                <button class="btn-delete-item btn-remove" data-id="<?php echo $id; ?>" title="Xóa sản phẩm">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                <?php
  endforeach; ?>
            </div>

            <!-- Right Side: Order Summary -->
            <div class="cart-summary-card">
                <h3 style="margin-top: 0; margin-bottom: 25px; font-weight: 800; font-size: 20px;">Tóm tắt đơn hàng</h3>
                
                <div class="summary-row">
                    <span>Tạm tính</span>
                    <span style="font-weight: 600;"><?php echo number_format($subtotal, 0, ',', '.'); ?>đ</span>
                </div>
                <div class="summary-row" style="display: none;">
                    <span>Phí vận chuyển</span>
                    <span style="color: #27ae60; font-weight: 600;" id="cart-shipping">Miễn phí</span>
                </div>
                
                <div class="summary-total">
                    <span class="total-label">Tổng cộng</span>
                    <span id="cart-total" class="total-amount">
                        <?php echo number_format($subtotal, 0, ',', '.'); ?>đ
                    </span>
                </div>

                <div style="margin-top: 30px;">
                    <button id="checkout-btn" class="btn-modern btn-primary-modern">
                        <i class="bi bi-shield-check"></i> TIẾN HÀNH THANH TOÁN
                    </button>
                    <a href="products.php" class="btn-modern btn-outline-modern">
                        <i class="bi bi-arrow-left"></i> Tiếp tục mua hàng
                    </a>
                </div>

                <div style="margin-top: 20px; text-align: center; color: var(--light-text); font-size: 13px;">
                    <i class="bi bi-lock-fill"></i> Thanh toán an toàn & bảo mật
                </div>
            </div>
        </div>
    <?php
endif; ?>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // 1. Cập nhật số lượng
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            let pid = this.getAttribute('data-id');
            let qty = parseInt(this.value);
            if (qty < 1) qty = 1;

            let formData = new FormData();
            formData.append('action', 'update');
            formData.append('product_id', pid);
            formData.append('quantity', qty);

            fetch('api/update_cart.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    alert('⚠️ ' + data.message);
                    this.value = data.force_qty;
                    let fd = new FormData();
                    fd.append('action', 'update'); fd.append('product_id', pid); fd.append('quantity', data.force_qty);
                    fetch('api/update_cart.php', { method: 'POST', body: fd }).then(() => location.reload());
                } else {
                    location.reload(); 
                }
            });
        });
    });


    // 3. Xóa tất cả
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if(confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng? Hành động này không thể hoàn tác.')) {
                let formData = new FormData();
                formData.append('action', 'clear');
                fetch('api/update_cart.php', { method: 'POST', body: formData })
                .then(() => location.reload());
            }
        });
    }

    // 4. Thanh toán
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (typeof requireLogin === 'function' && !requireLogin()) return;
            window.location.href = 'checkout.php';
        });
    }
});
</script>

<?php include 'includes/footer.php'; ?>