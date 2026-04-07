// ===================================================================
// BIẾN TOÀN CỤC
// ===================================================================
let currentPage = 1;
const productsPerPage = 8;
let currentFilteredList = [];
let productsSearchData = [];
let searchInput, suggestionsContainer;
const maxSuggestions = 5;
const SEARCH_HISTORY_KEY = 'tecknole_search_history';
const MAX_HISTORY = 5;

// ===================================================================
// PHẦN 1: LOGIC THANH TÌM KIẾM (AUTOCOMPLETE)
// ===================================================================

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

function handleSuggestionClick(productId) {
    if (searchInput && searchInput.value.trim()) saveSearchHistory(searchInput.value.trim());
    window.location.href = `product-detail.php?id=${productId}`;
    hideSuggestionsDropdown();
}

async function showSuggestions(query) {
    if (!suggestionsContainer || query.length < 2) {
        hideSuggestionsDropdown();
        return;
    }

    try {
        const response = await fetch(`api/get_products.php?search=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();

        if (data.success && data.products.length > 0) {
            const listHTML = data.products.map(createSuggestionItemSearch).join('');
            suggestionsContainer.innerHTML = `<ul>${listHTML}</ul>`;
            suggestionsContainer.setAttribute('aria-hidden', 'false');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.innerHTML = '<ul><li>Không tìm thấy sản phẩm.</li></ul>';
            suggestionsContainer.setAttribute('aria-hidden', 'false');
            suggestionsContainer.style.display = 'block';
        }
    } catch (error) {
        console.error("Lỗi fetch gợi ý:", error);
    }
}

function hideSuggestionsDropdown() {
    if (!suggestionsContainer) return;
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.setAttribute('aria-hidden', 'true');
    suggestionsContainer.style.display = 'none';
}

// ===================================================================
// PHẦN 2: PHÂN TRANG VÀ HIỂN THỊ DANH MỤC
// ===================================================================

function displayProducts(autoDetect = false) {
    const typeFilterEl = document.getElementById('filter-type');
    const brandFilterEl = document.getElementById('filter-brand');
    const sortFilterEl = document.getElementById('filter-sort');

    if (!typeFilterEl || !brandFilterEl || !sortFilterEl || typeof PRODUCTS_DATA === 'undefined') return;

    let typeFilter = typeFilterEl.value;
    let brandFilter = brandFilterEl.value;
    const sortFilter = sortFilterEl.value;

    const searchQuery = getUrlParameter('q') ? getUrlParameter('q').toLowerCase() : '';

    currentFilteredList = PRODUCTS_DATA.filter(function (product) {
        const matchType = !typeFilter || product.type === typeFilter;
        const matchBrand = !brandFilter || product.brand === brandFilter;
        const matchQuery = !searchQuery ||
            product.name.toLowerCase().includes(searchQuery) ||
            product.code.toLowerCase().includes(searchQuery);
        return matchType && matchBrand && matchQuery;
    });

    if (sortFilter === 'price-asc') currentFilteredList.sort((a, b) => a.price - b.price);
    else if (sortFilter === 'price-desc') currentFilteredList.sort((a, b) => b.price - a.price);
    else if (sortFilter === 'name-asc') currentFilteredList.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    else if (sortFilter === 'name-desc') currentFilteredList.sort((a, b) => b.name.localeCompare(a.name, 'vi'));

    currentPage = 1;
    renderCurrentPage();
}

function renderPaginationControls(totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    container.innerHTML = '';
    container.innerHTML += `<button class="page-btn" data-action="prev" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;

    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    container.innerHTML += `<button class="page-btn" data-action="next" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;
}

function handlePageClick(page) {
    const totalPages = Math.ceil(currentFilteredList.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentPage() {
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    const paginationContainer = document.getElementById('pagination-container');
    const countNumberEl = document.getElementById('count-number');

    if (!container || !noProducts || !paginationContainer || !countNumberEl) return;
    if (typeof createProductCard !== 'function') return;

    const totalPages = Math.ceil(currentFilteredList.length / productsPerPage);

    if (currentFilteredList.length === 0) {
        container.innerHTML = '';
        paginationContainer.innerHTML = '';
        noProducts.style.display = 'block';
        countNumberEl.textContent = '0';
        return;
    }

    noProducts.style.display = 'none';
    countNumberEl.textContent = currentFilteredList.length;

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = currentFilteredList.slice(startIndex, endIndex);

    container.innerHTML = paginatedProducts.map(createProductCard).join('');
    renderPaginationControls(totalPages);
}

// ===================================================================
// PHẦN 3: LỊCH SỬ TÌM KIẾM
// ===================================================================

function getSearchHistory() {
    try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []; }
    catch { return []; }
}

function saveSearchHistory(query) {
    if (!query || query.trim().length < 2) return;
    const q = query.trim();
    let history = getSearchHistory().filter(item => item.toLowerCase() !== q.toLowerCase());
    history.unshift(q);
    history = history.slice(0, MAX_HISTORY);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

function showHistoryDropdown() {
    const history = getSearchHistory();
    if (!suggestionsContainer || history.length === 0) { hideSuggestionsDropdown(); return; }

    const itemsHTML = history.map(q => `
        <li class="suggestion-history-item" onclick="selectHistoryItem('${encodeURIComponent(q)}')">
            <span class="suggestion-history-text">${q}</span>
        </li>
    `).join('');

    suggestionsContainer.innerHTML = `
        <div class="suggestion-section-header"><span>Tìm kiếm gần đây</span></div>
        <ul>${itemsHTML}</ul>
    `;
    suggestionsContainer.setAttribute('aria-hidden', 'false');
    suggestionsContainer.style.display = 'block';
}

function selectHistoryItem(encodedQuery) {
    const query = decodeURIComponent(encodedQuery);
    if (searchInput) {
        searchInput.value = query;
        const form = searchInput.closest('form');
        if (form) form.submit();
    }
}

// ===================================================================
// PHẦN KHỞI TẠO
// ===================================================================

window.addEventListener('DOMContentLoaded', function () {
    searchInput = document.getElementById('js-search');
    suggestionsContainer = document.getElementById('autocomplete-list');

    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value;
            clearTimeout(timeoutId);
            if (val.length >= 2) {
                timeoutId = setTimeout(() => showSuggestions(val), 300);
            } else if (val.length === 0) {
                showHistoryDropdown();
            } else {
                hideSuggestionsDropdown();
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length === 0) showHistoryDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-search')) hideSuggestionsDropdown();
        });
    }

    // Pagination events
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-btn');
            if (btn && !btn.disabled) {
                if (btn.dataset.action === 'prev') handlePageClick(currentPage - 1);
                else if (btn.dataset.action === 'next') handlePageClick(currentPage + 1);
                else handlePageClick(parseInt(btn.dataset.page));
            }
        });
    }

    // Filter events
    const filters = ['filter-type', 'filter-brand', 'filter-sort'];
    filters.forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => displayProducts());
    });

    // Initial display - Listen for data ready event from products-data-storage.js
    if (document.getElementById('products-container')) {
        window.addEventListener('productsDataReady', function () {
            displayProducts(true);
        });

        // Fallback if data was already loaded
        if (typeof PRODUCTS_DATA !== 'undefined' && PRODUCTS_DATA.length > 0) {
            displayProducts(true);
        }
    }
});

// Helper
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
