<?php
session_start();
require_once 'includes/db.php';
include 'includes/header.php';
?>
  <style>
    body {
      background: #f5f5f5;
    }

    .checkout-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
    }

    .checkout-form {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .order-summary {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      height: fit-content;
      position: sticky;
      top: 100px;
      overflow: hidden; 
    }

    h2 {
      color: var(--text-color-one);
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 700;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--color-three);
    }

    .form-section {
      margin-bottom: 30px;
    }

    .form-section h3 {
      color: var(--text-color-one);
      font-size: 18px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #444;
      font-size: 14px;
    }

    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 15px;
      transition: 0.3s;
      outline: none;
    }

    .form-group input:focus {
      border-color: var(--color-one);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Summary Item Styling */
    .summary-item {
      display: flex;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
      align-items: center;
    }

    .summary-item .item-img {
      width: 70px;
      height: 70px;
      flex-shrink: 0;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 5px;
    }

    .summary-item .item-img img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .item-details {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .item-info .name {
      font-weight: 600;
      font-size: 14px;
      color: #2d3436;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-info .qty {
      font-size: 13px;
      color: #636e72;
    }

    .item-price {
      font-weight: 700;
      color: var(--color-one); /* MÀU XANH CHO GIÁ TIỀN */
      font-size: 14px;
    }

    .summary-stats {
      margin-top: 20px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      color: #636e72;
    }

    .stat-row.total {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 3px double #e0e0e0;
      font-size: 24px;
      font-weight: 850;
      color: #1a1a1a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-row.total .value {
      color: #ff4757;
      text-shadow: 1px 1px 2px rgba(255, 71, 87, 0.1);
    }
    
    input:disabled, select:disabled, textarea:disabled {
      background-color: #f9f9f9 !important;
      cursor: not-allowed;
      border-color: #eee !important;
      color: #888 !important;
    }

    .payment-methods {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: 0.3s;
    }

    .payment-option:hover {
      border-color: var(--color-one);
      background: rgba(102, 126, 234, 0.05);
    }

    .payment-option input[type="radio"] {
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .checkout-btn {
      width: 100%;
      padding: 16px;
      background: var(--color-one);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 20px;
      transition: 0.3s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .checkout-btn:hover {
      background: #5a6fd6;
      transform: translateY(-2px);
    }

    .btn-back {
      display: inline-block;
      margin-bottom: 20px;
      color: #636e72;
      text-decoration: none;
      font-size: 14px;
    }

    .btn-back:hover {
      color: var(--color-one);
    }

    @media (max-width: 992px) {
      .checkout-container {
        grid-template-columns: 1fr;
      }
      .order-summary {
        position: static;
      }
    }
  </style>

  <div class="checkout-container">
    <div class="checkout-form">
      <a href="cart.php" class="btn-back">Quay lại giỏ hàng</a>
      <h2>🛒 Thanh toán đơn hàng</h2>

      <form id="checkout-form">
        <div class="form-section">
          <h3 style="margin: 0; margin-bottom: 15px;">📋 Thông tin người nhận</h3>
          <div class="form-group">
            <label>Họ và tên *</label>
            <input type="text" id="receiver-name" required placeholder="Họ tên người nhận hàng">
          </div>
          <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <label>Số điện thoại *</label>
              <input type="tel" id="receiver-phone" required pattern="[0-9]{10,11}" placeholder="09xxxxxxx">
            </div>
            <div>
              <label>Email</label>
              <input type="email" id="receiver-email" placeholder="email@example.com">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>📍 Địa chỉ giao hàng</h3>
          <div style="display: flex; gap: 20px; margin-bottom: 15px; background: #fdfdfd; padding: 10px; border-radius: 10px; border: 1px solid #f0f0f0;">
            <label style="cursor:pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; color: #444; font-size: 14px;">
              <input type="radio" name="address_source" value="profile" checked> Dùng địa chỉ đã lưu
            </label>
            <label style="cursor:pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; color: #444; font-size: 14px;">
              <input type="radio" name="address_source" value="manual"> Nhập địa chỉ mới
            </label>
          </div>
          <p id="address-desc" style="font-size: 13px; color: #666; margin-bottom: 15px;">Dưới đây là địa chỉ từ hồ sơ của bạn.</p>
          
          <div id="order-address-fields" style="border: 1px solid #eee; padding: 20px; border-radius: 12px; background: #fff;">
            <div class="form-group">
              <label>Tỉnh/Thành phố *</label>
              <select id="province" required>
                <option value="">Đang tải danh sách...</option>
              </select>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div>
                <label>Phường/Xã/Thị Trấn *</label>
                <select id="ward" required disabled>
                  <option value="">Vui lòng chọn Tỉnh/Thành trước</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Số nhà, tên đường *</label>
              <textarea id="street" placeholder="Vd: 123 Đường ABC..." required style="height: 80px;"></textarea>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>📝 Ghi chú đơn hàng</h3>
          <div class="form-group">
            <textarea id="order-note" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3>💳 Phương thức thanh toán</h3>
          <div class="payment-methods" style="margin-top: 0; border: none; padding-top: 0;">
            <label class="payment-option">
              <input type="radio" name="paymentOption" value="cod" checked>
              <div class="option-content">
                <span style="font-weight: 600;">💵 Thanh toán khi nhận hàng (COD)</span>
                <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng tới.</p>
              </div>
            </label>

            <label class="payment-option">
              <input type="radio" name="paymentOption" value="transfer">
              <div class="option-content">
                <span style="font-weight: 600;">🏦 Chuyển khoản ngân hàng</span>
                <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">Chuyển tiền vào tài khoản shop để được xử lý nhanh hơn.</p>
              </div>
            </label>

            <div id="transfer-info" style="display: none; background: #f0f7ff; border: 1px solid #cce5ff; padding: 20px; border-radius: 12px; margin-bottom: 20px; font-size: 14px;">
              <h4 style="margin-top: 0; color: #004085;"><i class="bi bi-bank"></i> Thông tin chuyển khoản:</h4>
              <p style="margin-bottom: 8px;"><strong>Ngân hàng:</strong> MB Bank (Ngân hàng Quân đội)</p>
              <p style="margin-bottom: 8px;"><strong>Số tài khoản:</strong> 0987654321</p>
              <p style="margin-bottom: 8px;"><strong>Chủ tài khoản:</strong> TECKNOLE STORE</p>
              <p style="margin-bottom: 0;"><strong>Nội dung:</strong> Đã gửi - [Số điện thoại của bạn]</p>
              <p style="margin-top: 10px; color: #ff3f34; font-weight: 600; font-style: italic;">* Vui lòng chuyển đúng số tiền sau khi bấm "Đặt hàng ngay".</p>
            </div>
            <label class="payment-option" style="border-style: solid; background: #fff;">
              <input type="radio" name="paymentOption" value="online">
              <div class="option-content">
                <span style="font-weight: 600;">💻 Thanh toán trực tuyến (Chuyển khoản / Ví điện tử)</span>
                <p style="font-size: 12px; color: #667eea; margin: 4px 0 0 0;"><i class="bi bi-info-circle"></i> Thanh toán an toàn qua cổng tích hợp (Minh họa).</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>

      <!-- Summary -->
      <div class="order-summary">
        <h3><i class="bi bi-cart-check"></i> Đơn hàng của bạn</h3>
        
        <div class="summary-item-list" id="order-items">
          <!-- JS dynamic render -->
        </div>

        <div class="summary-stats">
          <div class="stat-row" style="display: none;">
            <span class="label">Phí vận chuyển:</span>
            <span class="value" id="shipping" style="color: #2ecc71; font-weight: 600;">Miễn phí</span>
          </div>
          <div class="stat-row total">
            <span class="label">Tổng cộng:</span>
            <span class="value" id="total-amount">0đ</span>
          </div>
        </div>

        <button type="submit" class="checkout-btn" id="place-order-btn">
          ĐẶT HÀNG NGAY
        </button>

        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 15px;">
          <i class="bi bi-shield-check"></i> Thanh toán an toàn & Bảo mật
        </p>
      </div>
  </div>

  <script src="assets/js/checkout-logic.js?v=<?php echo time(); ?>"></script>
  <?php include 'includes/footer.php'; ?>
