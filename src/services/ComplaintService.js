const API_BASE_URL = 'http://localhost:5000'

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null
 */
function getToken() {
  return localStorage.getItem('accessToken')
}

/**
 * Gọi API lấy tất cả khiếu nại/báo cáo
 * @returns {Promise<Array>} Danh sách khiếu nại từ backend
 */
export async function fetchAllComplaints() {
  const url = `${API_BASE_URL}/complaints-reports`
  const token = getToken()

  try {
    const headers = {
      accept: '*/*',
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
    console.error('fetchAllComplaints error:', error)
    throw error
  }
}

/**
 * Xóa khiếu nại/báo cáo
 * @param {number} complaintId - ID khiếu nại
 * @returns {Promise<Object>} Kết quả xóa
 */
export async function deleteComplaint(complaintId) {
  const url = `${API_BASE_URL}/complaints-reports/${complaintId}`
  const token = getToken()

  try {
    const headers = {
      accept: '*/*',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    // Một số API DELETE trả về 204 No Content, không có body
    if (response.status === 204) {
      return null
    }

    // Nếu có body, parse JSON
    return await response.json().catch(() => null)
  } catch (error) {
    console.error('deleteComplaint error:', error)
    throw error
  }
}

