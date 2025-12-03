import { useEffect, useMemo, useState } from 'react'
import { fetchAllUsers, updateUserStatus } from '../services/UserService'
export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  // Gọi API lấy danh sách người dùng
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchAllUsers()

      // Map dữ liệu từ API về format dùng trong UI
      const mapped = data.map((user, index) => ({
        // Ưu tiên dùng id từ backend nếu có, fallback sang email hoặc index
        id: user.id ?? user.email ?? `user-${index}`,
        name: user.username,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        active: user.isActive,
      }))

      setUsers(mapped)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách người dùng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u => [u.name, u.email, u.phone].some(x => x.toLowerCase().includes(q)))
  }, [users, query])

  // Khoá / mở khoá user thông qua API
  const toggleActive = async (user) => {
    const nextActive = !user.active

    try {
      setLoading(true)
      setError('')

      await updateUserStatus(user.id, nextActive)

      // Cập nhật lại state sau khi API thành công
      setUsers(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, active: nextActive } : u,
        ),
      )
    } catch (err) {
      console.error(err)
      setError('Không cập nhật được trạng thái người dùng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Định dạng ngày tháng theo dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return ''

    // Nếu backend đã trả về đúng format dd/mm/yyyy thì giữ nguyên
    if (dateString.includes('/')) return dateString

    // Xử lý định dạng "yyyy-mm-dd" hoặc "yyyy-mm-dd hh:mm:ss"
    const date = new Date(dateString.replace(/-/g, '/'))
    if (isNaN(date.getTime())) return dateString

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return users.length > 0 ? (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm theo tên/email/điện thoại"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: '#111216', color: 'var(--color-text)' }}
          />
          <button className="btn ghost" onClick={loadUsers} disabled={loading}>
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
              <th>Tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th style={{ width: 220 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>
                  <span className={`status-dot ${u.active ? 'active' : 'inactive'}`}>
                    <span className="dot" />{u.active ? 'Hoạt động' : 'Khoá'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn equal"
                      onClick={() => toggleActive(u)}
                      disabled={loading}
                    >
                      {u.active ? 'Khoá' : 'Mở khoá'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div>Đang tải dữ liệu...</div>
  )
}

