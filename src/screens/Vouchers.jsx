import { useState, useMemo, useEffect } from "react";
import {
  fetchAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../services/DiscountService";
import ConfirmModal from "../components/ConfirmModal";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: "",
    discountType: "percent",
    minOrder: "",
    quantity: "",
    startTime: "",
    endTime: "",
    status: "ACTIVE",
  });

  const sanitizeNumber = (val, allowDecimal = false) => {
    if (val === "") return "";
    return allowDecimal ? val.replace(/[^0-9.]/g, "") : val.replace(/\\D/g, "");
  };

  // Định dạng datetime cho input type="datetime-local"
  const formatDateTimeInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Gọi API lấy danh sách voucher/discount
  const loadVouchers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAllDiscounts();

      // Map dữ liệu từ API về format dùng trong UI
      const mapped = data.map((d, index) => {
        const discountType =
          d.type === 3 ? "freeship" : d.percent ? "percent" : "fixed";

        // Giá trị hiển thị giảm giá (không bắt buộc với freeship)
        const displayDiscount =
          discountType === "freeship"
            ? "Miễn phí ship"
            : d.percent ?? Number(d.discountmoney ?? 0);

        return {
          id: d.id ?? `discount-${index}`,
          name: d.code ?? "Không rõ tên",
          description: d.description ?? "",
          discount: displayDiscount,
          discountType,
          minOrder: d.minOrderValue ?? 0,
          quantity: d.quantity ?? 0,
          createdAt: d.createdAt,
          active: d.isActive ?? true,
          startTime: d.startTime,
          endTime: d.endTime,
          status: d.status ?? "ACTIVE",
        };
      });

      setVouchers(mapped);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách voucher. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  // Lọc voucher theo tên hoặc mô tả
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vouchers;
    return vouchers.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    );
  }, [vouchers, query]);

  // Mở modal thêm mới
  const openAddModal = () => {
    setEditingVoucher(null);
    setFormData({
      name: "",
      description: "",
      discount: "",
      discountType: "percent",
      minOrder: "",
      quantity: "",
      startTime: "",
      endTime: "",
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      name: voucher.name,
      description: voucher.description,
      discount:
        voucher.discountType === "freeship"
          ? ""
          : (voucher.discount ?? "").toString(),
      discountType: voucher.discountType,
      minOrder: voucher.minOrder.toString(),
      quantity: voucher.quantity?.toString() || "",
      startTime: formatDateTimeInput(voucher.startTime),
      endTime: formatDateTimeInput(voucher.endTime),
      status: voucher.status || "ACTIVE",
    });
    setShowModal(true);
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setEditingVoucher(null);
    setFormData({
      name: "",
      description: "",
      discount: "",
      discountType: "percent",
      minOrder: "",
      quantity: "",
      startTime: "",
      endTime: "",
      status: "ACTIVE",
    });
  };

  // Lưu voucher (thêm mới hoặc cập nhật)
  const saveVoucher = async () => {
    // Validate chung
    if (!formData.name.trim() || !formData.description.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin.");
      setShowErrorModal(true);
      return;
    }

    const quantityNum = Number(formData.quantity);
    if (!Number.isFinite(quantityNum) || quantityNum <= 0) {
      setErrorMessage("Vui lòng nhập số lượng hợp lệ (> 0 và không âm).");
      setShowErrorModal(true);
      return;
    }

    const minOrderNum = Number(formData.minOrder || 0);
    if (!Number.isFinite(minOrderNum) || minOrderNum < 0) {
      setErrorMessage(
        "Vui lòng nhập đơn hàng tối thiểu hợp lệ (>= 0 và không âm)."
      );
      setShowErrorModal(true);
      return;
    }

    let type = 1;
    let percent = null;
    let discountmoney = null;

    if (formData.discountType === "percent") {
      type = 1;
      const percentNum = Number(formData.discount);
      if (!Number.isFinite(percentNum) || percentNum <= 0 || percentNum > 100) {
        setErrorMessage("Vui lòng nhập % giảm hợp lệ .");
        setShowErrorModal(true);
        return;
      }
      percent = percentNum;
      discountmoney = null;
    } else if (formData.discountType === "fixed") {
      type = 2;
      const fixedNum = Number(formData.discount);
      if (!Number.isFinite(fixedNum) || fixedNum <= 0) {
        setErrorMessage("Vui lòng nhập số tiền giảm hợp lệ .");
        setShowErrorModal(true);
        return;
      }
      // Không cho phép số tiền giảm lớn hơn giá trị đơn hàng tối thiểu (nếu có đặt)
      if (minOrderNum > 0 && fixedNum > minOrderNum) {
        setErrorMessage(
          "Số tiền giảm không được lớn hơn giá trị đơn hàng tối thiểu."
        );
        setShowErrorModal(true);
        return;
      }
      discountmoney = fixedNum;
      percent = null;
    } else if (formData.discountType === "freeship") {
      type = 3;
      percent = null;
      discountmoney = null;
    }

    // Xử lý thời gian hiệu lực
    const startTimeIso = formData.startTime
      ? new Date(formData.startTime).toISOString()
      : new Date().toISOString();
    const endTimeIso = formData.endTime
      ? new Date(formData.endTime).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // mặc định +1 năm

    if (new Date(endTimeIso).getTime() <= new Date(startTimeIso).getTime()) {
      setErrorMessage("Thời gian kết thúc phải sau thời gian bắt đầu.");
      setShowErrorModal(true);
      return;
    }

    const status = formData.status || "ACTIVE";

    try {
      setLoading(true);
      setError("");

      const apiData = {
        code: formData.name,
        type,
        description: formData.description,
        percent,
        discountmoney,
        minOrderValue: minOrderNum,
        quantity: quantityNum,
        startTime: startTimeIso,
        endTime: endTimeIso,
        status,
      };

      if (editingVoucher) {
        // Cập nhật voucher qua API
        await updateDiscount(editingVoucher.id, apiData);
      } else {
        // Thêm voucher mới qua API
        await createDiscount(apiData);
      }

      // Tải lại danh sách sau khi thành công
      await loadVouchers();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Không thể lưu voucher. Vui lòng thử lại.");
      setErrorMessage(
        err.message || "Không thể lưu voucher. Vui lòng thử lại."
      );
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteConfirm = (id) => {
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  // Xóa voucher (set isActive = false qua API)
  const deleteVoucherHandler = async () => {
    if (!deletingId) return;

    try {
      setLoading(true);
      setError("");

      await deleteDiscount(deletingId);

      // Tải lại danh sách sau khi xóa
      await loadVouchers();
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      setError("Không thể xóa voucher. Vui lòng thử lại.");
      setErrorMessage(
        err.message || "Không thể xóa voucher. Vui lòng thử lại."
      );
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Định dạng ngày tháng theo dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Nếu backend đã trả về đúng format dd/mm/yyyy thì giữ nguyên
    if (dateString.includes("/")) return dateString;

    // Xử lý định dạng ISO (yyyy-mm-ddThh:mm:ss.sssZ) hoặc "yyyy-mm-dd"
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Định dạng hiển thị giảm giá
  const formatDiscount = (voucher) => {
    if (voucher.discountType === "freeship") {
      return "Freeship";
    }
    if (voucher.discountType === "percent") {
      return `Giảm ${voucher.discount}%`;
    }
    return `Giảm ${Number(voucher.discount || 0).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}đ`;
  };

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            placeholder="Tìm theo tên hoặc mô tả voucher"
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
            onClick={loadVouchers}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
          <button className="btn primary" onClick={openAddModal}>
            Thêm voucher
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 8, color: "#fa5252", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Tên voucher</th>
              <th>Mô tả</th>
              <th>Giảm giá</th>
              <th>Đơn tối thiểu</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th style={{ width: 220 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Không có voucher nào
                </td>
              </tr>
            ) : (
              filtered.map((voucher) => (
                <tr key={voucher.id}>
                  <td>{voucher.name}</td>
                  <td style={{ maxWidth: 300, wordWrap: "break-word" }}>
                    {voucher.description}
                  </td>
                  <td>
                    <span className="badge success">
                      {formatDiscount(voucher)}
                    </span>
                  </td>
                  <td>
                    {voucher.minOrder > 0
                      ? `${Number(voucher.minOrder || 0).toLocaleString(
                          "vi-VN",
                          { minimumFractionDigits: 0, maximumFractionDigits: 0 }
                        )}đ`
                      : "Không có"}
                  </td>
                  <td>
                    {Number(voucher.quantity || 0).toLocaleString("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        voucher.status === "ACTIVE" ? "success" : "danger"
                      }`}
                    >
                      {voucher.status === "ACTIVE" ? "Hợp lệ" : "Không hợp lệ"}
                    </span>
                  </td>
                  <td>{formatDate(voucher.createdAt)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn equal"
                        onClick={() => openEditModal(voucher)}
                        disabled={loading}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => openDeleteConfirm(voucher.id)}
                        disabled={loading}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa voucher */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={closeModal}
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: 500,
              maxHeight: "90vh",
              padding: 24,
              background: "var(--color-surface)",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              {editingVoucher ? "Sửa voucher" : "Thêm voucher mới"}
            </h2>

            <div className="grid" style={{ gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Tên voucher *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Giảm 20% tất cả món ăn"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về voucher"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Loại giảm giá
                </label>
                <select
                  value={formData.discountType}
                  disabled={!!editingVoucher}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    cursor: editingVoucher ? "not-allowed" : "pointer",
                    opacity: editingVoucher ? 0.7 : 1,
                  }}
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (đ)</option>
                  <option value="freeship">Freeship</option>
                </select>
              </div>

              {formData.discountType !== "freeship" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {formData.discountType === "percent"
                      ? "Phần trăm giảm (%)"
                      : "Số tiền giảm (đ)"}{" "}
                    *
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: sanitizeNumber(e.target.value, true),
                      })
                    }
                    placeholder={
                      formData.discountType === "percent" ? "20" : "50000"
                    }
                    min="0"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #000",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Hiệu lực từ *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Hiệu lực đến *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid " + "#000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="ACTIVE">Hợp lệ</option>
                  <option value="NOTACTIVE">Không hợp lệ</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Đơn hàng tối thiểu (đ)
                </label>
                <input
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrder: sanitizeNumber(e.target.value),
                    })
                  }
                  placeholder="0"
                  min="0"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Số lượng *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: sanitizeNumber(e.target.value),
                    })
                  }
                  placeholder="100"
                  min="0"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #000",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn ghost"
                onClick={closeModal}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                className="btn primary"
                onClick={saveVoucher}
                disabled={loading}
              >
                {loading
                  ? "Đang lưu..."
                  : editingVoucher
                  ? "Cập nhật"
                  : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDeletingId(null);
        }}
        onConfirm={deleteVoucherHandler}
        title="Xóa voucher"
        message="Bạn có chắc chắn muốn xóa voucher này? Voucher sẽ bị vô hiệu hóa và không thể sử dụng nữa."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Modal thông báo lỗi */}
      {showErrorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20,
          }}
          onClick={() => {
            setShowErrorModal(false);
            setErrorMessage("");
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 24,
              background: "var(--color-surface)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255, 212, 59, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffd43b"
                strokeWidth="2"
              >
                <path
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Thông báo lỗi
            </h2>
            <p
              style={{
                marginTop: 0,
                marginBottom: 24,
                color: "var(--color-text-muted)",
                fontSize: 14,
                lineHeight: "1.6",
              }}
            >
              {errorMessage}
            </p>
            <button
              className="btn primary"
              onClick={() => {
                setShowErrorModal(false);
                setErrorMessage("");
              }}
              style={{
                minWidth: 100,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
