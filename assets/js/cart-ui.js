// cart-ui.js - Xử lý thêm sản phẩm vào giỏ hàng từ trang chủ và trang sản phẩm

// Thêm sản phẩm vào giỏ hàng (cho các nút "Thêm vào giỏ")
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý tất cả các nút "Thêm vào giỏ"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Ngăn không cho click vào card
        
        const productCard = this.closest('.product-card');
        if (!productCard) return;
        
        // Lấy thông tin sản phẩm từ card
        const productName = productCard.querySelector('.product-name').textContent.trim();
        const productPriceText = productCard.querySelector('.product-price').textContent.trim();
        const productImage = productCard.querySelector('.product-image img')?.src || '';
        
        // Parse giá (loại bỏ ký tự không phải số)
        const priceMatch = productPriceText.match(/[\d,]+/);
        const productPrice = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
        
        // Tạo ID sản phẩm từ tên (đơn giản hóa)
        const productId = hashCode(productName);
        
        // Thêm vào giỏ hàng
        addProductToCart({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
          stock: 50 // Mặc định stock
        });
      });
    });
  });
  
  // Hàm tạo ID từ tên sản phẩm
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  // Hàm thêm sản phẩm vào giỏ hàng
  function addProductToCart(product) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'warning');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return;
    }
    
    // Lấy giỏ hàng hiện tại
    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Cập nhật số lượng
      existingItem.quantity += 1;
    } else {
      // Thêm sản phẩm mới
      cart.push(product);
    }
    
    // Lưu giỏ hàng
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    toast('✅ Đã thêm vào giỏ hàng!', 'success');
    updateCartCount();
  }