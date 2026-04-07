
/**
 * Hàm tạo thẻ sản phẩm HTML (Product Card)
 */
function createProductCard(product) {
    const priceFormatted = typeof formatVND === 'function' ? formatVND(product.price) : `${product.price}đ`;
    const oldPriceHtml = (product.old_price > 0) 
        ? `<span class="old-price" style="text-decoration: line-through; color: #999; font-size: 14px; margin-left: 10px;">${typeof formatVND === 'function' ? formatVND(product.old_price) : product.old_price + 'đ'}</span>` 
        : '';
    const isDiscounted = product.old_price > 0;
    
    // Xử lý ảnh (đảm bảo đường dẫn đúng)
    let imagePath = product.image || 'assets/images/default.jpg';
    if (imagePath.startsWith('../')) imagePath = imagePath.replace('../', '');

    return `
        <div class="product-card" data-id="${product.id}">
            <a href="product-detail.php?id=${product.id}">
                <div class="product-image">
                    <img src="${imagePath}" alt="${product.name}">
                </div>
            </a>
            <div class="product-info">
                <a href="product-detail.php?id=${product.id}" class="product-name">${product.name}</a>
                <div class="product-price ${isDiscounted ? 'price-discounted' : ''}">${priceFormatted}${oldPriceHtml}</div>
                <button type="button" class="add-to-cart" onclick="globalAddToCart(${product.id}, 1)">
                    Thêm vào giỏ
                </button>
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