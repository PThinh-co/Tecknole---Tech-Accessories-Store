  // Lấy dữ liệu từ window scope sau khi syncAdminData() chạy
  let adminUsers = window.adminUsers;
  let adminCategories = window.adminCategories;
  let adminProducts = window.adminProducts;
  let adminImports = window.adminImports;
  let adminOrders = window.adminOrders;
  
  let loggedInAdmin = JSON.parse(localStorage.getItem('admin_logged_in_user'));

  // ==================== HÀM CHUNG ====================

  function saveAdminData() {
      localStorage.setItem('admin_users', JSON.stringify(adminUsers));
      localStorage.setItem('admin_categories', JSON.stringify(adminCategories));
      localStorage.setItem('admin_products', JSON.stringify(adminProducts));
      localStorage.setItem('admin_imports', JSON.stringify(adminImports));
      localStorage.setItem('admin_all_orders', JSON.stringify(adminOrders));
      
      // ĐỒNG BỘ NGƯỢC: Cập nhật giá/tồn kho/thông tin cơ bản vào PRODUCTS_DATA gốc (cho User)
      if (typeof PRODUCTS_DATA !== 'undefined') {
           adminProducts.forEach(prod => {
               const index = PRODUCTS_DATA.findIndex(p => p.id === prod.id);
               if (index !== -1) {
                   PRODUCTS_DATA[index].stock = prod.stock;
                   PRODUCTS_DATA[index].price = prod.price;
                   PRODUCTS_DATA[index].name = prod.name;
                   PRODUCTS_DATA[index].image = prod.image;
               }
           });
      }
  }

  function formatCurrency(amount) {
      return amount.toLocaleString('vi-VN') + ' đ';
  }

  function getNextId(array) {
      return array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
  }

  // ==================== LOGIC ĐĂNG NHẬP / ĐĂNG XUẤT ====================

  function checkLogin() {
      if (loggedInAdmin && loggedInAdmin.username === ADMIN_CREDENTIALS.username) {
          document.getElementById('loginPage').style.display = 'none';
          document.getElementById('adminPage').style.display = 'grid';
          document.getElementById('adminName').textContent = loggedInAdmin.name;
          loadDashboard();
      } else {
          document.getElementById('loginPage').style.display = 'flex';
          document.getElementById('adminPage').style.display = 'none';
      }
  }

  document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          loggedInAdmin = ADMIN_CREDENTIALS;
          localStorage.setItem('admin_logged_in_user', JSON.stringify(loggedInAdmin));
          checkLogin();
      } else {
          alert('Tên đăng nhập hoặc mật khẩu quản trị không đúng!\nSử dụng: quanly1 / abcd1234');
      }
  });

  function logout() {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
          localStorage.removeItem('admin_logged_in_user');
          loggedInAdmin = null;
          checkLogin();
      }
  }

  // ==================== CHUYỂN MỤC & LOAD DATA ====================

  document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function() {
          const sectionId = this.getAttribute('data-section');
          
          document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
          this.classList.add('active');
          
          document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
          document.getElementById(sectionId).classList.add('active');
          
          const titles = {
              'dashboard': 'Tổng quan', 'users': 'Quản lý người dùng', 'categories': 'Quản lý danh mục', 
              'products': 'Quản lý sản phẩm', 'imports': 'Quản lý nhập hàng', 'pricing': 'Quản lý giá bán', 
              'orders': 'Quản lý đơn hàng', 'inventory': 'Thống kê tồn kho'
          };
          document.getElementById('pageTitle').textContent = titles[sectionId];
          
          loadSectionData(sectionId);
      });
  });

  function loadSectionData(section) {
      switch(section) {
          case 'dashboard': loadDashboard(); break;
          case 'users': loadUsers(); break;
          case 'categories': loadCategories(); break;
          case 'products': loadProducts(); break;
          case 'imports': loadImports(); break;
          case 'pricing': loadPricing(); break;
          case 'orders': loadOrders(); break;
          case 'inventory': loadInventory(); break;
      }
  }

  // ==================== DASHBOARD ====================

  function loadDashboard() {
      const lowStockCount = adminProducts.filter(p => p.stock < 10 && p.status === 'Đang bán').length;
      document.getElementById('totalUsers').textContent = adminUsers.filter(u => !u.is_admin).length;
      document.getElementById('totalProducts').textContent = adminProducts.length;
      document.getElementById('newOrders').textContent = adminOrders.filter(o => o.status === 'Chưa xử lý').length;
      document.getElementById('lowStock').textContent = lowStockCount;
  }

  // ==================== QUẢN LÝ NGƯỜI DÙNG ====================

  function loadUsers() {
      const tbody = document.getElementById('usersTableBody');
      tbody.innerHTML = '';
      
      adminUsers.filter(u => !u.is_admin).forEach(user => { // Chỉ hiển thị khách hàng
          const isLocked = user.status === 'locked';
          const statusBadge = `<span class="badge badge-${isLocked ? 'locked' : 'active'}">${isLocked ? 'Bị khóa' : 'Hoạt động'}</span>`;
          const actionButton = `<button class="btn ${isLocked ? 'btn-success' : 'btn-danger'}" onclick="toggleUserStatus('${user.username}')">${isLocked ? 'Mở khóa' : 'Khóa TK'}</button>`;
          
          tbody.innerHTML += `
              <tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.username}</td>
                  <td>${user.email}</td>
                  <td>${statusBadge}</td>
                  <td>
                      <button class="btn btn-warning" onclick="resetPassword('${user.username}')">Khởi tạo MK</button>
                      ${actionButton}
                  </td>
              </tr>
          `;
      });
  }

  function resetPassword(username) {
      const user = adminUsers.find(u => u.username === username);
      if (user && confirm(`Bạn có chắc chắn muốn khởi tạo lại mật khẩu cho tài khoản ${username}? Mật khẩu mới sẽ là: 123456 (giả lập)`)) {
          
          const bsUsers = JSON.parse(localStorage.getItem('bs_users') || '[]');
          const bsUserIndex = bsUsers.findIndex(u => u.username === username);
          if(bsUserIndex !== -1) {
              bsUsers[bsUserIndex].password = '123456'; 
              localStorage.setItem('bs_users', JSON.stringify(bsUsers));
              alert(`Đã khởi tạo mật khẩu mới cho ${username}. Mật khẩu giả lập là: 123456`);
          } else {
               alert('Không tìm thấy tài khoản khách hàng này trong hệ thống gốc (bs_users).');
          }
      }
  }

  function toggleUserStatus(username) {
      const user = adminUsers.find(u => u.username === username);
      if (user) {
          const isLocked = user.status === 'locked';
          user.status = isLocked ? 'active' : 'locked';
          saveAdminData();
          loadUsers();
          alert(`Đã ${isLocked ? 'mở khóa' : 'khóa'} tài khoản ${username}.`);
      }
  }

  // ==================== QUẢN LÝ DANH MỤC ====================

  function loadCategories() {
      const tbody = document.getElementById('categoriesTableBody');
      tbody.innerHTML = '';
      
      adminCategories.forEach(cat => {
          const statusBadge = `<span class="badge badge-active">Hiển thị</span>`;
          tbody.innerHTML += `
              <tr>
                  <td>${cat.code}</td>
                  <td>${cat.name}</td>
                  <td>${cat.profit} %</td>
                  <td>${statusBadge}</td>
                  <td>
                      <button class="btn btn-primary" onclick="editCategory(${cat.id})">Sửa</button>
                  </td>
              </tr>
          `;
      });
      updateProductCategorySelects();
  }

  function openCategoryModal(catId = null) {
      const modal = document.getElementById('categoryModal');
      const form = document.getElementById('categoryForm');
      form.reset();
      modal.classList.add('active');

      // Logic điền form (Tự hoàn thiện)
  }

  function closeCategoryModal() {
      document.getElementById('categoryModal').classList.remove('active');
  }

  function editCategory(id) {
      openCategoryModal(id);
  }

  document.getElementById('categoryForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thêm/Sửa danh mục thành công!');
      saveAdminData();
      loadCategories();
      closeCategoryModal();
  });

  // ==================== QUẢN LÝ SẢN PHẨM ====================

  function updateProductCategorySelects() {
      const selectEl = document.getElementById('productCategory');
      selectEl.innerHTML = '<option value="">-- Chọn loại --</option>';
      adminCategories.forEach(cat => {
          selectEl.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
      });
  }

  function loadProducts() {
      const tbody = document.getElementById('productsTableBody');
      tbody.innerHTML = '';
      
      adminProducts.forEach(prod => {
          const isSelling = prod.status === 'Đang bán';
          const statusBadge = `<span class="badge badge-${isSelling ? 'active' : 'locked'}">${prod.status}</span>`;
          tbody.innerHTML += `
              <tr>
                  <td>${prod.code}</td>
                  <td>${prod.name}</td>
                  <td>${prod.categoryName || prod.type}</td>
                  <td>${formatCurrency(prod.price)}</td>
                  <td>${prod.stock}</td>
                  <td>${statusBadge}</td>
                  <td>
                      <button class="btn btn-primary" onclick="editProduct(${prod.id})">Sửa</button>
                  </td>
              </tr>
          `;
      });
  }

  function openProductModal(prodId = null) {
      const modal = document.getElementById('productModal');
      const form = document.getElementById('productForm');
      form.reset();
      updateProductCategorySelects();
      modal.classList.add('active');

      // Logic điền form sửa sản phẩm (Tự hoàn thiện)
  }

  function closeProductModal() {
      document.getElementById('productModal').classList.remove('active');
  }

  function editProduct(id) {
      openProductModal(id);
  }
  
  document.getElementById('productForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thêm/Sửa sản phẩm thành công!');
      saveAdminData(); 
      loadProducts();
      closeProductModal();
  });
  
  function clearProductImage() {
      document.getElementById('productImage').value = '';
      alert('Đã bỏ hình ảnh! Vui lòng lưu để cập nhật.');
  }


  // ==================== QUẢN LÝ NHẬP HÀNG ====================

  function loadImports() {
      const tbody = document.getElementById('importsTableBody');
      tbody.innerHTML = '';
      
      adminImports.forEach(imp => {
          const statusBadge = `<span class="badge badge-${imp.status === 'Hoàn thành' ? 'completed' : 'pending'}">${imp.status}</span>`;
          const isCompleted = imp.status === 'Hoàn thành';
          tbody.innerHTML += `
              <tr>
                  <td>${imp.code}</td>
                  <td>${imp.date}</td>
                  <td>${formatCurrency(imp.total)}</td>
                  <td>${statusBadge}</td>
                  <td>
                      <button class="btn btn-primary" onclick="viewImportDetail(${imp.id})">Xem</button>
                      ${!isCompleted ? `<button class="btn btn-warning">Sửa</button>` : ''}
                      ${!isCompleted ? `<button class="btn btn-success" onclick="completeImport(${imp.id})">Hoàn thành</button>` : ''}
                  </td>
              </tr>
          `;
      });
  }
  
  function updateProductCostAndStock(product, quantity, price) {
      product.stock += quantity;
      product.totalImport += quantity;
      product.cost = price;
      product.price = Math.round(product.cost * (1 + product.profit / 100));
  }

  function completeImport(importId) {
      const imp = adminImports.find(i => i.id === importId);
      if (imp && imp.status !== 'Hoàn thành' && confirm(`Bạn có muốn hoàn thành phiếu nhập ${imp.code} và cập nhật tồn kho không?`)) {
          
          imp.items.forEach(item => {
              const product = adminProducts.find(p => p.id === item.productId);
              if (product) {
                  updateProductCostAndStock(product, item.quantity, item.price);
              }
          });
          
          imp.status = 'Hoàn thành';
          saveAdminData();
          loadImports();
          loadInventory();
          alert(`Phiếu nhập ${imp.code} đã được hoàn thành. Tồn kho và Giá bán đã cập nhật!`);
      }
  }

  // ... (Các hàm xử lý Modal Import - Tự hoàn thiện) ...
  function closeImportModal() {
       document.getElementById('importModal').classList.remove('active');
  }
  function viewImportDetail(importId) {
       alert('Xem chi tiết phiếu nhập (Tự hoàn thiện logic)');
  }
  function addImportItem() {
       alert('Thêm sản phẩm nhập (Tự hoàn thiện logic)');
  }
  
  // Cần phải có submit form importForm
  document.getElementById('importForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Lưu phiếu nhập (Tự hoàn thiện logic)');
      closeImportModal();
      loadImports();
  });


  // ==================== QUẢN LÝ GIÁ BÁN ====================
  
  function loadPricing() {
      const tbody = document.getElementById('pricingTableBody');
      tbody.innerHTML = '';
      
      adminProducts.forEach(prod => {
          const calculatedPrice = Math.round(prod.cost * (1 + prod.profit / 100));
          
          tbody.innerHTML += `
              <tr>
                  <td>${prod.code}</td>
                  <td>${prod.name}</td>
                  <td>${formatCurrency(prod.cost)}</td>
                  <td><input type="number" id="profit-${prod.id}" value="${prod.profit}" min="0" max="100" style="width:70px" onchange="alert('Tính lại giá')"> %</td>
                  <td><strong id="price-${prod.id}">${formatCurrency(calculatedPrice)}</strong></td>
                  <td>
                      <button class="btn btn-success" onclick="alert('Lưu giá bán')">Lưu</button>
                  </td>
              </tr>
          `;
      });
  }
  
  // ==================== QUẢN LÝ ĐƠN HÀNG ====================

  function loadOrders() {
      let filteredOrders = adminOrders;
      
      const tbody = document.getElementById('ordersTableBody');
      tbody.innerHTML = '';

      filteredOrders.forEach(order => { 
          const statusMap = {'Chưa xử lý': 'badge-new', 'Đã xác nhận': 'badge-processing', 'Đã giao thành công': 'badge-completed', 'Đã hủy': 'badge-locked'};
          const statusBadge = `<span class="badge ${statusMap[order.status]}">${order.status}</span>`;
          
          tbody.innerHTML += `
              <tr>
                  <td>${order.code}</td>
                  <td>${order.customerName}</td>
                  <td>${order.date}</td>
                  <td>${formatCurrency(order.total)}</td>
                  <td>${statusBadge}</td>
                  <td>${order.address.ward}</td>
                  <td>
                      <button class="btn btn-primary" onclick="viewOrderDetail(${order.id})">Xem chi tiết</button>
                  </td>
              </tr>
          `;
      });
  }
  
  function viewOrderDetail(orderId) {
       const order = adminOrders.find(o => o.id === orderId);
       if (!order) return;
       alert(`Chi tiết đơn hàng ${order.code} (Tự hoàn thiện logic)`);
       // Mở Modal (Tự hoàn thiện)
  }
  function closeOrderModal() {
      document.getElementById('orderModal').classList.remove('active');
  }
  
  function updateOrderStatus() {
      const orderId = parseInt(document.getElementById('currentOrderId').value);
      const newStatus = document.getElementById('orderStatusUpdate').value;
      const order = adminOrders.find(o => o.id === orderId);
      
      if (order && confirm(`Cập nhật trạng thái đơn hàng ${order.code} sang "${newStatus}"?`)) {
          
          // Logic GIẢM TỒN KHO khi xác nhận/giao thành công TỪ TRẠNG THÁI MỚI ĐẶT
          if (order.status === 'Chưa xử lý' && (newStatus === 'Đã xác nhận' || newStatus === 'Đã giao thành công')) {
              order.items.forEach(item => {
                  const product = adminProducts.find(p => p.id === item.productId); 
                  if (product) {
                      product.stock -= item.quantity;
                      product.totalSold += item.quantity;
                  }
              });
              saveAdminData();
          }
          
          order.status = newStatus;
          saveAdminData();
          alert(`Đã cập nhật trạng thái đơn hàng ${order.code} thành "${newStatus}"!`);
          closeOrderModal();
          loadOrders();
          loadDashboard(); 
      }
  }


  // ==================== QUẢN LÝ TỒN KHO & BÁO CÁO ====================

  function loadInventory() {
      const tbody = document.getElementById('inventoryTableBody');
      tbody.innerHTML = '';
      
      let lowStockCount = 0;
      
      adminProducts.forEach(prod => {
          const isLowStock = prod.stock < 10 && prod.status === 'Đang bán';
          if (isLowStock) lowStockCount++;
          
          const warningBadge = isLowStock ? '<span class="badge badge-low">Sắp hết hàng</span>' : 'Ổn định';
          
          tbody.innerHTML += `
              <tr>
                  <td>${prod.code}</td>
                  <td>${prod.name}</td>
                  <td>${prod.categoryName || prod.type}</td>
                  <td>${prod.totalImport}</td>
                  <td>${prod.totalSold}</td>
                  <td><strong>${prod.stock}</strong></td>
                  <td>${warningBadge}</td>
              </tr>
          `;
      });
      
      document.getElementById('lowStockCount').textContent = lowStockCount;
      document.getElementById('lowStockAlert').style.display = lowStockCount > 0 ? 'block' : 'none';
      loadDashboard();
  }
  
  // ==================== KHỞI TẠO ====================
  window.addEventListener('DOMContentLoaded', function() {
// 1. Kiểm tra đăng nhập ban đầu
checkLogin();

// 2. Gắn sự kiện cho form Đăng nhập sau khi DOM load
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          loggedInAdmin = ADMIN_CREDENTIALS;
          localStorage.setItem('admin_logged_in_user', JSON.stringify(loggedInAdmin));
          checkLogin();
      } else {
          alert('Tên đăng nhập hoặc mật khẩu quản trị không đúng!\nSử dụng: quanly1 / abcd1234');
      }
  });
}
});