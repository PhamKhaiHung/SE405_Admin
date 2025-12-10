import { useMemo, useState, useEffect } from 'react'
import { fetchAllComplaints, deleteComplaint as deleteComplaintAPI } from '../services/ComplaintService'
import ConfirmModal from '../components/ConfirmModal'

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Gọi API lấy danh sách khiếu nại
  const loadComplaints = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchAllComplaints()

      // Map dữ liệu từ API về format dùng trong UI
      const mapped = data.map((c, index) => ({
        id: c.id ?? `complaint-${index}`,
        senderName: c.user?.username ?? 'Không rõ',
        phone: c.user?.email ?? '', // API không có phone, dùng email thay thế
        content: c.content ?? '',
        createdAt: c.createdAt,
      }))

      setComplaints(mapped)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách khiếu nại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  // Lọc khiếu nại theo tên, số điện thoại/email hoặc nội dung
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return complaints
    return complaints.filter(c => 
      c.senderName.toLowerCase().includes(q) || 
      c.phone.toLowerCase().includes(q) || 
      c.content.toLowerCase().includes(q)
    )
  }, [complaints, query])

  // Mở modal xác nhận xóa
  const openDeleteConfirm = (id) => {
    setDeletingId(id)
    setShowConfirmModal(true)
  }

  // Xóa khiếu nại thông qua API
  const deleteComplaint = async () => {
    if (!deletingId) return

    try {
      setLoading(true)
      setError('')

      await deleteComplaintAPI(deletingId)

      // Tải lại danh sách sau khi xóa thành công
      await loadComplaints()
      setDeletingId(null)
    } catch (err) {
      console.error(err)
      setError('Không thể xóa khiếu nại. Vui lòng thử lại.')
      alert('Có lỗi xảy ra: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Định dạng ngày tháng theo dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    // Nếu backend đã trả về đúng format dd/mm/yyyy thì giữ nguyên
    if (dateString.includes('/')) return dateString
    
    // Xử lý định dạng ISO (yyyy-mm-ddThh:mm:ss.sssZ) hoặc "yyyy-mm-dd"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm theo tên người gửi/email/nội dung"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
          />
          <button className="btn ghost" onClick={loadComplaints} disabled={loading}>
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 8, color: '#fa5252', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>STT</th>
              <th>Tên người gửi</th>
              <th>Email</th>
              <th>Nội dung khiếu nại</th>
              <th>Ngày gửi</th>
              <th style={{ width: 120 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                  Không có khiếu nại nào
                </td>
              </tr>
            ) : (
              filtered.map((complaint, index) => (
                <tr key={complaint.id}>
                  <td>{index + 1}</td>
                  <td>{complaint.senderName}</td>
                  <td>{complaint.phone}</td>
                  <td style={{ maxWidth: 400, wordWrap: 'break-word' }}>{complaint.content}</td>
                  <td>{formatDate(complaint.createdAt)}</td>
                  <td>
                    <button 
                      className="btn danger" 
                      onClick={() => openDeleteConfirm(complaint.id)}
                      disabled={loading}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setDeletingId(null)
        }}
        onConfirm={deleteComplaint}
        title="Xóa khiếu nại"
        message="Bạn có chắc chắn muốn xóa khiếu nại này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  )
}

