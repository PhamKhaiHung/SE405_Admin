import { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchRestaurantDetail } from '../services/RestaurantService'
import { API_CONFIG } from '../config/api'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Gọi API lấy chi tiết nhà hàng
  useEffect(() => {
    const loadRestaurantDetail = async () => {
      try {
        setLoading(true)
        setError('')
        
        const data = await fetchRestaurantDetail(id)
        setRestaurant(data)
      } catch (err) {
        console.error(err)
        setError('Không tải được thông tin nhà hàng. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    loadRestaurantDetail()
  }, [id])

  // Format địa chỉ
  const formatAddress = (addressObj) => {
    if (!addressObj) return ''
    if (typeof addressObj === 'string') return addressObj

    const parts = [
      addressObj.street === "Chưa xác định" ? "" : addressObj.street,
      addressObj.ward === "Chưa xác định" ? "" : addressObj.ward,
      addressObj.district === "Chưa xác định" ? "" : addressObj.district,
      addressObj.province === "Chưa xác định" ? "" : addressObj.province,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(', ') : (addressObj.label || '')
  }

  // Transform data để phù hợp với UI hiện tại
  const data = useMemo(() => {
    if (!restaurant) return null

    return {
      id: restaurant.id,
      name: restaurant.name,
      address: formatAddress(restaurant.address),
      avatar: API_CONFIG.getFullUrl(restaurant.imageUrl),
      active: restaurant.isActive,
      ratingAvg: restaurant.rating || 0,
      description: '', // API không có description
      phone: restaurant.phone,
      openHours: [
        { day: 'Giờ mở cửa', time: `${restaurant.openTime || ''} - ${restaurant.closeTime || ''}` }
      ],
      menu: (restaurant.products || []).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: API_CONFIG.getFullUrl(p.imageUrl),
        available: p.available,
      })),
      categories: (restaurant.categories || []).map(c => c.name).join(', '),
      owner: restaurant.user ? {
        name: restaurant.user.username,
        email: restaurant.user.email,
        phone: restaurant.user.phone,
        avatar: API_CONFIG.getFullUrl(restaurant.user.avatar),
      } : null,
      likes: 0, // API không có
      saves: 0, // API không có
      comments: [], // API không có
      monthlyOrders: {}, // API không có
      monthlyRevenue: {}, // API không có
    }
  }, [restaurant])

  if (loading) return <div style={{ padding: 24 }}>Đang tải...</div>
  if (error) return <div style={{ padding: 24, color: '#fa5252' }}>{error}</div>
  if (!data) return <div style={{ padding: 24 }}>Không tìm thấy cửa hàng</div>

  const formatCurrency = (v) => v.toLocaleString('vi-VN') + ' đ'

  return (
    <div className="grid" style={{ gap: 20 }}>
      {/* Nút quay lại */}
      <div>
        <Link to="/restaurants" className="btn ghost">← Quay lại danh sách</Link>
      </div>

      {/* Header với ảnh lớn và thông tin chính */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #660708 0%, #a4161a 100%)',
          padding: '32px 24px',
          display: 'flex',
          gap: 24,
          alignItems: 'center',
        }}>
          <img 
            src={data.avatar} 
            alt={data.name} 
            onError={(e) => {
              e.target.onerror = null
              e.target.src = API_CONFIG.PLACEHOLDER_IMAGE
            }}
            style={{ 
              width: 160, 
              height: 160, 
              borderRadius: 16, 
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              border: '3px solid rgba(255,255,255,0.1)',
            }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: '#fff' }}>{data.name}</div>
            <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📍</span>
              {data.address || 'Chưa cập nhật địa chỉ'}
            </div>
            
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span className="badge warn" style={{ fontSize: 16, padding: '8px 16px', background: 'rgba(255,176,0,0.2)', borderColor: 'rgba(255,176,0,0.4)' }}>
                ⭐ {data.ratingAvg.toFixed(1)} điểm
              </span>
              <div 
                className={`status-dot ${data.active ? 'active' : 'inactive'}`} 
                style={{ 
                  fontSize: 15, 
                  padding: '8px 16px',
                  background: data.active ? 'rgba(55,178,77,0.2)' : 'rgba(250,82,82,0.2)',
                  borderRadius: 20,
                }}
              >
                <span className="dot" />{data.active ? 'Đang hoạt động' : 'Đã khoá'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <div style={{ padding: 16, background: 'rgba(229,56,59,0.05)', borderRadius: 12, border: '1px solid rgba(229,56,59,0.2)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>Số điện thoại</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>📞 {data.phone || 'Chưa cập nhật'}</div>
            </div>
            <div style={{ padding: 16, background: 'rgba(229,56,59,0.05)', borderRadius: 12, border: '1px solid rgba(229,56,59,0.2)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>Giờ mở cửa</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                🕐 {data.openHours[0]?.time || 'Chưa cập nhật'}
              </div>
            </div>
            <div style={{ padding: 16, background: 'rgba(229,56,59,0.05)', borderRadius: 12, border: '1px solid rgba(229,56,59,0.2)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>Phân loại</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>🏷️ {data.categories || 'Chưa phân loại'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chủ sở hữu */}
      {data.owner && (
        <div className="card" style={{ padding: 24 }}>
          <div className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>👤 Thông tin chủ sở hữu</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 16, background: 'rgba(229,56,59,0.03)', borderRadius: 12 }}>
            {data.owner.avatar && (
              <img 
                src={data.owner.avatar}
                alt={data.owner.name}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = API_CONFIG.PLACEHOLDER_IMAGE
                }}
                style={{ 
                  width: 90, 
                  height: 90, 
                  borderRadius: 12, 
                  objectFit: 'cover',
                  border: '2px solid var(--color-border)',
                }}
              />
            )}
            <div style={{ flex: 1, display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{data.owner.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>✉️ {data.owner.email}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>📞 {data.owner.phone}</div>
            </div>
          </div>
        </div>
      )}

      {/* Thực đơn */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div className="section-title" style={{ fontSize: 22 }}>🍽️ Thực đơn ({data.menu.length} món)</div>
          <Link to={`/restaurants/${data.id}/menu`} className="btn primary">Xem tất cả món ăn</Link>
        </div>
        
        {data.menu.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 16 
          }}>
            {data.menu.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  background: 'linear-gradient(180deg, #1a1c21, #16181d)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-500)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = API_CONFIG.PLACEHOLDER_IMAGE
                  }}
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 10, 
                    objectFit: 'cover',
                    flexShrink: 0,
                  }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600, 
                    marginBottom: 8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 18, color: 'var(--color-primary-500)', fontWeight: 700, marginBottom: 6 }}>
                    {formatCurrency(item.price)}
                  </div>
                  <span className={`badge ${item.available ? 'success' : 'danger'}`} style={{ fontSize: 12 }}>
                    {item.available ? '✓ Còn hàng' : '✕ Hết hàng'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: 'var(--color-text-muted)',
            fontSize: 16,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
          }}>
            Nhà hàng chưa có món ăn nào
          </div>
        )}
      </div>
    </div>
  )
}


