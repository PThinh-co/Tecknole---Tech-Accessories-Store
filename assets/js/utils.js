// utils.js - Các hàm tiện ích chung

// Format số tiền VNĐ
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
  }
  
  // Format ngày giờ
  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Parse giá từ text (loại bỏ ký tự không phải số)
  function parsePrice(priceText) {
    const match = priceText.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/[,.]/g, '')) : 0;
  }
  
  // Tạo ID ngẫu nhiên
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // Debounce function (tối ưu search)
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Validate email
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  // Validate phone number (VN)
  function isValidPhone(phone) {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return regex.test(phone);
  }
  
  // Scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Get query parameter from URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Set query parameter
  function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  }
  
  // Local storage helpers with error handling
  const storage = {
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    },
    
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
      }
    }
  };
  
  // Confirm dialog helper
  function confirm(message, callback) {
    if (window.confirm(message)) {
      callback();
    }
  }
  
  // Loading indicator
  const loading = {
    show() {
      let loader = document.getElementById('loading-overlay');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loading-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        loader.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        `;
        
        const spinner = loader.querySelector('.spinner');
        spinner.style.cssText = `
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #5170ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        `;
        
        // Add animation
        if (!document.getElementById('spinner-animation')) {
          const style = document.createElement('style');
          style.id = 'spinner-animation';
          style.textContent = `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `;
          document.head.appendChild(style);
        }
        
        document.body.appendChild(loader);
      }
      loader.style.display = 'flex';
    },
    
    hide() {
      const loader = document.getElementById('loading-overlay');
      if (loader) {
        loader.style.display = 'none';
      }
    }
  };
  
  // Copy to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      toast('Đã sao chép vào clipboard!', 'success');
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast('Không thể sao chép!', 'error');
    });
  }
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Truncate text
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
  
  // Capitalize first letter
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Sleep function
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Export for use in other files
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      formatCurrency,
      formatDate,
      parsePrice,
      generateId,
      debounce,
      isValidEmail,
      isValidPhone,
      scrollToTop,
      getQueryParam,
      setQueryParam,
      storage,
      loading,
      copyToClipboard,
      isInViewport,
      truncateText,
      capitalize,
      sleep
    };
  }