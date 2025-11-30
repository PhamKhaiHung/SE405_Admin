import { NavLink, Outlet } from 'react-router-dom'
import '../theme.css'

export default function AppLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          <strong style={{ color: 'var(--color-primary-500)' }}>SE405 Admin</strong>
        </div>
        <nav className="grid" style={{ gap: 8 }}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Tổng quan</NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>Người dùng</NavLink>
          <NavLink to="/restaurants" className={({ isActive }) => isActive ? 'active' : ''}>Cửa hàng</NavLink>
          <NavLink to="/reviews" className={({ isActive }) => isActive ? 'active' : ''}>Bình luận</NavLink>
          <NavLink to="/complaints" className={({ isActive }) => isActive ? 'active' : ''}>Khiếu nại</NavLink>
          <NavLink to="/vouchers" className={({ isActive }) => isActive ? 'active' : ''}>Voucher</NavLink>
        </nav>
      </aside>

      <div className="content">
        <div className="topbar">
          <div className="title">Bảng điều khiển</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost">Hỗ trợ</button>
            <button className="btn primary">Đăng xuất</button>
          </div>
        </div>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


