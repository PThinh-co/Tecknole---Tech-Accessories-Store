// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Kiểm tra đăng nhập
    if (!isLoggedIn()) {
      // Lưu URL hiện tại để quay lại sau khi đăng nhập
      sessionStorage.setItem('returnUrl', window.location.href);
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      window.location.href = 'login.html';
      return false;
    }
  
    const user = getCurrentUser();
    const cartKey = `cart_${user.username}`;
    
    // Lấy giỏ hàng của user
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
      // Tăng số lượng nếu đã có
      if (existingItem.quantity < 999) {
        existingItem.quantity += 1;
        alert(`Đã tăng số lượng "${product.name}" trong giỏ hàng!`);
      } else {
        alert('Số lượng tối đa là 999!');
        return false;
      }
    } else {
      // Thêm sản phẩm mới
      cart.push({
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
    
    // Lưu giỏ hàng
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Cập nhật số lượng trên header
    updateCartCount();
    
    return true;
  }
  
  // Lấy giỏ hàng của user hiện tại
  function getCart() {
    if (!isLoggedIn()) {
      return [];
    }
    
    const user = getCurrentUser();
    const cartKey = `cart_${user.username}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  }
  
  // Lưu giỏ hàng
  function saveCart(cart) {
    if (!isLoggedIn()) {
      return false;
    }
    
    const user = getCurrentUser();
    const cartKey = `cart_${user.username}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    return true;
  }
  
  // Xóa giỏ hàng
  function clearCart() {
    if (!isLoggedIn()) {
      return false;
    }
    
    const user = getCurrentUser();
    const cartKey = `cart_${user.username}`;
    localStorage.removeItem(cartKey);
    updateCartCount();
    return true;
  }
  
  // Xử lý click nút "Thêm vào giỏ" trên trang sản phẩm
  document.addEventListener('DOMContentLoaded', function() {
    // Xử lý các nút "Thêm vào giỏ"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Ngăn chặn click vào card
        
        // Lấy thông tin sản phẩm từ card cha
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent.trim();
        const productPriceText = productCard.querySelector('.product-price').childNodes[0].textContent.trim();
        const productPrice = parseInt(productPriceText.replace(/[^\d]/g, ''));
        const productImg = productCard.querySelector('.product-image img').src;
        
        const product = {
          name: productName,
          price: productPrice,
          img: productImg
        };
        
        addToCart(product);
      });
    });
  });