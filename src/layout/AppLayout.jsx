import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_CONFIG } from "../config/api";
import "../theme.css";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Avatar admin cố định từ backend
  const adminAvatar = API_CONFIG.getFullUrl("/uploads/avatars/admin.png");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          <strong style={{ color: "var(--color-primary-500)" }}>
            SE405 Admin
          </strong>
        </div>
        <nav className="grid" style={{ gap: 8 }}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Tổng quan
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Người dùng
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cửa hàng
          </NavLink>
          <NavLink
            to="/restaurant-categories"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Danh mục nhà hàng
          </NavLink>
          <NavLink
            to="/product-categories"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Loại đồ ăn
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Bình luận
          </NavLink>
          <NavLink
            to="/complaints"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Khiếu nại
          </NavLink>
          <NavLink
            to="/vouchers"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Voucher
          </NavLink>
        </nav>
      </aside>

      <div className="content">
        <div className="topbar">
          <div className="title">Bảng điều khiển</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src={adminAvatar}
                  alt={user.username || "Admin"}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--color-text)" }}>
                  {user.username || user.email}
                </span>
              </div>
            )}
            <button className="btn ghost" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
