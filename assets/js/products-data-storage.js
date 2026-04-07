
// Hàm lấy dữ liệu sản phẩm từ API 
async function syncProductsFromDB() {
    try {
        const response = await fetch('api/get_products.php');
        const data = await response.json();

        if (data.success) {
            window.PRODUCTS_DATA = data.products;
            // Kích hoạt sự kiện để các thành phần khác biết dữ liệu đã sẵn sàng
            window.dispatchEvent(new CustomEvent('productsDataReady'));
        } else {
            console.error('Lỗi lấy dữ liệu sản phẩm:', data.message);
        }
    } catch (error) {
        console.error('Lỗi kết nối API sản phẩm:', error);
    }
}

// Chạy đồng bộ khi trang load
syncProductsFromDB();
