import { useMemo, useState } from 'react'

const initialUsers = [
  { id: 'u1', name: 'Nguyễn Văn A', email: 'a@example.com', phone: '0901234567', createdAt: '2024-06-12', active: true },
  { id: 'u2', name: 'Trần Thị B', email: 'b@example.com', phone: '0912345678', createdAt: '2024-08-01', active: true },
  { id: 'u3', name: 'Lê Văn C', email: 'c@example.com', phone: '0933334444', createdAt: '2023-12-20', active: false },
]

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u => [u.name, u.email, u.phone].some(x => x.toLowerCase().includes(q)))
  }, [users, query])

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
  }
  const removeUser = (id) => {
    if (!confirm('Bạn có chắc muốn xoá người dùng này?')) return
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm theo tên/email/điện thoại"
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
                <td>{u.createdAt}</td>
                <td>
                  <span className={`status-dot ${u.active ? 'active' : 'inactive'}`}>
                    <span className="dot" />{u.active ? 'Hoạt động' : 'Khoá'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn equal" onClick={() => toggleActive(u.id)}>
                      {u.active ? 'Khoá' : 'Mở khoá'}
                    </button>
                    <button className="btn danger" onClick={() => removeUser(u.id)}>Xoá</button>
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


