import { useState, useMemo, useEffect } from 'react'
import {
  fetchAllProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  fetchCategoryProductMaps,
} from '../services/CategoryService'
import ConfirmModal from '../components/ConfirmModal'

export default function ProductCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [linkedCategoryIds, setLinkedCategoryIds] = useState(new Set())
  const [categoryProductCounts, setCategoryProductCounts] = useState({})
  const [formData, setFormData] = useState({
    name: '',
  })

  // Gọi API lấy danh sách danh mục sản phẩm
  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchAllProductCategories()

      // Map dữ liệu từ API
      const mapped = data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        isActive: cat.isActive,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      }))

      setCategories(mapped)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách danh mục. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Gọi API lấy mapping danh mục sản phẩm - món ăn
  const loadCategoryMaps = async () => {
    try {
      const data = await fetchCategoryProductMaps()

      const usedCategoryIds = new Set()
      const counts = {}

      data.forEach((item) => {
        if (!item) return

        // Bỏ qua mapping / category đã bị disable nếu backend có flag
        if (item.isActive === false) return
        if (item.category && item.category.isActive === false) return

        const categoryId = item.categoryId || item.productCategoryId
        if (!categoryId) return

        usedCategoryIds.add(categoryId)
        counts[categoryId] = (counts[categoryId] || 0) + 1
      })

      setLinkedCategoryIds(usedCategoryIds)
      setCategoryProductCounts(counts)
    } catch (err) {
      console.error(err)
      // Không show lỗi ra UI để tránh làm phiền admin
    }
  }

  useEffect(() => {
    loadCategories()
    loadCategoryMaps()
  }, [])

  // Lọc danh mục theo tên
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((cat) => cat.name.toLowerCase().includes(q))
  }, [categories, query])

  // Mở modal thêm mới
  const openAddModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
    })
    setShowModal(true)
  }

  // Mở modal chỉnh sửa
  const openEditModal = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
    })
    setShowModal(true)
  }

  // Đóng modal
  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '' })
  }

  // Lưu danh mục (thêm mới hoặc cập nhật)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên danh mục')
      return
    }

    // Kiểm tra tên danh mục đã tồn tại chưa (không phân biệt hoa thường)
    const trimmedName = formData.name.trim()
    const nameExists = categories.some(cat => {
      // Nếu đang sửa, bỏ qua chính danh mục đó
      if (editingCategory && cat.id === editingCategory.id) {
        return false
      }
      // So sánh không phân biệt hoa thường
      return cat.name.toLowerCase() === trimmedName.toLowerCase()
    })

    if (nameExists) {
      setErrorMessage(`Tên loại đồ ăn "${trimmedName}" đã tồn tại. Vui lòng chọn tên khác.`)
      setShowErrorModal(true)
      return
    }

    try {
      setLoading(true)
      setError('')

      if (editingCategory) {
        // Cập nhật
        await updateProductCategory(editingCategory.id, {
          name: trimmedName,
        })
      } else {
        // Tạo mới
        await createProductCategory({
          name: trimmedName,
        })
      }

      closeModal()
      await loadCategories()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Không thể lưu danh mục. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Xác nhận xóa
  const confirmDelete = (category) => {
    // Nếu danh mục đang được sử dụng bởi món ăn thì không cho xóa
    if (linkedCategoryIds.has(category.id)) {
      setErrorMessage(
        `Loại đồ ăn "${category.name}" đang được sử dụng bởi ít nhất một món ăn nên không thể xóa.`,
      )
      setShowErrorModal(true)
      return
    }

    setDeletingId(category.id)
    setShowConfirmModal(true)
  }

  // Xóa danh mục
  const handleDelete = async () => {
    if (!deletingId) return

    try {
      setLoading(true)
      setError('')
      await deleteProductCategory(deletingId)
      setShowConfirmModal(false)
      setDeletingId(null)
      await loadCategories()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Không thể xóa danh mục. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      {error && (
        <div
          className="card"
          style={{
            padding: 12,
            background: 'rgba(250, 82, 82, 0.1)',
            border: '1px solid rgba(250, 82, 82, 0.3)',
          }}
        >
          <div style={{ color: '#fa5252', fontSize: 14 }}>{error}</div>
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div className="section-title">Loại đồ ăn</div>
          <button className="btn primary" onClick={openAddModal} disabled={loading}>
            + Thêm loại
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '2px solid #e0e0e0',
              fontSize: 14,
            }}
          />
        </div>

        {loading && categories.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
              color: 'var(--color-text-muted)',
            }}
          >
            Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
              color: 'var(--color-text-muted)',
            }}
          >
            {query ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Số thứ tự</th>
                  <th>Tên loại</th>
                  <th>Số món ăn</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, index) => (
                  <tr key={cat.id}>
                    <td>{index + 1}</td>
                    <td>{cat.name}</td>
                    <td>{categoryProductCounts[cat.id] || 0}</td>
                    <td>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          background: cat.isActive
                            ? 'rgba(40, 167, 69, 0.1)'
                            : 'rgba(108, 117, 125, 0.1)',
                          color: cat.isActive ? '#28a745' : '#6c757d',
                        }}
                      >
                        {cat.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td>
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn ghost"
                          onClick={() => openEditModal(cat)}
                          disabled={loading}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn ghost"
                          onClick={() => confirmDelete(cat)}
                          disabled={loading || !cat.isActive}
                          style={{
                            opacity: cat.isActive ? 1 : 0.5,
                            cursor: cat.isActive ? 'pointer' : 'not-allowed',
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
          onClick={closeModal}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 500,
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-title" style={{ marginBottom: 16 }}>
              {editingCategory ? 'Chỉnh sửa loại đồ ăn' : 'Thêm loại đồ ăn mới'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Tên loại *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên loại đồ ăn"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '2px solid #e0e0e0',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn ghost" onClick={closeModal} disabled={loading}>
                  Hủy
                </button>
                <button
                  className="btn primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setDeletingId(null)
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa loại đồ ăn này không?"
        confirmText="Xóa"
        type="danger"
      />

      {/* Modal thông báo lỗi */}
      {showErrorModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
          onClick={() => {
            setShowErrorModal(false)
            setErrorMessage('')
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 420,
              padding: 24,
              background: 'var(--color-surface)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255, 212, 59, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffd43b" strokeWidth="2">
                <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20, fontWeight: 600 }}>
              Tên loại đồ ăn đã tồn tại
            </h2>
            <p style={{ marginTop: 0, marginBottom: 24, color: 'var(--color-text-muted)', fontSize: 14, lineHeight: '1.6' }}>
              {errorMessage}
            </p>
            <button
              className="btn primary"
              onClick={() => {
                setShowErrorModal(false)
                setErrorMessage('')
              }}
              style={{ minWidth: 100 }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

