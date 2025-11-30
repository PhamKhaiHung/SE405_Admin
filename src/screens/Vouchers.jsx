import { useState, useMemo } from 'react'

// Dữ liệu mẫu voucher
const initialVouchers = [
  { 
    id: 'v1', 
    name: 'Giảm 20% tất cả món ăn', 
    description: 'Áp dụng cho tất cả các món ăn trong hệ thống', 
    discount: 20, 
    discountType: 'percent', // percent hoặc fixed
    minOrder: 0,
    maxDiscount: 50000,
    quantity: 100,
    createdAt: '2024-12-01 08:00:00',
    active: true
  },
  { 
    id: 'v2', 
    name: 'Freeship', 
    description: 'Miễn phí vận chuyển cho đơn hàng từ 100.000đ', 
    discount: 0, 
    discountType: 'freeship',
    minOrder: 100000,
    maxDiscount: 0,
    quantity: 50,
    createdAt: '2024-12-01 08:00:00',
    active: true
  },
  { 
    id: 'v3', 
    name: 'Giảm 50.000đ', 
    description: 'Giảm 50.000đ cho đơn hàng từ 200.000đ', 
    discount: 50000, 
    discountType: 'fixed',
    minOrder: 200000,
    maxDiscount: 50000,
    quantity: 200,
    createdAt: '2024-12-05 10:00:00',
    active: true
  },
]

export default function Vouchers() {
  const [vouchers, setVouchers] = useState(initialVouchers)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: '',
    discountType: 'percent',
    minOrder: '',
    maxDiscount: '',
    quantity: '',
  })

  // Lọc voucher theo tên hoặc mô tả
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vouchers
    return vouchers.filter(v => 
      v.name.toLowerCase().includes(q) || 
      v.description.toLowerCase().includes(q)
    )
  }, [vouchers, query])

  // Mở modal thêm mới
  const openAddModal = () => {
    setEditingVoucher(null)
    setFormData({
      name: '',
      description: '',
      discount: '',
      discountType: 'percent',
      minOrder: '',
      maxDiscount: '',
      quantity: '',
    })
    setShowModal(true)
  }

  // Mở modal chỉnh sửa
  const openEditModal = (voucher) => {
    setEditingVoucher(voucher)
    setFormData({
      name: voucher.name,
      description: voucher.description,
      discount: voucher.discount.toString(),
      discountType: voucher.discountType,
      minOrder: voucher.minOrder.toString(),
      maxDiscount: voucher.maxDiscount.toString(),
      quantity: voucher.quantity?.toString() || '',
    })
    setShowModal(true)
  }

  // Đóng modal
  const closeModal = () => {
    setShowModal(false)
    setEditingVoucher(null)
    setFormData({
      name: '',
      description: '',
      discount: '',
      discountType: 'percent',
      minOrder: '',
      maxDiscount: '',
      quantity: '',
    })
  }

  // Lưu voucher (thêm mới hoặc cập nhật)
  const saveVoucher = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (editingVoucher) {
      // Cập nhật voucher
      setVouchers(prev => prev.map(v => 
        v.id === editingVoucher.id 
          ? {
              ...v,
              name: formData.name,
              description: formData.description,
              discount: parseFloat(formData.discount) || 0,
              discountType: formData.discountType,
              minOrder: parseFloat(formData.minOrder) || 0,
              maxDiscount: parseFloat(formData.maxDiscount) || 0,
              quantity: parseInt(formData.quantity) || 0,
            }
          : v
      ))
    } else {
      // Thêm voucher mới
      const newVoucher = {
        id: `v${Date.now()}`,
        name: formData.name,
        description: formData.description,
        discount: parseFloat(formData.discount) || 0,
        discountType: formData.discountType,
        minOrder: parseFloat(formData.minOrder) || 0,
        maxDiscount: parseFloat(formData.maxDiscount) || 0,
        quantity: parseInt(formData.quantity) || 0,
        createdAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
        active: true,
      }
      setVouchers(prev => [...prev, newVoucher])
    }
    closeModal()
  }

  // Xóa voucher
  const deleteVoucher = (id) => {
    if (!confirm('Bạn có chắc muốn xóa voucher này?')) return
    setVouchers(prev => prev.filter(v => v.id !== id))
  }

  // Định dạng ngày tháng theo dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return ''
    // Xử lý định dạng "yyyy-mm-dd hh:mm:ss" hoặc các định dạng khác
    const date = new Date(dateString.replace(/-/g, '/'))
    if (isNaN(date.getTime())) return dateString
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Định dạng hiển thị giảm giá
  const formatDiscount = (voucher) => {
    if (voucher.discountType === 'freeship') {
      return 'Freeship'
    }
    if (voucher.discountType === 'percent') {
      return `Giảm ${voucher.discount}%`
    }
    return `Giảm ${voucher.discount.toLocaleString('vi-VN')}đ`
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm theo tên hoặc mô tả voucher"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
          />
          <button className="btn ghost">Làm mới</button>
          <button className="btn primary" onClick={openAddModal}>Thêm voucher</button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Tên voucher</th>
              <th>Mô tả</th>
              <th>Giảm giá</th>
              <th>Đơn tối thiểu</th>
              <th>Số lượng</th>
              <th>Ngày tạo</th>
              <th style={{ width: 200 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                  Không có voucher nào
                </td>
              </tr>
            ) : (
              filtered.map(voucher => (
                <tr key={voucher.id}>
                  <td>{voucher.name}</td>
                  <td style={{ maxWidth: 300, wordWrap: 'break-word' }}>{voucher.description}</td>
                  <td>
                    <span className="badge success">{formatDiscount(voucher)}</span>
                  </td>
                  <td>
                    {voucher.minOrder > 0 
                      ? `${voucher.minOrder.toLocaleString('vi-VN')}đ` 
                      : 'Không có'
                    }
                  </td>
                  <td>{voucher.quantity?.toLocaleString('vi-VN') || 0}</td>
                  <td>{formatDate(voucher.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        className="btn equal" 
                        onClick={() => openEditModal(voucher)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn danger" 
                        onClick={() => deleteVoucher(voucher.id)}
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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div 
            className="card"
            style={{ 
              width: '90%', 
              maxWidth: 500, 
              padding: 24,
              background: 'var(--color-surface)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              {editingVoucher ? 'Sửa voucher' : 'Thêm voucher mới'}
            </h2>
            
            <div className="grid" style={{ gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                  Tên voucher *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Giảm 20% tất cả món ăn"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về voucher"
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                  Loại giảm giá
                </label>
                <select
                  value={formData.discountType}
                  onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (đ)</option>
                  <option value="freeship">Freeship</option>
                </select>
              </div>

              {formData.discountType !== 'freeship' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                    {formData.discountType === 'percent' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (đ)'} *
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                    placeholder={formData.discountType === 'percent' ? '20' : '50000'}
                    min="0"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                  Đơn hàng tối thiểu (đ)
                </label>
                <input
                  type="number"
                  value={formData.minOrder}
                  onChange={e => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="0"
                  min="0"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
                />
              </div>

              {formData.discountType === 'percent' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                    Giảm tối đa (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="50000"
                    min="0"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-muted)' }}>
                  Số lượng *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="100"
                  min="0"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
              <button className="btn ghost" onClick={closeModal}>Hủy</button>
              <button className="btn primary" onClick={saveVoucher}>
                {editingVoucher ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

