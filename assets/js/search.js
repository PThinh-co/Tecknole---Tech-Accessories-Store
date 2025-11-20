function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
}

function searchProducts(query, category = '') {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];
    return PRODUCTS_DATA.filter(product => {
        const name = removeVietnameseTones(product.name);
        const code = removeVietnameseTones(product.code);
        const brand = removeVietnameseTones(product.brand);
        const type = removeVietnameseTones(product.type);
        const desc = product.shortDesc ? removeVietnameseTones(product.shortDesc) : '';
        const cleanSearch = removeVietnameseTones(searchTerm);
        const matchesName = name.includes(cleanSearch);
        const matchesCode = code.includes(cleanSearch);
        const matchesBrand = brand.includes(cleanSearch);
        const matchesType = type.includes(cleanSearch);
        const matchesDesc = desc.includes(cleanSearch);
        const matchesKeywords = checkKeywords(cleanSearch, product);
        const matchesSearch = matchesName || matchesCode || matchesBrand || matchesType || matchesDesc || matchesKeywords;
        const matchesCategory = !category || product.type === category;
        return matchesSearch && matchesCategory;
    });
}

function checkKeywords(searchTerm, product) {
    const keywords = {
        'gaming': ['manhinh', 'banphim', 'chuot', 'tainghe'],
        'bluetooth': ['chuot', 'tainghe', 'loa', 'banphim'],
        'wireless': ['chuot', 'tainghe', 'loa', 'banphim'],
        'khong day': ['chuot', 'tainghe', 'loa', 'banphim'],
        'rgb': ['banphim', 'chuot'],
        'led': ['banphim', 'chuot'],
        'co': ['banphim'],
        'mechanical': ['banphim'],
        'chong on': ['tainghe'],
        'anc': ['tainghe'],
        'karaoke': ['loa'],
        '2k': ['manhinh'],
        '4k': ['manhinh'],
        'qhd': ['manhinh'],
        '144hz': ['manhinh'],
        '240hz': ['manhinh']
    };
    for (let keyword in keywords) {
        if (searchTerm.includes(keyword)) {
            return keywords[keyword].includes(product.type);
        }
    }
    return false;
}

function getSearchSuggestions(query, limit = 5) {
    const results = searchProducts(query);
    return results.slice(0, limit);
}

let searchTimeout;
const SEARCH_DELAY = 300;

function initializeSearchAutocomplete() {
    const searchInput = document.getElementById('js-search');
    const suggestionsList = document.querySelector('.autocomplete-suggestions ul');
    const suggestionsContainer = document.querySelector('.autocomplete-suggestions');
    const categorySelect = document.querySelector('select[name="scat_id"]');
    if (!searchInput || !suggestionsList) return;
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        clearTimeout(searchTimeout);
        if (query.length < 1) {
            hideSuggestions();
            return;
        }
        searchTimeout = setTimeout(() => {
            const category = getCategoryFromSelect(categorySelect.value);
            const suggestions = getSearchSuggestions(query, 5);
            if (suggestions.length > 0) {
                displaySuggestions(suggestions, suggestionsList, suggestionsContainer, query);
            } else {
                displayNoResults(suggestionsList, suggestionsContainer);
            }
        }, SEARCH_DELAY);
    });
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) hideSuggestions();
    });
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 1 && suggestionsList.children.length > 0) {
            suggestionsContainer.style.display = 'block';
            suggestionsContainer.setAttribute('aria-hidden', 'false');
        }
    });
}

function getCategoryFromSelect(selectValue) {
    const categoryMap = { '1': 'manhinh', '2': 'banphim', '3': 'chuot', '4': 'tainghe', '5': 'loa', '6': 'mic' };
    return categoryMap[selectValue] || '';
}

function displaySuggestions(suggestions, listElement, containerElement, query) {
    listElement.innerHTML = '';
    suggestions.forEach(product => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        li.setAttribute('role', 'option');
        const highlightedName = highlightSearchTerm(product.name, query);
        li.innerHTML = `
            <div class="suggestion-content">
                <img src="${product.image}" alt="${product.name}" class="suggestion-image">
                <div class="suggestion-info">
                    <div class="suggestion-name">${highlightedName}</div>
                    <div class="suggestion-price">${formatPrice(product.price)}</div>
                    ${product.oldPrice ? `<span class="suggestion-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
            </div>`;
        li.addEventListener('click', function() {
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        listElement.appendChild(li);
    });
    containerElement.style.display = 'block';
    containerElement.setAttribute('aria-hidden', 'false');
}

function displayNoResults(listElement, containerElement) {
    listElement.innerHTML = `
        <li class="suggestion-no-results">
            <div style="padding: 15px; text-align: center; color: #999;">
                <svg width="48" height="48" style="margin-bottom: 10px;">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#ddd" stroke-width="2"/>
                    <line x1="15" y1="24" x2="33" y2="24" stroke="#ddd" stroke-width="2"/>
                </svg>
                <div>Không tìm thấy sản phẩm phù hợp</div>
            </div>
        </li>`;
    containerElement.style.display = 'block';
    containerElement.setAttribute('aria-hidden', 'false');
}

function hideSuggestions() {
    const container = document.querySelector('.autocomplete-suggestions');
    if (container) {
        container.style.display = 'none';
        container.setAttribute('aria-hidden', 'true');
    }
}

function highlightSearchTerm(text, term) {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

function initializeSearchResultsPage() {
    if (!window.location.pathname.includes('search-results.html')) return;
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const category = urlParams.get('scat_id') || '';
    if (!query) {
        displayEmptySearch();
        return;
    }
    document.getElementById('search-query').textContent = query;
    const categoryType = getCategoryFromSelect(category);
    const results = searchProducts(query, categoryType);
    displaySearchResults(results, query);
}

function displaySearchResults(products, query) {
    const container = document.getElementById('search-results-container');
    const countElement = document.getElementById('results-count');
    if (!container) return;
    if (countElement) countElement.textContent = `Tìm thấy ${products.length} sản phẩm`;
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc <a href="products.html">xem tất cả sản phẩm</a></p>
            </div>`;
        return;
    }
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const oldPriceHTML = product.oldPrice > 0 ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
    const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
    return `
        <div class="product-card" onclick="window.location='product-detail.html?id=${product.id}'">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${badgeHTML}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    ${formatPrice(product.price)}
                    ${oldPriceHTML}
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); handleQuickAddToCart(${product.id})">
                    Thêm vào giỏ
                </button>
            </div>
        </div>`;
}

function displayEmptySearch() {
    const container = document.getElementById('search-results-container');
    if (container) {
        container.innerHTML = `
            <div class="empty-search">
                <h3>Nhập từ khóa để tìm kiếm</h3>
                <p><a href="products.html">Xem tất cả sản phẩm</a></p>
            </div>`;
    }
}

function handleQuickAddToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    if (typeof addToCart === 'function') addToCart(product, 1);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSearchAutocomplete();
    initializeSearchResultsPage();
});

document.addEventListener('DOMContentLoaded', function() {
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = form.querySelector('input[name="q"]').value.trim();
            const category = form.querySelector('select[name="scat_id"]').value;
            if (!query) {
                alert('Vui lòng nhập từ khóa tìm kiếm');
                return;
            }
            let url = `search-results.html?q=${encodeURIComponent(query)}`;
            if (category) url += `&scat_id=${category}`;
            window.location.href = url;
        });
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { searchProducts, getSearchSuggestions, formatPrice };
}
