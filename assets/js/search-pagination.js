// Lấy tham chiếu các biến toàn cục (được định nghĩa trong product-detail.js)
// PRODUCTS_DATA (Danh sách sản phẩm)
// createProductCard (Hàm tạo thẻ sản phẩm)

// === BIẾN TOÀN CỤC PHÂN TRANG ===
let currentPage = 1;
const productsPerPage = 8; // 4 sản phẩm/hàng * 2 hàng = 8
let currentFilteredList = []; 
let productsSearchData = []; 

// === BIẾN TOÀN CỤC TÌM KIẾM ===
let searchInput, suggestionsContainer;
const maxSuggestions = 5;

// ===================================================================
// PHẦN 1: LOGIC PHÂN TRANG VÀ HIỂN THỊ DANH MỤC
// ===================================================================

// Hàm này được gọi từ product-detail.js (Khi filter thay đổi)
function displayProducts(autoDetect = false) {
    const typeFilterEl = document.getElementById('filter-type');
    const brandFilterEl = document.getElementById('filter-brand');
    const sortFilterEl = document.getElementById('filter-sort');
    
    // Đảm bảo PRODUCTS_DATA đã được load từ product-detail.js
    if (!typeFilterEl || !brandFilterEl || !sortFilterEl || typeof PRODUCTS_DATA === 'undefined') {
        return; 
    }

    // Lấy giá trị từ dropdown filter
    let typeFilter = typeFilterEl.value;
    let brandFilter = brandFilterEl.value;
    const sortFilter = sortFilterEl.value;

    // Lấy tham số tìm kiếm từ URL (q) và category ID (scat_id)
    const searchQuery = getUrlParameter('q') ? getUrlParameter('q').toLowerCase() : '';
    const searchCatId = getUrlParameter('scat_id'); 
    
    // Tự động detect type nếu cần
    if (autoDetect && !typeFilter && brandFilter && typeof smartDetectType === 'function') {
        const detectedType = smartDetectType(brandFilter);
        if (detectedType) {
            typeFilter = detectedType;
            typeFilterEl.value = detectedType;
        }
    }
    
    // TỰ ĐỘNG CHỌN DANH MỤC TỪ THANH TÌM KIẾM CHUNG (scat_id)
    if (searchCatId && searchCatId !== "") {
        // Ánh xạ ID danh mục (1, 2, 3...) sang type (manhinh, banphim...)
        const searchCategoryMap = {
            '1': 'manhinh', '2': 'banphim', '3': 'chuot', 
            '4': 'tainghe', '5': 'loa', 
        };
        const searchType = searchCategoryMap[searchCatId];
        if (searchType) {
            typeFilter = searchType;
            typeFilterEl.value = searchType;
        }
    }


    // Lọc sản phẩm
    currentFilteredList = PRODUCTS_DATA.filter(function(product) {
        // 1. Lọc theo Type/Brand (từ dropdown)
        const matchType = !typeFilter || product.type === typeFilter;
        const matchBrand = !brandFilter || product.brand === brandFilter;

        // 2. Lọc theo Query (từ URL tìm kiếm)
        const matchQuery = !searchQuery || 
                           product.name.toLowerCase().includes(searchQuery) ||
                           product.code.toLowerCase().includes(searchQuery);

        return matchType && matchBrand && matchQuery;
    });

    // Sắp xếp sản phẩm 
    if (sortFilter === 'price-asc') {
        currentFilteredList.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'price-desc') {
        currentFilteredList.sort((a, b) => b.price - a.price);
    } else if (sortFilter === 'name-asc') {
        currentFilteredList.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortFilter === 'name-desc') {
        currentFilteredList.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
    }

    // Reset về trang 1 và render
    currentPage = 1;
    renderCurrentPage();
}

// 1. Render các nút điều khiển phân trang
function renderPaginationControls(totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    container.innerHTML = ''; 
    
    // Nút "Prev"
    container.innerHTML += `<button class="page-btn" data-action="prev" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;
    
    // Nút số trang
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        container.innerHTML += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            container.innerHTML += `<span>...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        container.innerHTML += `<button class="page-btn" data-page="${i}" ${i === currentPage ? 'active' : ''}>${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            container.innerHTML += `<span>...</span>`;
        }
        container.innerHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Nút "Next"
    container.innerHTML += `<button class="page-btn" data-action="next" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;
}

// 2. Xử lý khi click nút trang
function handlePageClick(page) {
    const totalPages = Math.ceil(currentFilteredList.length / productsPerPage);
    if (page < 1 || page > totalPages) return; 

    currentPage = page;
    renderCurrentPage(); 
    // Cuộn lên đầu vùng chứa sản phẩm sau khi chuyển trang
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' }); 
}

// 3. Render sản phẩm của trang hiện tại
function renderCurrentPage() {
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    const paginationContainer = document.getElementById('pagination-container');
    const countNumberEl = document.getElementById('count-number');

    if (!container || !noProducts || !paginationContainer || !countNumberEl) return;
    if (typeof createProductCard !== 'function') {
        console.error("Lỗi: Hàm createProductCard không được tìm thấy.");
        return;
    }

    const totalPages = Math.ceil(currentFilteredList.length / productsPerPage);
    
    if (currentFilteredList.length === 0) {
        container.innerHTML = '';
        paginationContainer.innerHTML = ''; 
        noProducts.style.display = 'block';
        countNumberEl.textContent = '0';
        return;
    }
    
    noProducts.style.display = 'none';
    
    // Cập nhật số lượng sản phẩm hiển thị
    countNumberEl.textContent = currentFilteredList.length;

    // Tính toán sản phẩm cho trang này
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = currentFilteredList.slice(startIndex, endIndex);

    // Render sản phẩm (sử dụng hàm từ product-detail.js)
    const productsHTML = paginatedProducts.map(createProductCard).join('');
    container.innerHTML = productsHTML;

    // Render nút phân trang
    renderPaginationControls(totalPages);
}

// Gắn sự kiện phân trang (Event Delegation)
const paginationContainerGlobal = document.getElementById('pagination-container');
if(paginationContainerGlobal) {
    paginationContainerGlobal.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn') && !e.target.disabled) {
            if (e.target.dataset.action === 'prev') {
                handlePageClick(currentPage - 1);
            } else if (e.target.dataset.action === 'next') {
                handlePageClick(currentPage + 1);
            } else {
                const page = parseInt(e.target.dataset.page);
                if (!isNaN(page)) {
                    handlePageClick(page);
                }
            }
        }
    });
}

// ===================================================================
// PHẦN 2: LOGIC THANH TÌM KIẾM (AUTOCOMPLETE)
// ===================================================================

// Hàm tạo HTML cho gợi ý
function createSuggestionItemSearch(product) {
    return `
        <li role="option" data-id="${product.id}" onclick="handleSuggestionClick(${product.id})">
            <img src="${product.image}" alt="${product.name}" />
            <div class="suggestion-info">
                <div class="suggestion-name">${product.name}</div>
                <div class="suggestion-code">${product.code}</div>
            </div>
        </li>
    `;
}

// Hàm xử lý click vào gợi ý
function handleSuggestionClick(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '<ul></ul>';
        suggestionsContainer.setAttribute('aria-hidden', 'true');
    }
}

// Hàm xử lý hiển thị gợi ý
function showSuggestions(query) {
    if (!suggestionsContainer || query.length < 2 || productsSearchData.length === 0) {
        if(suggestionsContainer) {
            suggestionsContainer.innerHTML = '<ul></ul>';
            suggestionsContainer.setAttribute('aria-hidden', 'true');
        }
        return;
    }

    const lowerQuery = query.toLowerCase();
    
    const matchedProducts = productsSearchData.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.code.toLowerCase().includes(lowerQuery)
    ).slice(0, maxSuggestions); 

    if (matchedProducts.length > 0) {
        const listHTML = matchedProducts.map(createSuggestionItemSearch).join('');
        suggestionsContainer.innerHTML = `<ul>${listHTML}</ul>`;
        suggestionsContainer.setAttribute('aria-hidden', 'false');
    } else {
        suggestionsContainer.innerHTML = '<ul><li>Không tìm thấy sản phẩm.</li></ul>';
        suggestionsContainer.setAttribute('aria-hidden', 'false');
    }
}

// ===================================================================
// PHẦN 3: KHỞI TẠO VÀ GẮN SỰ KIỆN TỔNG THỂ
// ===================================================================

window.addEventListener('DOMContentLoaded', function() {
    // 1. Khởi tạo biến tìm kiếm (sau khi product-detail.js đã load PRODUCTS_DATA)
    if (typeof PRODUCTS_DATA !== 'undefined' && PRODUCTS_DATA.length > 0) {
        productsSearchData = PRODUCTS_DATA.map(p => ({
            id: p.id,
            name: p.name,
            code: p.code,
            image: p.image 
        }));
    }
    
    // 2. Lấy các phần tử UI tìm kiếm
    searchInput = document.getElementById('js-search');
    suggestionsContainer = document.getElementById('autocomplete-list');

    // 3. Gắn sự kiện cho thanh tìm kiếm
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            showSuggestions(e.target.value);
        });

        document.addEventListener('click', (e) => {
            if (suggestionsContainer && !e.target.closest('.header-search')) {
                suggestionsContainer.innerHTML = '<ul></ul>';
                suggestionsContainer.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // 4. Nếu là trang danh mục, gọi hàm hiển thị ban đầu
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        // Hàm này gọi displayProducts từ chính file này
        if (typeof initializeFilters === 'function') {
            initializeFilters(); 
            displayProducts(true); // Khởi tạo hiển thị
        }

        // Gắn sự kiện cho các bộ lọc (chỉ gọi displayProducts để render lại)
        document.getElementById('filter-type').addEventListener('change', function() {
            displayProducts();
        });

        document.getElementById('filter-brand').addEventListener('change', function() {
            displayProducts();
        });

        document.getElementById('filter-sort').addEventListener('change', function() {
            displayProducts();
        });
    }
});

function getSyncedCategories() {
    // 1. Dữ liệu mặc định phòng trường hợp localStorage rỗng
    const defaultCategories = [
        { id: 1, code: 'PK', name: 'Phụ kiện', type: 'pk', profit: 20, status: 'active' },
        { id: 2, code: 'MN', name: 'Màn hình', type: 'manhinh', profit: 15, status: 'active' },
        { id: 3, code: 'BP', name: 'Bàn phím', type: 'banphim', profit: 15, status: 'active' },
        { id: 4, code: 'CH', name: 'Chuột', type: 'chuot', profit: 18, status: 'active' },
        { id: 5, code: 'TN', name: 'Tai nghe', type: 'tainghe', profit: 22, status: 'active' },
        { id: 6, code: 'LOA', name: 'Loa', type: 'loa', profit: 20, status: 'active' }
    ];
    
    // 2. Lấy dữ liệu từ admin (nguồn chính)
    let categories = JSON.parse(localStorage.getItem('admin_categories')) || defaultCategories;
    
    // 3. Chỉ trả về các danh mục đang 'active'
    return categories.filter(cat => cat.status === 'active' || cat.status === undefined);
}

/**
 * Hàm 1: Cập nhật các bộ lọc dạng <select>
 * (Bao gồm thanh tìm kiếm và thanh filter ở nội dung)
 */
function populateCategorySelects(categories) {
    // Tìm TẤT CẢ các dropdown <select> cần cập nhật
    const selectDropdowns = document.querySelectorAll(
        'select[name="scat_id"], #filter-type'
    );

    if (selectDropdowns.length === 0) return;

    selectDropdowns.forEach(selectElement => {
        const currentSelectedValue = selectElement.value; // Lưu giá trị cũ
        
        // Giữ lại option đầu tiên (ví dụ: "Tất cả danh mục")
        const firstOption = selectElement.querySelector('option');
        selectElement.innerHTML = ''; 
        if (firstOption) {
            selectElement.appendChild(firstOption);
        }

        // Thêm các option mới từ dữ liệu
        categories.forEach(cat => {
            const option = document.createElement('option');
            // Dùng `cat.type` để đồng bộ với cách lọc
            option.value = cat.type; 
            option.textContent = cat.name;
            selectElement.appendChild(option);
        });

        // Khôi phục giá trị đã chọn (nếu có)
        if (currentSelectedValue) {
            selectElement.value = currentSelectedValue;
        }
    });
}

/**
 * Hàm 2: Cập nhật menu điều hướng <nav> chính
 */
function populateCategoryNavMenu(categories) {
    // Tìm menu <ul> trong <nav>
    const navMenu = document.querySelector('nav .dropdown-menu');
    if (!navMenu) return;

    // Xóa sạch các <li> danh mục cũ
    navMenu.innerHTML = ''; 

    categories.forEach(cat => {
        const li = document.createElement('li');
        
        // Tạo link danh mục chính
        // Lưu ý: Code này sẽ thay thế menu tĩnh cũ, 
        // bao gồm cả các submenu thương hiệu (Acer, Asus...)
        // vì dữ liệu thương hiệu không được đồng bộ từ admin.
        li.innerHTML = `<a href="category.html?type=${cat.type}">${cat.name}</a>`;
        
        navMenu.appendChild(li);
    });
}

/**
 * Hàm chạy chính: Đồng bộ tất cả
 */
function syncAllCategories() {
    const categories = getSyncedCategories();
    populateCategorySelects(categories);
    populateCategoryNavMenu(categories);
}

// Chạy hàm này ngay khi tệp modal.js được tải
// (Vì modal.js được tải ở mọi trang)
document.addEventListener('DOMContentLoaded', syncAllCategories);

// (Nâng cao) Tự động cập nhật nếu admin thay đổi
window.addEventListener('adminDataChanged', syncAllCategories);
