// File: assets/js/index-scripts.js (Đã sửa lỗi)

/**
 * Hàm tạo thẻ sản phẩm HTML (Product Card)
 */
function createProductCard(product) {
    // Đảm bảo có sẵn hàm formatVND() từ modal.js
    const priceFormatted = typeof formatVND === 'function' ? formatVND(product.price) : `${product.price}đ`;

    // Lấy đường dẫn ảnh, đảm bảo không có ../ (vì index.html ngang cấp với assets/)
    const imagePath = product.image ? product.image.replace('../', '') : 'assets/images/default.jpg';

    return `
        <div class="product-card" data-id="${product.id}">
            
            <a href="product-detail.html?id=${product.id}">
                <div class="product-image">
                    <img src="${imagePath}" alt="${product.name}">
                </div>
            </a>

            <div class="product-info">
                <a href="product-detail.html?id=${product.id}" class="product-name">${product.name}</a>
                <div class="product-price">${priceFormatted}</div>
                
                <a href="product-detail.html?id=${product.id}" class="add-to-cart">
                    MUA NGAY
                </a>
            </div>
        </div>
    `;
}

/**
 * Hàm tải và hiển thị sản phẩm nổi bật
 */
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    
    // Kiểm tra xem PRODUCTS_DATA đã được tải chưa
    if (!container || typeof PRODUCTS_DATA === 'undefined') {
        console.error("Lỗi: Không tìm thấy 'featured-products-container' hoặc 'PRODUCTS_DATA' chưa được tải.");
        return;
    }

    // 1. Lọc sản phẩm đang bán (status: "Đang bán")
    const activeProducts = PRODUCTS_DATA.filter(p => p.status === 'Đang bán');
    
    // 2. Chọn tối đa 8 sản phẩm đầu tiên
    const featuredList = activeProducts.slice(0, 6);

    if (featuredList.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #777;">Hiện chưa có sản phẩm nào được bày bán.</p>';
        return;
    }

    // 3. Render sản phẩm
    let htmlContent = '';
    featuredList.forEach(product => {
        htmlContent += createProductCard(product);
    });

    container.innerHTML = htmlContent;
}

// Chạy hàm tải sản phẩm khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);