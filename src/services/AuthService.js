const API_BASE_URL = 'http://localhost:5000'

/**
 * Đăng nhập
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} { accessToken, user }
 */
export async function login(email, password) {
  const url = `${API_BASE_URL}/auth/login`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('login error:', error)
    throw error
  }
}

