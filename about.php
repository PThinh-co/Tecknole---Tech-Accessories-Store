<?php
session_start();
require_once 'includes/db.php';
include 'includes/header.php'; 
?>

    <!-- MAIN CONTENT -->
    <div class="introduce-container">
      <!-- Hero Section -->
      <div class="intro-hero">
        <h1>Chào Mừng Đến Với Tecknole</h1>
        <p>Đối tác tin cậy cho mọi nhu cầu phụ kiện công nghệ của bạn</p>
      </div>

      <!-- About Section -->
      <div class="about-section" id="about">
        <h2>Về Chúng Tôi</h2>
        <div class="about-content">
          <div class="about-text">
            <p>
              <strong>Tecknole</strong> là cửa hàng chuyên cung cấp các sản phẩm
              phụ kiện công nghệ chất lượng cao, phục vụ nhu cầu của game thủ,
              dân văn phòng và những người đam mê công nghệ.
            </p>
            <p>
              Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi tự hào là địa chỉ
              tin cậy cung cấp các sản phẩm từ những thương hiệu hàng đầu thế
              giới như Razer, Logitech, Apple, JBL, Akko và nhiều hãng khác.
            </p>
            <p>
              Sứ mệnh của chúng tôi là mang đến trải nghiệm mua sắm tuyệt vời
              nhất với sản phẩm chính hãng, giá cả cạnh tranh và dịch vụ khách
              hàng tận tâm.
            </p>
          </div>
          <div class="about-features">
            <div class="feature-card">
              <h3>Sản Phẩm Chính Hãng</h3>
              <p>
                100% sản phẩm chính hãng, có tem phiếu bảo hành đầy đủ từ nhà
                sản xuất.
              </p>
            </div>
            <div class="feature-card">
              <h3>💰 Giá Cả Cạnh Tranh</h3>
              <p>
                Cam kết giá tốt nhất thị trường với nhiều chương trình khuyến
                mãi hấp dẫn.
              </p>
            </div>
            <div class="feature-card">
              <h3>Giao Hàng Nhanh</h3>
              <p>
                Giao hàng toàn quốc, nhanh chóng trong 24-48h với đối tác vận
                chuyển uy tín.
              </p>
            </div>
            <div class="feature-card">
              <h3>Tư Vấn Chuyên Nghiệp</h3>
              <p>
                Đội ngũ nhân viên am hiểu sản phẩm, tư vấn nhiệt tình và chuyên
                nghiệp.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Policies Grid -->
      <div class="policies-grid">
        <!-- Chính sách bảo mật -->
        <div class="policy-card"id="privacy">
          <div class="policy-icon">🔒</div>
          <h3>Chính Sách Bảo Mật</h3>
          <div class="policy-content">
            <ul>
              <li>Bảo mật tuyệt đối thông tin cá nhân của khách hàng</li>
              <li>
                Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý
              </li>
              <li>Mã hóa dữ liệu thanh toán theo tiêu chuẩn quốc tế</li>
              <li>Hệ thống bảo mật SSL 256-bit cho mọi giao dịch</li>
              <li>Tuân thủ nghiêm ngặt Luật Bảo vệ Dữ liệu Cá nhân</li>
            </ul>
          </div>
        </div>

        <!-- Chính sách đổi trả -->
        <div class="policy-card" id="returns">
          <div class="policy-icon">🔄</div>
          <h3>Chính Sách Đổi Trả</h3>
          <div class="policy-content">
            <ul>
              <li>
                Đổi trả miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất
              </li>
              <li>Sản phẩm còn nguyên tem, hộp, phụ kiện đầy đủ</li>
              <li>Hỗ trợ đổi sang sản phẩm khác nếu không hài lòng</li>
              <li>Hoàn tiền 100% nếu không thể đổi sản phẩm thay thế</li>
              <li>Miễn phí vận chuyển cho đơn đổi trả từ lỗi sản xuất</li>
            </ul>
          </div>
        </div>

        <!-- Chính sách bảo hành & Điều khoản -->
        <div class="policy-card" id="terms">
          <div class="policy-icon">🛡️</div>
          <h3>Chính Sách Bảo Hành</h3>
          <div class="policy-content">
            <ul>
              <li>Bảo hành chính hãng từ 12 đến 36 tháng tùy sản phẩm</li>
              <li>Hỗ trợ bảo hành 1 đổi 1 trong 30 ngày đầu tiên</li>
              <li>Trung tâm bảo hành ủy quyền tại TP.HCM và Hà Nội</li>
              <li>Thời gian xử lý bảo hành nhanh chóng 7-15 ngày</li>
              <li>Hỗ trợ vận chuyển sản phẩm bảo hành cho khách xa</li>
            </ul>
          </div>
        </div>

        <!-- Chính sách thanh toán -->
        <div class="policy-card" id="payment">
          <div class="policy-icon">💳</div>
          <h3>Chính Sách Thanh Toán</h3>
          <div class="policy-content">
            <ul>
              <li>Thanh toán khi nhận hàng (COD) toàn quốc</li>
              <li>Chuyển khoản ngân hàng với ưu đãi giảm thêm 1%</li>
              <li>Thanh toán qua ví điện tử: MoMo, ZaloPay, VNPay</li>
              <li>Thanh toán thẻ tín dụng/ghi nợ quốc tế</li>
              <li>Hỗ trợ trả góp 0% qua thẻ tín dụng từ 3-12 tháng</li>
            </ul>
          </div>
        </div>

        <!-- Chính sách vận chuyển -->
        <div class="policy-card"id="shipping">
          <div class="policy-icon">🚚</div>
          <h3>Chính Sách Vận Chuyển</h3>
          <div class="policy-content">
            <ul>
              <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
              <li>Giao hàng nhanh trong 24h tại TP.HCM</li>
              <li>Giao hàng 2-3 ngày tại các tỉnh thành khác</li>
              <li>Đóng gói cẩn thận, đảm bảo sản phẩm nguyên vẹn</li>
              <li>Cho phép kiểm tra hàng trước khi thanh toán</li>
            </ul>
          </div>
        </div>

        <!-- Quy trình mua hàng -->
        <div class="policy-card" id="process">
          <div class="policy-icon">📋</div>
          <h3>Quy Trình Mua Hàng</h3>
          <div class="policy-content">
            <ul>
              <li>Chọn sản phẩm và thêm vào giỏ hàng</li>
              <li>Điền đầy đủ thông tin giao hàng</li>
              <li>Chọn phương thức thanh toán phù hợp</li>
              <li>Xác nhận đơn hàng và chờ liên hệ từ shop</li>
              <li>Nhận hàng, kiểm tra và thanh toán</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="contact-cta">
        <h2>💬 Cần Hỗ Trợ Thêm?</h2>
        <p>
          Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn
          24/7
        </p>
        <a href="tel:0987654321" class="cta-button">📞 Liên Hệ Ngay: 0987 654 321</a>
      </div>
    </div>
    <?php include 'includes/footer.php'; ?>
  