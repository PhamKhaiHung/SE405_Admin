const API_BASE_URL = 'http://localhost:5000'

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null
 */
function getToken() {
  return localStorage.getItem('accessToken')
}

/**
 * Gọi API lấy tất cả người dùng
 * @returns {Promise<Array>} Danh sách người dùng từ backend
 */
export async function fetchAllUsers() {
  const url = `${API_BASE_URL}/users/all`
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
    console.error('fetchAllUsers error:', error)
    throw error
  }
}


/**
 * Cập nhật trạng thái hoạt động của người dùng
 * @param {string|number} userId - id người dùng (dùng trong URL /users/{id}/status)
 * @param {boolean} isActive - trạng thái mới
 */
export async function updateUserStatus(userId, isActive) {
  const url = `${API_BASE_URL}/users/${userId}/status`
  const token = getToken()

  try {
    const headers = {
      accept: '*/*',
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ isActive }),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    // Nếu backend trả về user đã cập nhật thì có thể dùng; hiện tại chỉ cần biết là thành công
    return response.status === 204 ? null : await response.json().catch(() => null)
  } catch (error) {
    console.error('updateUserStatus error:', error)
    throw error
  }
}


