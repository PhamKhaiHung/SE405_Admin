const API_BASE_URL = 'http://localhost:5000'

/**
 * Lấy tổng số người dùng và nhà hàng
 * @returns {Promise<Object>} { totalUsers, totalRestaurants }
 */
export async function fetchSummary() {
  const url = `${API_BASE_URL}/statistics/summary`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
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

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
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
    console.error('fetchMonthlyStatistics error:', error)
    throw error
  }
}

