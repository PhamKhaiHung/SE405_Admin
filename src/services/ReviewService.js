const API_BASE_URL = "http://localhost:5000";

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null
 */
function getToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Gọi API lấy tất cả đánh giá/bình luận (feedbacks)
 * @returns {Promise<Array>} Danh sách feedback từ backend
 */
export async function fetchAllFeedbacks() {
  const url = `${API_BASE_URL}/feedbacks`;
  const token = getToken();

  try {
    const headers = {
      accept: "*/*",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Đảm bảo luôn trả về mảng
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected an array");
    }

    return data;
  } catch (error) {
    console.error("fetchAllFeedbacks error:", error);
    throw error;
  }
}

/**
 * Xóa feedback (set isActive = false)
 * @param {number} feedbackId - ID feedback
 * @returns {Promise<Object>} Kết quả xóa
 */
export async function deleteFeedback(feedbackId) {
  const url = `${API_BASE_URL}/feedbacks/${feedbackId}`;
  const token = getToken();

  try {
    const headers = {
      accept: "*/*",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json().catch(() => null);
  } catch (error) {
    console.error("deleteFeedback error:", error);
    throw error;
  }
}

/**
 * Cập nhật trạng thái isActive của feedback (khoá/mở)
 * @param {number} feedbackId
 * @param {boolean} isActive
 */
export async function updateFeedbackStatus(feedbackId, isActive) {
  const url = `${API_BASE_URL}/feedbacks/${feedbackId}`;
  const token = getToken();

  try {
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json().catch(() => null);
  } catch (error) {
    console.error("updateFeedbackStatus error:", error);
    throw error;
  }
}

/**
 * Xóa phản hồi (response) của feedback (soft delete isActive=false trên backend)
 * @param {number} responseId - ID của response cần xóa
 * @returns {Promise<Object>} Kết quả xóa
 */
export async function deleteResponse(responseId) {
  const url = `${API_BASE_URL}/responses/${responseId}`;
  const token = getToken();

  try {
    const headers = {
      accept: "*/*",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json().catch(() => null);
  } catch (error) {
    console.error("deleteResponse error:", error);
    throw error;
  }
}

/**
 * Cập nhật trạng thái isActive của response (khoá/mở)
 * @param {number} responseId
 * @param {boolean} isActive
 */
export async function updateResponseStatus(responseId, isActive) {
  const url = `${API_BASE_URL}/responses/${responseId}`;
  const token = getToken();

  try {
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json().catch(() => null);
  } catch (error) {
    console.error("updateResponseStatus error:", error);
    throw error;
  }
}
