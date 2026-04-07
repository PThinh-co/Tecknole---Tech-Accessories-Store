// assets/js/product-detail.js

// BIẾN TOÀN CỤC để theo dõi ảnh hiện tại và danh sách ảnh
let currentImageIndex = 0;
let currentGallery = [];
let currentProduct = null;

// DỮ LIỆU SẢN PHẨM (Đã bao gồm 30 sản phẩm và GalleryImages)

// DỮ LIỆU SẢN PHẨM (Bây giờ đã được chuyển sang SQL Database)
let PRODUCTS_DATA = [];

const getSyncedProducts = async () => {
    // Dữ liệu giờ đây sẽ được fetch trực tiếp từ API SQL trong search-pagination.js
    return [];
};

let PRODUCTS_DATA_RAW = []; 
PRODUCTS_DATA = PRODUCTS_DATA_RAW;

// (Optional) Gửi sự kiện để báo cho admin biết client đã load
window.dispatchEvent(new Event('clientDataLoaded'));
// ===================================================================
// LOGIC CHUYỂN ẢNH VÀ XỬ LÝ DỮ LIỆU
// ===================================================================

// Hàm chuyển đổi hình ảnh chính VÀ cập nhật trạng thái nút
// Hàm chuyển đổi hình ảnh chính VÀ cập nhật trạng thái nút
function switchMainImage(index) {
    const mainImage = document.getElementById('product-main-image');
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');

    // **LOẠI BỎ logic giới hạn index tại đây**
    // Chỉ kiểm tra lỗi cơ bản
    if (!mainImage || index < 0 || index >= currentGallery.length) return;

    currentImageIndex = index;
    mainImage.src = currentGallery[index];

    // **CẬP NHẬT TRẠNG THÁI NÚT:**
    // Giữ giới hạn cho nút "Lùi" (Prev)
    prevBtn.disabled = currentImageIndex === 0;
    // Bỏ giới hạn cho nút "Tiếp theo" (Next) - sẽ được xử lý trong handleSliderClick
    nextBtn.disabled = false;

    // Hiệu ứng Fade In/Out đơn giản khi chuyển ảnh
    mainImage.style.opacity = 0;
    setTimeout(() => {
        mainImage.style.opacity = 1;
    }, 100);
}

// Hàm xử lý nút Next/Prev (ĐÃ CHỈNH SỬA)
function handleSliderClick(direction) {
    if (direction === 'next') {
        let newIndex = currentImageIndex + 1;

        // KIỂM TRA LẶP VÔ HẠN (QUAY VỀ ĐẦU)
        if (newIndex >= currentGallery.length) {
            newIndex = 0; // Quay lại ảnh đầu tiên
        }
        switchMainImage(newIndex);

    } else if (direction === 'prev') {
        let newIndex = currentImageIndex - 1;

        // KIỂM TRA LẶP VÔ HẠN (QUAY VỀ CUỐI)
        if (newIndex < 0) {
            newIndex = currentGallery.length - 1; // Quay lại ảnh cuối cùng
        }
        switchMainImage(newIndex);
    }
}
// Removed localStorage cart/user handlers as they are now handled by modal.js + api/add_to_cart.php


// Hàm render chi tiết sản phẩm
function renderProductDetail(product) {
    // 1. Khởi tạo Gallery
    currentProduct = product;
    currentGallery = product.galleryImages && product.galleryImages.length > 0
        ? product.galleryImages
        : [product.image];
    currentImageIndex = 0;

    // Hiển thị nội dung (Ẩn loading state)
    const loadingStateEl = document.getElementById('loading-state');
    if (loadingStateEl) {
        loadingStateEl.style.display = 'none';
    }
    document.getElementById('product-display').style.display = 'grid';
    document.getElementById('product-tabs').style.display = 'block';

    // 2. Thông tin cơ bản
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-short-desc').textContent = product.shortDesc;

    // Khởi tạo hình ảnh và trạng thái nút
    switchMainImage(0); // Luôn bắt đầu từ ảnh đầu tiên

    document.getElementById('display-price').textContent = product.price.toLocaleString('vi-VN') + 'đ';
    document.getElementById('display-stock').textContent = product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng';

    // 3. Gán sự kiện cho nút Next/Prev
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');
    if (prevBtn) prevBtn.onclick = () => handleSliderClick('prev');
    if (nextBtn) nextBtn.onclick = () => handleSliderClick('next');

    // 4. Giá cũ
    const oldPriceEl = document.getElementById('display-old-price');
    if (product.oldPrice) {
        oldPriceEl.textContent = product.oldPrice.toLocaleString('vi-VN') + 'đ';
        oldPriceEl.style.display = 'inline';
    } else {
        oldPriceEl.style.display = 'none';
    }

    // 5. Mô tả chi tiết
    document.getElementById('description-content').innerHTML = `<h3>Mô tả chi tiết</h3>${product.fullDesc}`;

    // 6. Thông số kỹ thuật
    const specsTable = document.getElementById('specs-table');
    let specsHtml = '<h3>Thông số kỹ thuật</h3><table><tbody>';
    product.specs.forEach(spec => {
        specsHtml += `<tr><th>${spec[0]}</th><td>${spec[1]}</td></tr>`;
    });
    specsHtml += '</tbody></table>';
    specsTable.innerHTML = specsHtml;

    // 7. Thêm sự kiện cho nút "Thêm vào giỏ hàng"
    const addToCartBtn = document.getElementById('btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput.value);

            if (product.stock === 0) {
                alert('Sản phẩm đã hết hàng!');
                return;
            }

            if (quantity < 1 || quantity > product.stock) {
                alert(`Số lượng phải từ 1 đến ${product.stock}`);
                return;
            }

            if (typeof globalAddToCart === 'function') {
                globalAddToCart(product.id, quantity);
            }
        });
    }

    // 8. Cập nhật giới hạn số lượng nhập
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.max = product.stock;
    }
}

// Khởi tạo trang chi tiết sản phẩm
document.addEventListener('DOMContentLoaded', () => {
    const productDisplay = document.getElementById('product-display');
    if (!productDisplay) {
        // Nếu không phải trang chi tiết sản phẩm, DỪNG code khởi tạo chi tiết sản phẩm.
        // Chỉ chạy updateAuthUI() và dừng.
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        return;
    }

    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Bổ sung kiểm tra an toàn cho các element hiển thị lỗi
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    if (isNaN(productId)) {
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        return;
    }

    const product = PRODUCTS_DATA.find(p => p.id === productId);

    if (product) {
        renderProductDetail(product);
    } else {
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
    }

    // Đảm bảo UI Header (login/cart count) được cập nhật
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
});

console.log('Tổng số sản phẩm:', PRODUCTS_DATA.length);

// Tên danh mục và thương hiệu
const categoryNames = {
    'manhinh': 'Màn hình',
    'banphim': 'Bàn phím',
    'chuot': 'Chuột',
    'tainghe': 'Tai nghe',
    'loa': 'Loa'
};

const brandNames = {
    'acer': 'Acer', 'asus': 'Asus', 'lg': 'LG', 'msi': 'MSI', 'viewsonic': 'Viewsonic',
    'aula': 'Aula', 'akko': 'Akko', 'razer': 'Razer',
    'corsair': 'Corsair', 'logitech': 'Logitech', 'steelseries': 'SteelSeries',
    'apple': 'Apple', 'bose': 'Bose', 'marshall': 'Marshall', 'sony': 'Sony',
    'acnos': 'Acnos', 'devialet': 'Devialet', 'jbl': 'JBL'
};

// Map thương hiệu với loại sản phẩm chính
const brandPrimaryCategory = {
    'acer': 'manhinh',
    'asus': 'manhinh',
    'lg': 'manhinh',
    'msi': 'manhinh',
    'viewsonic': 'manhinh',
    'aula': 'banphim',
    'akko': 'banphim',
    'corsair': 'chuot',
    'logitech': 'chuot',
    'steelseries': 'chuot',
    'apple': 'tainghe',
    'bose': 'tainghe',
    'marshall': 'tainghe',
    'sony': 'tainghe',
    'acnos': 'loa',
    'devialet': 'loa',
    'jbl': 'loa'
};

// Tự động detect type từ brand
function smartDetectType(brand) {
    if (!brand) return null;
    if (brandPrimaryCategory[brand]) {
        console.log('Tự động detect:', brand, '→', brandPrimaryCategory[brand]);
        return brandPrimaryCategory[brand];
    }
    return null;
}

// Lấy tham số URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Format giá
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Tạo HTML cho thẻ sản phẩm
function createProductCard(product) {
    if (product.status === 'Ngừng bán') {
        return `
            <div class="product-card out-of-stock" style="opacity:0.6; pointer-events:none;">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${formatVND(product.price)}</p>
                <div style="background:#e74c3c; color:white; padding:4px 8px; border-radius:4px; font-size:12px; display:inline-block;">
                    Ngừng bán
                </div>
            </div>
        `;
    }
    const oldPriceHTML = product.oldPrice > 0
        ? '<span class="old-price">' + formatPrice(product.oldPrice) + '</span>'
        : '';

    const badgeHTML = product.badge
        ? '<span class="product-badge">' + product.badge + '</span>'
        : '';

    return '<div class="product-card" onclick="window.location=\'product-detail.php?id=' + product.id + '\'">' +
        '<div class="product-image">' +
        '<img src="' + product.image + '" alt="' + product.name + '">' +
        badgeHTML +
        '</div>' +
        '<div class="product-info">' +
        '<div class="product-name">' + product.name + '</div>' +
        '<div class="product-price">' +
        formatPrice(product.price) +
        oldPriceHTML +
        '</div>' +
        '<button class="add-to-cart">Thêm vào giỏ</button>' +
        '</div>' +
        '</div>';
}

// Lọc và hiển thị sản phẩm
function displayProducts(autoDetect) {
    let typeFilter = document.getElementById('filter-type').value;
    let brandFilter = document.getElementById('filter-brand').value;
    const sortFilter = document.getElementById('filter-sort').value;

    // CHỈ tự động detect khi autoDetect = true (lần đầu load trang)
    // KHÔNG auto-detect khi user thay đổi dropdown
    if (autoDetect && !typeFilter && brandFilter) {
        const detectedType = smartDetectType(brandFilter);
        if (detectedType) {
            typeFilter = detectedType;
            document.getElementById('filter-type').value = detectedType;
        }
    }

    console.log('Bộ lọc:', { type: typeFilter, brand: brandFilter, sort: sortFilter });

    // Lọc sản phẩm
    let filteredProducts = PRODUCTS_DATA.filter(function (product) {
        const matchType = !typeFilter || product.type === typeFilter;
        const matchBrand = !brandFilter || product.brand === brandFilter;
        return matchType && matchBrand;
    });

    console.log('Số sản phẩm sau khi lọc:', filteredProducts.length);

    // Sắp xếp sản phẩm
    if (sortFilter === 'price-asc') {
        filteredProducts.sort(function (a, b) { return a.price - b.price; });
    } else if (sortFilter === 'price-desc') {
        filteredProducts.sort(function (a, b) { return b.price - a.price; });
    } else if (sortFilter === 'name-asc') {
        filteredProducts.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
    } else if (sortFilter === 'name-desc') {
        filteredProducts.sort(function (a, b) { return b.name.localeCompare(a.name, 'vi'); });
    }

    // Hiển thị sản phẩm
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    const countNumber = document.getElementById('count-number');

    if (filteredProducts.length === 0) {
        container.innerHTML = '';
        noProducts.style.display = 'block';
        countNumber.textContent = '0';
        console.log('Không có sản phẩm nào phù hợp');
    } else {
        const productsHTML = filteredProducts.map(function (product) {
            return createProductCard(product);
        }).join('');
        container.innerHTML = productsHTML;
        noProducts.style.display = 'none';
        countNumber.textContent = filteredProducts.length;
        console.log('Đã hiển thị', filteredProducts.length, 'sản phẩm');
    }
}

// Cập nhật tiêu đề trang
function updatePageTitle() {
    let type = getUrlParameter('type');
    const brand = getUrlParameter('brand');

    // Tự động detect type nếu chỉ có brand
    if (!type && brand) {
        type = smartDetectType(brand);
    }

    let title = 'Danh mục sản phẩm';
    let description = 'Khám phá các sản phẩm chất lượng cao';

    if (type && brand) {
        title = categoryNames[type] + ' ' + brandNames[brand];
        description = 'Các sản phẩm ' + categoryNames[type] + ' của thương hiệu ' + brandNames[brand];
    } else if (type) {
        title = categoryNames[type];
        description = 'Tất cả sản phẩm ' + categoryNames[type];
    } else if (brand) {
        title = 'Thương hiệu ' + brandNames[brand];
        description = 'Tất cả sản phẩm của ' + brandNames[brand];
    }

    document.getElementById('category-title').textContent = title;
    document.getElementById('category-desc').textContent = description;
    document.title = title + ' - Tecknole';

    console.log('Tiêu đề trang:', title);
}

// Khởi tạo bộ lọc từ URL
function initializeFilters() {
    let type = getUrlParameter('type');
    const brand = getUrlParameter('brand');

    // Tự động detect type nếu chỉ có brand
    if (!type && brand) {
        type = smartDetectType(brand);
    }

    if (type) {
        document.getElementById('filter-type').value = type;
        console.log('Đã set filter type:', type);
    }
    if (brand) {
        document.getElementById('filter-brand').value = brand;
        console.log('Đã set filter brand:', brand);
    }
}
const filterTypeEl = document.getElementById('filter-type');
const filterBrandEl = document.getElementById('filter-brand');
const filterSortEl = document.getElementById('filter-sort');

if (filterTypeEl && filterBrandEl && filterSortEl) {
    // Nếu là trang danh mục/products, gắn sự kiện và khởi tạo UI
    filterTypeEl.addEventListener('change', function () {
        console.log('Đã thay đổi loại sản phẩm');
        displayProducts();
    });

    filterBrandEl.addEventListener('change', function () {
        console.log('Đã thay đổi thương hiệu');
        displayProducts();
    });

    filterSortEl.addEventListener('change', function () {
        console.log('Đã thay đổi cách sắp xếp');
        displayProducts();
    });
}
// Khởi tạo trang khi DOM đã load xong
window.addEventListener('DOMContentLoaded', function () {
    // [FIX QUAN TRỌNG] Kiểm tra xem có phần tử đặc trưng của trang Danh mục/Products không.
    const productsContainer = document.getElementById('products-container');

    if (productsContainer) {
        console.log('=== BẮT ĐẦU KHỞI TẠO TRANG DANH MỤC ===');
        // Các hàm này chỉ được gọi khi chắc chắn các ID UI của trang danh mục đã có
        if (typeof updatePageTitle === 'function') {
            updatePageTitle();
        }
        // Kiểm tra đăng nhập trước khi cho phép thêm vào giỏ (đã có requireLogin trong modal.js)
        if (typeof requireLogin === 'function' && !requireLogin()) return;
        if (typeof initializeFilters === 'function') {
            initializeFilters();
        }
        if (typeof displayProducts === 'function') {
            displayProducts();
        }
        console.log('=== HOÀN THÀNH KHỞI TẠO ===');
    }
});
window.addEventListener('adminDataChanged', function () {
    // 1. Hiển thị thông báo (Giữ nguyên)
    const notification = document.createElement('div');
    // ... (Code tạo thông báo giữ nguyên) ...

    document.body.appendChild(notification);

    // 2. [KÍCH HOẠT UI] Buộc trang danh mục và giỏ hàng reload data
    if (typeof displayProducts === 'function') {
        // Gọi hàm hiển thị sản phẩm để đọc PRODUCTS_DATA đã được cập nhật
        displayProducts();
    }
    if (typeof updateAuthUI === 'function') {
        // Cập nhật số lượng giỏ hàng
        updateAuthUI();
    }

    // 3. Tự động xóa thông báo
    setTimeout(() => {
        if (notification.isConnected) {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }
    }, 10000);
});