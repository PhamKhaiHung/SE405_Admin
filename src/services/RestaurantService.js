const API_BASE_URL = 'http://localhost:5000'

/**
 * Gọi API lấy tất cả nhà hàng
 * @returns {Promise<Array>} Danh sách nhà hàng từ backend
 */
export async function fetchAllRestaurants() {
  const url = `${API_BASE_URL}/restaurants/all`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Đảm bảo luôn trả về mảng
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array')
    }

    return data
  } catch (error) {
    console.error('fetchAllRestaurants error:', error)
    throw error
  }
}

/**
 * Cập nhật trạng thái hoạt động của nhà hàng
 * @param {string|number} restaurantId - id nhà hàng (dùng trong URL /restaurants/{id}/status)
 * @param {boolean} isActive - trạng thái mới
 */
export async function updateRestaurantStatus(restaurantId, isActive) {
  const url = `${API_BASE_URL}/restaurants/${restaurantId}/status`

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    // Nếu backend trả về restaurant đã cập nhật thì có thể dùng; hiện tại chỉ cần biết là thành công
    return response.status === 204 ? null : await response.json().catch(() => null)
  } catch (error) {
    console.error('updateRestaurantStatus error:', error)
    throw error
  }
}

