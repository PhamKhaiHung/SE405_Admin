const API_BASE_URL = 'http://localhost:5000'

/**
 * Gọi API lấy tất cả đánh giá/bình luận (feedbacks)
 * @returns {Promise<Array>} Danh sách feedback từ backend
 */
export async function fetchAllFeedbacks() {
  const url = `${API_BASE_URL}/feedbacks`

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
    console.error('fetchAllFeedbacks error:', error)
    throw error
  }
}

/**
 * Xóa feedback (set isActive = false)
 * @param {number} feedbackId - ID feedback
 * @returns {Promise<Object>} Kết quả xóa
 */
export async function deleteFeedback(feedbackId) {
  const url = `${API_BASE_URL}/feedbacks/${feedbackId}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    if (response.status === 204) {
      return null
    }

    return await response.json().catch(() => null)
  } catch (error) {
    console.error('deleteFeedback error:', error)
    throw error
  }
}

/**
 * Xóa phản hồi (response) của feedback
 * @param {number} responseId - ID của response cần xóa
 * @returns {Promise<Object>} Kết quả xóa
 */
export async function deleteResponse(responseId) {
  const url = `${API_BASE_URL}/feedbacks/${responseId}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    if (response.status === 204) {
      return null
    }

    return await response.json().catch(() => null)
  } catch (error) {
    console.error('deleteResponse error:', error)
    throw error
  }
}

