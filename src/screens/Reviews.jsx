import { useMemo, useState, useEffect } from "react";
import {
  fetchAllFeedbacks,
  updateFeedbackStatus,
  updateResponseStatus,
} from "../services/ReviewService";
import { fetchRestaurantDetail } from "../services/RestaurantService";
import { API_CONFIG } from "../config/api";
import ConfirmModal from "../components/ConfirmModal";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmResponseModal, setShowConfirmResponseModal] =
    useState(false);
  const [deletingResponseId, setDeletingResponseId] = useState(null);
  const [targetReview, setTargetReview] = useState(null);
  const [targetResponse, setTargetResponse] = useState(null);

  // Gọi API lấy danh sách feedbacks
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAllFeedbacks();

      // Map dữ liệu và lấy tên nhà hàng
      const mapped = await Promise.all(
        data.map(async (f, index) => {
          let restaurantName = "Không rõ";

          // Lấy tên nhà hàng từ restaurantId trong order
          if (f.order && f.order.restaurantId) {
            try {
              const restaurant = await fetchRestaurantDetail(
                f.order.restaurantId
              );
              restaurantName = restaurant.name || "Không rõ";
            } catch (err) {
              console.error("Error fetching restaurant:", err);
            }
          }

          return {
            id: f.id ?? `feedback-${index}`,
            rating: f.rating ?? 0,
            content: f.content ?? "",
            imageUrl: f.imageUrl,
            createdAt: f.createdAt,
            orderId: f.orderId,
            restaurantName: restaurantName,
            restaurantId: f.order?.restaurantId,
            totalPrice: f.order?.totalPrice ?? 0,
            responses: (f.responses || []).map((r) => ({
              ...r,
              isActive: r.isActive ?? true,
            })),
            isActive: f.isActive ?? true,
          };
        })
      );

      setReviews(mapped);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách bình luận. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Lọc review theo nội dung hoặc nhà hàng
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.content.toLowerCase().includes(q) ||
        r.restaurantName.toLowerCase().includes(q)
    );
  }, [reviews, query]);

  // Toggle hiển thị responses
  const toggleExpand = (id) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Mở modal xác nhận khoá/mở feedback
  const openToggleFeedbackConfirm = (review) => {
    setTargetReview(review);
    setShowConfirmModal(true);
  };

  // Khoá / mở khoá feedback
  const toggleReviewStatus = async () => {
    if (!targetReview) return;

    try {
      setLoading(true);
      setError("");

      const nextActive = !targetReview.isActive;
      await updateFeedbackStatus(targetReview.id, nextActive);

      setReviews((prev) =>
        prev.map((r) =>
          r.id === targetReview.id ? { ...r, isActive: nextActive } : r
        )
      );
      setTargetReview(null);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật trạng thái bình luận. Vui lòng thử lại.");
      alert("Có lỗi xảy ra: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal xác nhận khoá/mở response
  const openToggleResponseConfirm = (response) => {
    setTargetResponse(response);
    setShowConfirmResponseModal(true);
  };

  // Khoá / mở khoá response
  const toggleResponseHandler = async () => {
    if (!targetResponse) return;

    try {
      setLoading(true);
      setError("");

      const nextActive = !targetResponse.isActive;
      await updateResponseStatus(targetResponse.id, nextActive);

      setReviews((prev) =>
        prev.map((rev) => ({
          ...rev,
          responses: rev.responses.map((resp) =>
            resp.id === targetResponse.id
              ? { ...resp, isActive: nextActive }
              : resp
          ),
        }))
      );
      setTargetResponse(null);
      setShowConfirmResponseModal(false);
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật trạng thái phản hồi. Vui lòng thử lại.");
      alert("Có lỗi xảy ra: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Lấy URL ảnh
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return API_CONFIG.getFullUrl(imageUrl);
  };

  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#ffd43b" : "#444",
            fontSize: 16,
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            placeholder="Tìm theo nội dung/cửa hàng"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #000",
              background: "var(--color-surface)",
              color: "var(--color-text)",
            }}
          />
          <button
            className="btn ghost"
            onClick={loadReviews}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 8, color: "#fa5252", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {filtered.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--color-text-muted)",
            }}
          >
            Không có bình luận nào
          </div>
        ) : (
          filtered.map((review) => (
            <div
              key={review.id}
              className="card"
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Header: Restaurant + Rating + Date */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}
                  >
                    {review.restaurantName}
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <div>{renderStars(review.rating)}</div>
                    <span className="badge warn">{review.rating}/5</span>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {formatDate(review.createdAt)}
                </div>
              </div>

              {/* Content */}
              <div style={{ color: "var(--color-text)" }}>{review.content}</div>

              {/* Image if exists */}
              {review.imageUrl && (
                <div>
                  <img
                    src={getImageUrl(review.imageUrl)}
                    alt="Review"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    style={{
                      maxWidth: 200,
                      maxHeight: 200,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {/* Order info */}
              <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                Đơn hàng #{review.orderId} •{" "}
                {review.totalPrice.toLocaleString("vi-VN")}đ
              </div>

              {/* Responses section */}
              {review.responses.length > 0 && (
                <div>
                  <button
                    className="btn ghost"
                    onClick={() => toggleExpand(review.id)}
                    style={{ fontSize: 13 }}
                  >
                    {expandedReviews.has(review.id)
                      ? `Ẩn phản hồi (${review.responses.length})`
                      : `Xem phản hồi (${review.responses.length})`}
                  </button>

                  {expandedReviews.has(review.id) && (
                    <div
                      style={{
                        marginTop: 12,
                        paddingLeft: 16,
                        borderLeft: "3px solid var(--color-border)",
                      }}
                    >
                      {review.responses.map((resp) => (
                        <div
                          key={resp.id}
                          style={{
                            padding: 12,
                            background: "#fff7f0", // nền cam nhạt
                            borderRadius: 10,
                            marginBottom: 10,
                            border: "1px solid #ff922b", // viền cam
                            color: "#111", // chữ đen dễ đọc
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              {resp.sender?.avatar && (
                                <img
                                  src={getImageUrl(resp.sender.avatar)}
                                  alt={resp.sender.username}
                                  onError={(e) => {
                                    e.target.src = API_CONFIG.PLACEHOLDER_IMAGE;
                                  }}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <div>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: "#111",
                                  }}
                                >
                                  {resp.sender?.username || "Chủ cửa hàng"}
                                </div>
                                <div style={{ fontSize: 12, color: "#555" }}>
                                  {formatDate(resp.createdAt)}
                                </div>
                              </div>
                            </div>
                            <button
                              className={
                                resp.isActive ? "btn danger" : "btn primary"
                              }
                              onClick={() => openToggleResponseConfirm(resp)}
                              disabled={loading}
                              style={{ fontSize: 13, padding: "6px 12px" }}
                            >
                              {resp.isActive
                                ? "Khóa phản hồi"
                                : "Mở khóa phản hồi"}
                            </button>
                          </div>
                          <div style={{ fontSize: 14, color: "#111" }}>
                            {resp.response}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#ff922b",
                              marginTop: 4,
                            }}
                          >
                            Trạng thái:{" "}
                            {resp.isActive ? "Hoạt động" : "Đã khóa"}
                          </div>
                          {resp.imageUrl && (
                            <img
                              src={getImageUrl(resp.imageUrl)}
                              alt="Response"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                              style={{
                                marginTop: 8,
                                maxWidth: 150,
                                maxHeight: 150,
                                borderRadius: 8,
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  className={review.isActive ? "btn danger" : "btn primary"}
                  onClick={() => openToggleFeedbackConfirm(review)}
                  disabled={loading}
                >
                  {review.isActive ? "Khóa bình luận" : "Mở khóa bình luận"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal xác nhận khóa/mở bình luận */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setTargetReview(null);
        }}
        onConfirm={toggleReviewStatus}
        title={targetReview?.isActive ? "Khóa bình luận" : "Mở khóa bình luận"}
        message={
          targetReview?.isActive
            ? "Bạn có chắc chắn muốn khóa bình luận này?"
            : "Bạn có chắc chắn muốn mở khóa bình luận này?"
        }
        confirmText={targetReview?.isActive ? "Khóa" : "Mở khóa"}
        cancelText="Hủy"
        type="danger"
      />

      {/* Modal xác nhận khóa/mở phản hồi */}
      <ConfirmModal
        isOpen={showConfirmResponseModal}
        onClose={() => {
          setShowConfirmResponseModal(false);
          setTargetResponse(null);
        }}
        onConfirm={toggleResponseHandler}
        title={targetResponse?.isActive ? "Khóa phản hồi" : "Mở khóa phản hồi"}
        message={
          targetResponse?.isActive
            ? "Bạn có chắc chắn muốn khóa phản hồi này?"
            : "Bạn có chắc chắn muốn mở khóa phản hồi này?"
        }
        confirmText={targetResponse?.isActive ? "Khóa" : "Mở khóa"}
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
