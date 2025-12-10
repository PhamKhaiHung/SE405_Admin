const API_BASE_URL = 'http://localhost:5000'

/**
 * Gọi API lấy tất cả discount/voucher
 * @returns {Promise<Array>} Danh sách discount từ backend
 */
export async function fetchAllDiscounts() {
  const url = `${API_BASE_URL}/discounts`

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
    console.error('fetchAllDiscounts error:', error)
    throw error
  }
}

/**
 * Tạo voucher/discount mới
 * @param {Object} discountData - Dữ liệu voucher
 * @returns {Promise<Object>} Voucher đã tạo
 */
export async function createDiscount(discountData) {
  const url = `${API_BASE_URL}/discounts`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('createDiscount error:', error)
    throw error
  }
}

/**
 * Cập nhật thông tin voucher/discount
 * @param {number} discountId - ID voucher
 * @param {Object} discountData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Voucher đã cập nhật
 */
export async function updateDiscount(discountId, discountData) {
  const url = `${API_BASE_URL}/discounts/${discountId}`

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('updateDiscount error:', error)
    throw error
  }
}

/**
 * Xóa voucher (thực chất là set isActive = false)
 * @param {number} discountId - ID voucher
 * @returns {Promise<Object>} Voucher đã xóa
 */
export async function deleteDiscount(discountId) {
  const url = `${API_BASE_URL}/discounts/${discountId}`

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: false }),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('deleteDiscount error:', error)
    throw error
  }
}

