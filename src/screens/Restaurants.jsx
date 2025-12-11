import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllRestaurants, updateRestaurantStatus } from '../services/RestaurantService'
import { API_CONFIG } from '../config/api'

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  // Hàm format địa chỉ từ object address
  const formatAddress = (addressObj) => {
    if (!addressObj) return ''
    
    // Nếu address là string thì trả về luôn
    if (typeof addressObj === 'string') return addressObj

    // Nếu address là object thì ghép các trường có giá trị
    const parts = [
      addressObj.street==="Chưa xác định"?"":addressObj.street  ,
      addressObj.ward==="Chưa xác định"?"":addressObj.ward,
      addressObj.district==="Chưa xác định"?"":addressObj.district,
      addressObj.province==="Chưa xác định"?"":addressObj.province,
    ].filter(Boolean) // Chỉ giữ lại các trường có giá trị
// Chỉ giữ lại các trường có giá trị
    // Chỉ hiển thị các phần có giá trị, không hiển thị gì nếu không có
    return parts.length > 0 ? parts.join(', ') : (addressObj.label || '')
  } 
  // Hàm lấy URL avatar an toàn và ghép với base URL backend
  const getAvatarUrl = (avatarData) => {
    if (!avatarData) {
      return API_CONFIG.PLACEHOLDER_IMAGE
    }
    
    // Nếu là string
    if (typeof avatarData === 'string') {
      return API_CONFIG.getFullUrl(avatarData)
    }
    
    // Nếu là object có thuộc tính url
    if (avatarData && typeof avatarData === 'object' && avatarData.url) {
      return API_CONFIG.getFullUrl(avatarData.url)
    }
    
    // Fallback về ảnh mặc định
    return API_CONFIG.PLACEHOLDER_IMAGE
  }

  // Gọi API lấy danh sách nhà hàng
  const loadRestaurants = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchAllRestaurants()

      // Chỉ map những field cần để hiển thị: id, tên, địa chỉ, ảnh, trạng thái, điểm TB
      const mapped = data.map((r, index) => ({
        id: r.id ?? `res-${index}`,
        name: r.name ?? 'Không rõ tên',
        address: formatAddress(r.address),
        avatar: getAvatarUrl(r.imageUrl),
        active: r.isActive ?? true,
        ratingAvg: Number(r.rating ?? 0),
      }))

      setRestaurants(mapped)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách nhà hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRestaurants()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return restaurants
    return restaurants.filter(r => 
      [r.name, r.address].some(x => x && x.toLowerCase().includes(q))
    )
  }, [restaurants, query])

  // Khoá / mở khoá nhà hàng thông qua API
  const toggleActive = async (restaurant) => {
    const nextActive = !restaurant.active

    try {
      setLoading(true)
      setError('')

      await updateRestaurantStatus(restaurant.id, nextActive)

      // Cập nhật lại state sau khi API thành công
      setRestaurants(prev =>
        prev.map(r =>
          r.id === restaurant.id ? { ...r, active: nextActive } : r,
        ),
      )
    } catch (err) {
      console.error(err)
      setError('Không cập nhật được trạng thái nhà hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm theo tên/địa chỉ"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #000',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />
          <button className="btn ghost" onClick={loadRestaurants} disabled={loading}>
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
              <th style={{ width: 60 }}>Ảnh</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Điểm TB</th>
              <th>Trạng thái</th>
              <th style={{ width: 260 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <img 
                    src={r.avatar} 
                    alt={r.name} 
                    onError={(e) => {
                      e.target.onerror = null // Tránh loop vô hạn
                      e.target.src = API_CONFIG.PLACEHOLDER_IMAGE
                    }}
                    style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} 
                  />
                </td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td><span className="badge warn">{(r.ratingAvg || 0).toFixed(1)}</span></td>
                <td>
                  <span className={`status-dot ${r.active ? 'active' : 'inactive'}`}>
                    <span className="dot" />{r.active ? 'Hoạt động' : 'Khoá'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link className="btn primary" to={`/restaurants/${r.id}`}>Xem chi tiết</Link>
                    <button 
                      className="btn equal" 
                      onClick={() => toggleActive(r)}
                      disabled={loading}
                    >
                      {r.active ? 'Khoá' : 'Mở khoá'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


