const API_BASE_URL = 'http://localhost:5000'

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null
 */
function getToken() {
  return localStorage.getItem('accessToken')
}

/**
 * Lấy tất cả danh mục nhà hàng
 * @returns {Promise<Array>} Danh sách danh mục nhà hàng
 */
export async function fetchAllRestaurantCategories() {
  const url = `${API_BASE_URL}/restaurant-categories`
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
    console.error('fetchAllRestaurantCategories error:', error)
    throw error
  }
}

/**
 * Tạo danh mục nhà hàng mới
 * @param {Object} categoryData - Dữ liệu danh mục { name }
 * @returns {Promise<Object>} Danh mục đã tạo
 */
export async function createRestaurantCategory(categoryData) {
  const url = `${API_BASE_URL}/restaurant-categories`
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
      method: 'POST',
      headers,
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('createRestaurantCategory error:', error)
    throw error
  }
}

/**
 * Cập nhật danh mục nhà hàng
 * @param {number} categoryId - ID danh mục
 * @param {Object} categoryData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Danh mục đã cập nhật
 */
export async function updateRestaurantCategory(categoryId, categoryData) {
  const url = `${API_BASE_URL}/restaurant-categories/${categoryId}`
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
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('updateRestaurantCategory error:', error)
    throw error
  }
}

/**
 * Xóa danh mục nhà hàng
 * @param {number} categoryId - ID danh mục
 * @returns {Promise<Object|null>} Kết quả xóa
 */
export async function deleteRestaurantCategory(categoryId) {
  const url = `${API_BASE_URL}/restaurant-categories/${categoryId}`
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
    console.error('deleteRestaurantCategory error:', error)
    throw error
  }
}

/**
 * Lấy tất cả danh mục sản phẩm (loại đồ ăn)
 * @returns {Promise<Array>} Danh sách danh mục sản phẩm
 */
export async function fetchAllProductCategories() {
  const url = `${API_BASE_URL}/product-categories`
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
    console.error('fetchAllProductCategories error:', error)
    throw error
  }
}

/**
 * Tạo danh mục sản phẩm mới
 * @param {Object} categoryData - Dữ liệu danh mục { name }
 * @returns {Promise<Object>} Danh mục đã tạo
 */
export async function createProductCategory(categoryData) {
  const url = `${API_BASE_URL}/product-categories`
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
      method: 'POST',
      headers,
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('createProductCategory error:', error)
    throw error
  }
}

/**
 * Cập nhật danh mục sản phẩm
 * @param {number} categoryId - ID danh mục
 * @param {Object} categoryData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Danh mục đã cập nhật
 */
export async function updateProductCategory(categoryId, categoryData) {
  const url = `${API_BASE_URL}/product-categories/${categoryId}`
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
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('updateProductCategory error:', error)
    throw error
  }
}

/**
 * Xóa danh mục sản phẩm
 * @param {number} categoryId - ID danh mục
 * @returns {Promise<Object|null>} Kết quả xóa
 */
export async function deleteProductCategory(categoryId) {
  const url = `${API_BASE_URL}/product-categories/${categoryId}`
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
    console.error('deleteProductCategory error:', error)
    throw error
  }
}

/**
 * Lấy mapping giữa danh mục nhà hàng và nhà hàng
 * @returns {Promise<Array>} Danh sách mapping category-restaurant
 */
export async function fetchCategoryRestaurantMaps() {
  const url = `${API_BASE_URL}/category-restaurant-maps`
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

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array')
    }

    return data
  } catch (error) {
    console.error('fetchCategoryRestaurantMaps error:', error)
    throw error
  }
}

/**
 * Lấy mapping giữa danh mục sản phẩm (loại đồ ăn) và món ăn
 * @returns {Promise<Array>} Danh sách mapping category-product
 */
export async function fetchCategoryProductMaps() {
  const url = `${API_BASE_URL}/category-product-maps`
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

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array')
    }

    return data
  } catch (error) {
    console.error('fetchCategoryProductMaps error:', error)
    throw error
  }
}

