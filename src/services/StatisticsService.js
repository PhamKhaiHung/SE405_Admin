const API_BASE_URL = 'http://localhost:5000'

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null
 */
function getToken() {
  return localStorage.getItem('accessToken')
}

/**
 * Lấy tổng số người dùng và nhà hàng
 * @returns {Promise<Object>} { totalUsers, totalRestaurants }
 */
export async function fetchSummary() {
  const url = `${API_BASE_URL}/statistics/summary`
  const token = getToken()

  try {
    const headers = {
      accept: 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('fetchSummary error:', error)
    throw error
  }
}

/**
 * Lấy thống kê số người dùng và nhà hàng theo tháng trong năm
 * @param {number} year - Năm cần lấy thống kê (ví dụ: 2025)
 * @returns {Promise<Array>} Mảng các object { month, users, restaurants }
 */
export async function fetchMonthlyStatistics(year) {
  const url = `${API_BASE_URL}/statistics/monthly?year=${year}`
  const token = getToken()

  try {
    const headers = {
      accept: 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
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
    console.error('fetchMonthlyStatistics error:', error)
    throw error
  }
}

/**
 * Lấy doanh thu của một nhà hàng theo tháng trong năm
 * @param {number} restaurantId - ID nhà hàng
 * @param {number} year - Năm cần lấy thống kê (ví dụ: 2025)
 * @returns {Promise<Array>} Mảng các object { month, revenue }
 */
export async function fetchRestaurantRevenue(restaurantId, year) {
  const url = `${API_BASE_URL}/revenue-reports/restaurant/${restaurantId}/monthly/${year}`
  const token = getToken()

  try {
    const headers = {
      accept: 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
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
    console.error('fetchRestaurantRevenue error:', error)
    throw error
  }
}

