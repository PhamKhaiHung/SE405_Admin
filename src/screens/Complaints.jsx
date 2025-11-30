import { useMemo, useState } from 'react'

// Dữ liệu mẫu khiếu nại
const initialComplaints = [
  { 
    id: 'c1', 
    senderName: 'Nguyễn Văn A', 
    phone: '0901234567', 
    content: 'Đơn hàng bị giao sai, thiếu món ăn. Yêu cầu hoàn tiền hoặc giao lại đúng đơn.', 
    createdAt: '2024-12-15 10:30:00' 
  },
  { 
    id: 'c2', 
    senderName: 'Trần Thị B', 
    phone: '0912345678', 
    content: 'Thức ăn không đảm bảo chất lượng, có mùi lạ. Cần kiểm tra lại nhà hàng.', 
    createdAt: '2024-12-14 15:20:00' 
  },
  { 
    id: 'c3', 
    senderName: 'Lê Văn C', 
    phone: '0933334444', 
    content: 'Shipper giao hàng quá chậm, đơn hàng đến lúc thức ăn đã nguội. Phản ánh về dịch vụ giao hàng.', 
    createdAt: '2024-12-13 09:15:00' 
  },
  { 
    id: 'c4', 
    senderName: 'Phạm Thị D', 
    phone: '0944445555', 
    content: 'Ứng dụng bị lỗi khi thanh toán, đã trừ tiền nhưng không tạo được đơn hàng. Cần xử lý gấp.', 
    createdAt: '2024-12-12 14:45:00' 
  },
]

export default function Complaints() {
  const [complaints, setComplaints] = useState(initialComplaints)
  const [query, setQuery] = useState('')

  // Lọc khiếu nại theo tên, số điện thoại hoặc nội dung
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return complaints
    return complaints.filter(c => 
      c.senderName.toLowerCase().includes(q) || 
      c.phone.includes(q) || 
      c.content.toLowerCase().includes(q)
    )
  }, [complaints, query])

  // Xóa khiếu nại
  const deleteComplaint = (id) => {
    if (!confirm('Bạn có chắc muốn xóa khiếu nại này?')) return
    setComplaints(prev => prev.filter(c => c.id !== id))
  }

  // Định dạng ngày tháng theo dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return ''
    // Xử lý định dạng "yyyy-mm-dd hh:mm:ss" hoặc "yyyy-mm-dd"
    const date = new Date(dateString.replace(/-/g, '/'))
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
            placeholder="Tìm theo tên người gửi/số điện thoại/nội dung"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
          />
          <button className="btn ghost">Làm mới</button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>STT</th>
              <th>Tên người gửi</th>
              <th>Số điện thoại</th>
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
                      onClick={() => deleteComplaint(complaint.id)}
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
    </div>
  )
}

