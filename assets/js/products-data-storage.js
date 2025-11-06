// File: assets/js/products-data-storage.js

// Lấy dữ liệu Admin đã lưu (sản phẩm đã bị Admin xóa/sửa)
const storedAdminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');

// Lấy dữ liệu tĩnh gốc (PRODUCTS_DATA được định nghĩa trong product-detail.js)
const initialStaticProducts = (typeof PRODUCTS_DATA !== 'undefined' && PRODUCTS_DATA.length > 0) ? PRODUCTS_DATA : [];

if (storedAdminProducts.length > 0) {
    // Nếu có dữ liệu Admin đã lưu, GHI ĐÈ biến toàn cục PRODUCTS_DATA
    // Sử dụng dữ liệu này để đảm bảo sản phẩm đã xóa không xuất hiện.
    window.PRODUCTS_DATA = storedAdminProducts;
} else if (initialStaticProducts.length > 0) {
    // Nếu chưa có dữ liệu Admin, sử dụng dữ liệu tĩnh
    window.PRODUCTS_DATA = initialStaticProducts;
} else {
    // Trường hợp mặc định
    window.PRODUCTS_DATA = [];
}