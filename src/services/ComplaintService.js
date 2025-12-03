const API_BASE_URL = 'http://localhost:5000'

/**
 * Gọi API lấy tất cả khiếu nại/báo cáo
 * @returns {Promise<Array>} Danh sách khiếu nại từ backend
 */
export async function fetchAllComplaints() {
  const url = `${API_BASE_URL}/complaints-reports`

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
    console.error('fetchAllComplaints error:', error)
    throw error
  }
}

