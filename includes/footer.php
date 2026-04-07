<footer>
        <div class="footer-content">
          <div class="footer-section">
              <h3>Về TechStore</h3>
              <ul>
                  <li><a href="about.php">Giới thiệu</a></li>
                  <li><a href="about.php#careers">Tuyển dụng</a></li>
                  <li><a href="about.php#privacy">Chính sách bảo mật</a></li>
                  <li><a href="about.php#terms">Điều khoản sử dụng</a></li>
              </ul>
          </div>
      
          <div class="footer-section">
              <h3>Hỗ trợ khách hàng</h3>
              <ul>
                  <li><a href="about.php#process">Hướng dẫn mua hàng</a></li>
                  <li><a href="about.php#returns">Chính sách đổi trả</a></li>
                  <li><a href="about.php#returns">Bảo hành</a></li>
                 
              </ul>
          </div>
      
          <div class="footer-section">
              <h3>Chính sách</h3>
              <ul>
                  <li><a href="about.php#shipping">Chính sách vận chuyển</a></li>
                  <li><a href="about.php#returns">Chính sách bảo hành</a></li>
                  <li><a href="about.php#returns">Chính sách đổi trả</a></li>
              </ul>
          </div>
      
          <div class="footer-section contact-info">
              <h3>Liên hệ</h3>
              <p><i class="bi bi-geo-alt-fill"></i> 854 Tạ Quang Bửu, Q8, TP.HCM</p>
              <p><i class="bi bi-telephone-fill"></i> Hotline: 1900 202020</p>
              <p><i class="bi bi-envelope-fill"></i> Email: support@techstore.vn</p>
              <p><i class="bi bi-clock-fill"></i> Giờ làm việc: 8:00 - 22:00</p>

          </div>
      </div>
      </footer>
    <!-- Modal Đăng Nhập -->
    <div id="loginModal" class="auth-modal">
      <div class="auth-modal-overlay" onclick="closeLoginModal()"></div>
      <div class="auth-modal-content" style="max-width: 450px;">
        <button class="auth-modal-close" onclick="closeLoginModal()">
          &times;
        </button>

        <div class="auth-modal-header">
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn trở lại!</p>
        </div>

        <form id="login-form"  action="login.php" method="POST" class="auth-modal-form">
          <div class="form-group full-width">
            <label for="login-username">Tài khoản</label>
            <input
              type="text"
              id="login-username"
              name="username"
              placeholder="Nhập tài khoản" required
            />
            <span id="error-login-username" class="error-msg"></span>
          </div>

          <div class="form-group full-width">
            <label for="login-password">Mật khẩu</label>
            <div style="position: relative;">
              <input
                type="password"
                id="login-password"
                name="password"
                placeholder="Nhập mật khẩu" required
              />
              <span
                class="password-toggle"
                id="toggle-login-password"
                onclick="togglePassword('login-password', 'toggle-login-password')"
                style="top: 50%; transform: translateY(-50%);"
                >👁️‍🗨️</span
              >
            </div>
            <span id="error-login-password" class="error-msg"></span>
          </div>

          <button type="submit" class="btn-auth-submit">Đăng Nhập</button>
        </form>

        <div class="auth-modal-footer">
          Chưa có tài khoản?
          <a href="#" onclick="switchToRegister()">Đăng ký ngay</a>
        </div>
      </div>
    </div>

    <!-- Modal Đăng Ký -->
    <div id="registerModal" class="auth-modal">
      <div class="auth-modal-overlay" onclick="closeRegisterModal()"></div>
      <div class="auth-modal-content">
        <button class="auth-modal-close" onclick="closeRegisterModal()">
          &times;
        </button>

        <div class="auth-modal-header">
          <h2>Đăng Ký</h2>
          <p>Tạo tài khoản mới của bạn</p>
        </div>

        <form
          id="register-form"
          action="register.php"
          method="POST"
          class="auth-modal-form"
        >
          <div class="form-group">
            <label for="reg-fullname">Họ và tên</label>
            <input
              type="text"
              id="reg-fullname"
              name="fullname"
              placeholder="Nhập họ và tên" required
            />
            <span id="error-fullname" class="error-msg"></span>
          </div>

          <div class="form-group">
            <label for="reg-username">Tên tài khoản</label>
            <input
              type="text"
              id="reg-username"
              name="username"
              placeholder="Nhập tên tài khoản" required
            />
            <span id="error-username" class="error-msg"></span>
          </div>

          <div class="form-group">
            <label for="reg-password">Mật khẩu</label>
            <div style="position: relative;">
              <input
                type="password"
                id="reg-password"
                name="password"
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)" required
              />
              <span
                class="password-toggle"
                id="toggle-reg-password"
                onclick="togglePassword('reg-password', 'toggle-reg-password')"
                style="top: 50%; transform: translateY(-50%);"
                >👁️‍🗨️</span
              >
            </div>
            <span id="error-password" class="error-msg"></span>
          </div>

          <div class="form-group">
            <label for="reg-confirm-password">Nhập lại mật khẩu</label>
            <div style="position: relative;">
              <input
                type="password"
                id="reg-confirm-password"
                placeholder="Nhập lại mật khẩu"
              />
              <span
                class="password-toggle"
                id="toggle-reg-confirm"
                onclick="togglePassword('reg-confirm-password', 'toggle-reg-confirm')"
                style="top: 50%; transform: translateY(-50%);"
                >👁️‍🗨️</span
              >
            </div>
            <span id="error-confirm-password" class="error-msg"></span>
          </div>

          <div class="form-group">
            <label for="reg-email">Email</label>
            <input 
              type="email" 
              id="reg-email"
              name="email" required 
              placeholder="example@gmail.com" />
            <span id="error-email" class="error-msg"></span>
          </div>

          <div class="form-group">
            <label for="reg-phone">Số điện thoại</label>
            <input
              type="tel"
              id="reg-phone"
              name="phone" required
              placeholder="Nhập số điện thoại"
            />
            <span id="error-phone" class="error-msg"></span>
          </div>

          <div class="form-group">
            <label>Tỉnh/Thành phố *</label>
            <select id="reg-province" name="province" required></select>
          </div>
          <div class="form-group">
            <label>Phường/Xã *</label>
            <select id="reg-ward" name="ward" required disabled>
              <option value="">Chọn Tỉnh/Thành trước</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label for="reg-street">Số nhà, tên đường *</label>
            <input type="text" 
              id="reg-street"
              name="street" required 
              placeholder="Tên đường, phường/xã, quận/huyện..." />
            <span id="error-address" class="error-msg"></span>
          </div>

          <button type="submit" class="btn-auth-submit">Đăng Ký Ngay</button>
        </form>

        <div class="auth-modal-footer">
          Đã có tài khoản? <a href="#" onclick="switchToLogin()">Đăng nhập</a>
        </div>
      </div>
    </div>

    <!--    đăng nhập) -->
    <div id="profileModal" class="auth-modal">
      <div class="auth-modal-overlay" onclick="closeProfileModal()"></div>
      <div class="auth-modal-content">
        <button class="auth-modal-close" onclick="closeProfileModal()">
          &times;
        </button>

        <div class="auth-modal-header">
          <div class="profile-avatar-small"><i class="bi bi-person-circle"></i></div>
          <h2 id="profile-fullname">Xin chào!</h2>
          <p>Thông tin tài khoản của bạn</p>
        </div>  

        <div class="profile-info-modal">
          <div class="info-row">
            <span class="info-label"><i class="bi bi-person-circle"></i> Họ và tên:</span>
            <span class="info-value" id="profile-name-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-lock-fill"></i> Tài khoản:</span>
            <span class="info-value" id="profile-username-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-envelope-at-fill"></i> Email:</span>
            <span class="info-value" id="profile-email-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-telephone-fill"></i> Số điện thoại:</span>
            <span class="info-value" id="profile-phone-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="bi bi-geo-alt-fill"></i> Địa chỉ:</span>
            <span class="info-value" id="profile-address-value"></span>
          </div>
        </div>

        <button class="btn-logout-modal" onclick="handleLogoutModal()">
          Đăng xuất
        </button>
      </div>
    </div>
    <script src="assets/js/search-pagination.js?v=<?php echo time(); ?>"></script>
    <!-- 
    <script src="assets/js/product-detail.js"></script> 
    <script src="assets/js/products-data-storage.js"></script>
    <script src="assets/js/index-scripts.js"></script> 
    -->
  </body>
</html>