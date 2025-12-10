// Cấu hình API endpoint
export const API_CONFIG = {
  // Base URL của backend API
  // Sử dụng IP của máy chạy backend nếu khác máy với admin app
  BASE_URL: 'http://localhost:5000',
  
  // Hàm helper để ghép URL đầy đủ
  getFullUrl: (path) => {
    if (!path) return ''
    if (path.startsWith('http')) return path // Đã là URL đầy đủ
    if (path.startsWith('/')) return `${API_CONFIG.BASE_URL}${path}` // URL tương đối
    return `${API_CONFIG.BASE_URL}/${path}`
  },
  
  // Placeholder image khi không có ảnh
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com/80/1a1c21/e5383b?text=No+Image',
}

