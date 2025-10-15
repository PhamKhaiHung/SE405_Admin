import { useMemo, useState } from 'react'

const initialReviews = [
  { id: 'c1', user: 'Minh', restaurant: 'Bún Chả Hà Nội 1982', rating: 5, content: 'Ngon, phục vụ nhanh.', hidden: false },
  { id: 'c2', user: 'Linh', restaurant: 'Cơm Tấm Sài Gòn', rating: 4, content: 'Nước mắm vừa miệng.', hidden: false },
  { id: 'c3', user: 'Phúc', restaurant: 'Bánh Mì Phượng', rating: 2, content: 'Hơi đông, chờ lâu.', hidden: false },
]

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter(r => [r.user, r.restaurant, r.content].some(x => x.toLowerCase().includes(q)))
  }, [reviews, query])

  const hideReview = (id) => setReviews(prev => prev.map(r => r.id === id ? { ...r, hidden: true } : r))
  const deleteReview = (id) => {
    if (!confirm('Bạn có chắc muốn xoá bình luận này?')) return
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <input
          placeholder="Tìm theo người dùng/nhà hàng/nội dung"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
        />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Cửa hàng</th>
              <th>Điểm</th>
              <th>Nội dung</th>
              <th style={{ width: 200 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.user}</td>
                <td>{r.restaurant}</td>
                <td><span className="badge warn">{r.rating}</span></td>
                <td style={{ color: r.hidden ? '#777' : 'var(--color-text)' }}>{r.hidden ? '(Đã ẩn) ' : ''}{r.content}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => hideReview(r.id)} disabled={r.hidden}>Ẩn</button>
                    <button className="btn danger" onClick={() => deleteReview(r.id)}>Xoá</button>
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


