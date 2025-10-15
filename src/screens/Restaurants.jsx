import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const initialRestaurants = [
  { id: 'r1', name: 'Bún Chả Hà Nội 1982', address: '12 Lý Thường Kiệt, Q1', avatar: 'https://picsum.photos/seed/r1/80', active: true, ratingAvg: 4.6 },
  { id: 'r2', name: 'Cơm Tấm Sài Gòn', address: '45 Nguyễn Trãi, Q5', avatar: 'https://picsum.photos/seed/r2/80', active: true, ratingAvg: 4.2 },
  { id: 'r3', name: 'Bánh Mì Phượng', address: '21 Lê Lợi, Q3', avatar: 'https://picsum.photos/seed/r3/80', active: false, ratingAvg: 3.9 },
]

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(initialRestaurants)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return restaurants
    return restaurants.filter(r => [r.name, r.address].some(x => x.toLowerCase().includes(q)))
  }, [restaurants, query])

  const toggleActive = (id) => setRestaurants(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm theo tên/địa chỉ"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
          />
        </div>
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
                  <img src={r.avatar} alt={r.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                </td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td><span className="badge warn">{r.ratingAvg.toFixed(1)}</span></td>
                <td>
                  <span className={`status-dot ${r.active ? 'active' : 'inactive'}`}>
                    <span className="dot" />{r.active ? 'Hoạt động' : 'Khoá'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link className="btn primary" to={`/restaurants/${r.id}`}>Xem chi tiết</Link>
                    <button className="btn equal" onClick={() => toggleActive(r.id)}>{r.active ? 'Khoá' : 'Mở khoá'}</button>
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


