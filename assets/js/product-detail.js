// product-detail.js - Xử lý hiển thị chi tiết sản phẩm và thêm vào giỏ hàng

// Dữ liệu sản phẩm mẫu
const productsData = {
    1: {
      id: 1,
      name: "Bàn phím Aula F75",
      price: 750000,
      oldPrice: 899000,
      image: "assets/images/popular_items/aulaf75_vang.png",
      stock: 15,
      category: "Bàn phím",
      brand: "Aula",
      description: "Bàn phím cơ Aula F75 với switch hot-swap, LED RGB đầy màu sắc. Thiết kế 75% compact tiết kiệm không gian làm việc. Keycap PBT Double-shot bền bỉ, chống bám bẩn tốt.",
      specifications: {
        "Loại switch": "Hot-swappable mechanical",
        "Kết nối": "USB-C, Bluetooth 5.0",
        "LED": "RGB Per-key",
        "Keycap": "PBT Double-shot",
        "Layout": "75% (84 phím)",
        "Pin": "4000mAh",
        "Trọng lượng": "850g"
      }
    },
    2: {
      id: 2,
      name: "Màn hình MSI MAG 274QF X24 27\"",
      price: 5590000,
      oldPrice: null,
      image: "assets/images/popular_items/msi_mag_274qf_x24_gearvn_d23c9ec1aab847818a2b31d35a3d25e8_1024x1024.jpg",
      stock: 8,
      category: "Màn hình",
      brand: "MSI",
      description: "Màn hình gaming MSI MAG 274QF X24 27 inch với tấm nền Rapid IPS, tần số quét 180Hz mang đến trải nghiệm chơi game mượt mà. Độ phân giải 2K QHD sắc nét, hỗ trợ G-Sync và FreeSync Premium chống xé hình.",
      specifications: {
        "Kích thước": "27 inch",
        "Độ phân giải": "2560 x 1440 (QHD)",
        "Tấm nền": "Rapid IPS",
        "Tần số quét": "180Hz",
        "Thời gian phản hồi": "1ms (GtG)",
        "Độ sáng": "400 nits",
        "Tỷ lệ tương phản": "1000:1",
        "Công nghệ": "G-Sync Compatible, FreeSync Premium"
      }
    },
    3: {
      id: 3,
      name: "Loa Marshall Stanmore 3",
      price: 9550000,
      oldPrice: 10000000,
      image: "assets/images/popular_items/loa_marshal3.webp",
      stock: 12,
      category: "Loa",
      brand: "Marshall",
      description: "Loa Bluetooth Marshall Stanmore III thế hệ mới với âm thanh stereo mạnh mẽ, công suất 80W. Thiết kế vintage đặc trưng của Marshall, tích hợp công nghệ Bluetooth 5.2 và kết nối đa dạng.",
      specifications: {
        "Công suất": "80W (Class D)",
        "Driver": "1x 5.25\" woofer, 2x 0.75\" tweeter",
        "Kết nối": "Bluetooth 5.2, AUX 3.5mm, RCA",
        "Tần số": "45Hz - 20kHz",
        "Pin": "Không có (dùng điện)",
        "Kích thước": "350 x 195 x 185mm",
        "Trọng lượng": "4.65kg"
      }
    },
    4: {
      id: 4,
      name: "Chuột Razer Deathadder V3 Pro",
      price: 5990000,
      oldPrice: 6990000,
      image: "assets/images/popular_items/death_adder_v3pro.webp",
      stock: 20,
      category: "Chuột",
      brand: "Razer",
      description: "Chuột gaming không dây Razer Deathadder V3 Pro với sensor Focus Pro 30K DPI, switch optical gen-3. Thiết kế ergonomic nhẹ chỉ 63g, pin lên đến 90 giờ sử dụng.",
      specifications: {
        "Sensor": "Razer Focus Pro 30K DPI",
        "DPI": "30,000 DPI",
        "IPS": "750",
        "Switch": "Razer Optical Gen-3",
        "Tuổi thọ": "90 triệu clicks",
        "Kết nối": "HyperSpeed Wireless, USB-C",
        "Pin": "90 giờ",
        "Trọng lượng": "63g"
      }
    },
    5: {
      id: 5,
      name: "Apple Airpod Pro Gen 2",
      price: 5090000,
      oldPrice: null,
      image: "assets/images/popular_items/airpods-pro-gen-2-magsafe-charge-usb-c.jpg",
      stock: 25,
      category: "Tai nghe",
      brand: "Apple",
      description: "Tai nghe không dây Apple AirPods Pro Gen 2 với chip H2 mới, chống ồn chủ động ANC nâng cao gấp đôi. Chế độ Adaptive Transparency, Spatial Audio với head tracking.",
      specifications: {
        "Chip": "Apple H2",
        "Driver": "Dynamic driver",
        "Chống ồn": "Active Noise Cancellation",
        "Transparency": "Adaptive Transparency",
        "Audio": "Spatial Audio, head tracking",
        "Pin": "6 giờ (tai nghe), 30 giờ (với case)",
        "Sạc": "MagSafe, Lightning, Qi",
        "Chống nước": "IPX4"
      }
    },
    6: {
      id: 6,
      name: "Chuột G502 Hero Logitech",
      price: 1490000,
      oldPrice: null,
      image: "assets/images/popular_items/G502_hero.jpg",
      stock: 30,
      category: "Chuột",
      brand: "Logitech",
      description: "Chuột gaming có dây Logitech G502 HERO với sensor HERO 25K, 11 nút lập trình được. Hệ thống tùy chỉnh trọng lượng linh hoạt, LED RGB LIGHTSYNC đa màu sắc.",
      specifications: {
        "Sensor": "HERO 25K",
        "DPI": "100 - 25,600 DPI",
        "IPS": "400+",
        "Số nút": "11 nút lập trình",
        "Switch": "Mechanical",
        "LED": "RGB LIGHTSYNC",
        "Kết nối": "USB",
        "Trọng lượng": "121g (có thể điều chỉnh)"
      }
    }
  };
  
  // Lấy ID sản phẩm từ URL
  function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
  }
  
  // Hiển thị thông tin sản phẩm
  function displayProduct() {
    const productId = getProductId();
    const product = productsData[productId];
    
    if (!product) {
      document.querySelector('.product-detail-container').innerHTML = `
        <div style="text-align: center; padding: 100px 20px;">
          <h2 style="font-size: 32px; margin-bottom: 20px;">Không tìm thấy sản phẩm</h2>
          <a href="products.html" style="color: #ff5722; font-size: 18px;">← Quay lại trang sản phẩm</a>
        </div>
      `;
      return;
    }
    
    // Cập nhật tiêu đề trang
    document.title = `${product.name} - Tecknole`;
    
    // Hiển thị thông tin cơ bản
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = product.price.toLocaleString() + 'đ';
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-stock').textContent = product.stock;
    document.getElementById('product-description').textContent = product.description;
    
    // Hiển thị giá cũ nếu có
    if (product.oldPrice) {
      const oldPriceElement = document.getElementById('product-old-price');
      oldPriceElement.textContent = product.oldPrice.toLocaleString() + 'đ';
      oldPriceElement.style.display = 'inline';
    }
    
    // Cập nhật số lượng tối đa
    document.getElementById('quantity').max = product.stock;
    
    // Hiển thị mô tả đầy đủ trong tab
    document.getElementById('full-description').textContent = product.description;
    
    // Hiển thị thông số kỹ thuật
    const specsTable = document.getElementById('specs-table');
    specsTable.innerHTML = '';
    for (const [key, value] of Object.entries(product.specifications)) {
      specsTable.innerHTML += `
        <tr>
          <td>${key}</td>
          <td>${value}</td>
        </tr>
      `;
    }
  }
  
  // Chuyển tab
  function switchTab(index) {
    const buttons = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    buttons.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    contents.forEach((content, i) => {
      if (i === index) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
  
  // Thêm vào giỏ hàng
  function addToCart() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'warning');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
      return;
    }
    
    const productId = getProductId();
    const product = productsData[productId];
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!product) {
      toast('Sản phẩm không tồn tại!', 'error');
      return;
    }
    
    if (quantity < 1 || quantity > product.stock) {
      toast(`Số lượng phải từ 1 đến ${product.stock}!`, 'error');
      return;
    }
    
    // Lấy giỏ hàng hiện tại
    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      // Cập nhật số lượng
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        toast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'error');
        return;
      }
      existingItem.quantity = newQuantity;
    } else {
      // Thêm sản phẩm mới
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        stock: product.stock
      });
    }
    
    // Lưu giỏ hàng
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    toast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    updateCartCount();
  }
  
  // Khởi tạo khi trang load
  document.addEventListener('DOMContentLoaded', function() {
    displayProduct();
    updateHeaderUI();
  });