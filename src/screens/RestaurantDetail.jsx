import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ComposedChart, Area } from 'recharts'

const restaurants = {
  r1: {
    id: 'r1',
    name: 'Bún Chả Hà Nội 1982',
    address: '12 Lý Thường Kiệt, Q1',
    avatar: 'https://picsum.photos/seed/r1/120',
    active: true,
    ratingAvg: 4.6,
    description: 'Quán bún chả phong cách Hà Nội, nguyên liệu tươi và nướng tại chỗ.',
    openHours: [
      { day: 'Thứ 2 - Thứ 6', time: '08:00 - 21:00' },
      { day: 'Cuối tuần', time: '08:00 - 22:00' },
    ],
    menu: [
      { id: 'm1', name: 'Bún chả đặc biệt', price: 55000 },
      { id: 'm2', name: 'Nem cua bể', price: 45000 },
      { id: 'm3', name: 'Bún nem', price: 50000 },
    ],
    likes: 1320,
    saves: 560,
    comments: [
      { id: 'c1', user: 'Minh', rating: 5, content: 'Ngon, phục vụ nhanh.' },
      { id: 'c2', user: 'Linh', rating: 4, content: 'Nước chấm đậm đà.' },
    ],
    monthlyOrders: {
      2023: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, orders: [90,100,80,110,120,140,150,130,160,170,180,190][i] })),
      2024: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, orders: [100,120,95,130,140,150,155,165,175,185,195,210][i] })),
      2025: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, orders: [120,135,115,150,160,170,180,195,205,215,230,245][i] })),
    },
    monthlyRevenue: {
      2023: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, revenue: [3200000,3800000,3000000,4500000,4800000,5200000,5600000,5000000,5900000,6200000,6500000,6800000][i] })),
      2024: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, revenue: [4200000,4600000,3800000,5200000,5600000,6000000,6400000,6600000,6800000,7200000,7600000,8000000][i] })),
      2025: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, revenue: [4500000,5200000,4200000,6000000,6500000,7000000,7400000,7800000,8200000,8600000,9000000,9600000][i] })),
    },
  },
  r2: { id: 'r2', name: 'Cơm Tấm Sài Gòn', address: '45 Nguyễn Trãi, Q5', avatar: 'https://picsum.photos/seed/r2/120', active: true, ratingAvg: 4.2, description: 'Cơm tấm chuẩn vị.', openHours: [{ day: 'Hằng ngày', time: '07:00 - 21:00' }], menu: [{ id: 'm4', name: 'Cơm tấm sườn bì chả', price: 45000 }], likes: 820, saves: 260, comments: [{ id: 'c3', user: 'Hà', rating: 4, content: 'Ổn áp.' }], monthlyOrders: { 2025: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, orders: [70,75,80,85,90,100,110,115,120,130,140,150][i] })) }, monthlyRevenue: { 2025: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, revenue: [2200000,2300000,2400000,2600000,2800000,3000000,3200000,3400000,3600000,3800000,4000000,4200000][i] })) } },
  r3: { id: 'r3', name: 'Bánh Mì Phượng', address: '21 Lê Lợi, Q3', avatar: 'https://picsum.photos/seed/r3/120', active: false, ratingAvg: 3.9, description: 'Bánh mì giòn ngon.', openHours: [{ day: 'Thứ 2 - Thứ 7', time: '06:30 - 19:30' }], menu: [{ id: 'm5', name: 'Bánh mì thịt', price: 30000 }], likes: 410, saves: 130, comments: [{ id: 'c4', user: 'Phúc', rating: 3, content: 'Bình thường.' }], monthlyOrders: { 2025: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, orders: [30,32,28,35,38,36,40,42,45,46,48,50][i] })) }, monthlyRevenue: { 2025: Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, revenue: [900000,950000,880000,1000000,1050000,1100000,1150000,1200000,1250000,1300000,1350000,1400000][i] })) } },
}

export default function RestaurantDetail() {
  const { id } = useParams()
  const data = useMemo(() => restaurants[id], [id])
  if (!data) return <div>Không tìm thấy cửa hàng</div>

  const formatCurrency = (v) => v.toLocaleString('vi-VN') + ' đ'
  const orderYears = useMemo(() => Object.keys(data.monthlyOrders || {}).map(Number).sort(), [data])
  const revenueYears = useMemo(() => Object.keys(data.monthlyRevenue || {}).map(Number).sort(), [data])
  const defaultYear = (arr) => arr.length ? arr[arr.length - 1] : new Date().getFullYear()
  const [year, setYear] = useState(defaultYear(orderYears.length ? orderYears : revenueYears))
  const ordersData = useMemo(() => (data.monthlyOrders && data.monthlyOrders[year]) || [], [data, year])
  const revenueData = useMemo(() => (data.monthlyRevenue && data.monthlyRevenue[year]) || [], [data, year])

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/restaurants" className="btn ghost">← Quay lại</Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={data.avatar} alt={data.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{data.name}</div>
            <div style={{ color: 'var(--color-text-muted)' }}>{data.address}</div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <span className="badge warn">★ {data.ratingAvg.toFixed(1)}</span>
          <span className="badge">👍 {data.likes}</span>
          <span className="badge">💾 {data.saves}</span>
        </div>
      </div>

      <div className="grid cols-3">
        <div className="card" style={{ padding: 14 }}>
          <div className="section-title">Mô tả</div>
          <div style={{ color: 'var(--color-text-muted)' }}>{data.description}</div>
          <div style={{ height: 12 }} />
          <div className={`status-dot ${data.active ? 'active' : 'inactive'}`}><span className="dot" />{data.active ? 'Đang hoạt động' : 'Đã khoá'}</div>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div className="section-title">Giờ mở cửa</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {data.openHours.map((o, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{o.day}</span><span className="badge">{o.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div className="section-title">Thực đơn</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {data.menu.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span><span className="badge warn">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="section-title">Đơn hàng theo tháng</div>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ padding: '8px 10px', borderRadius: 8, background: '#0f1013', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
              {orderYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <ComposedChart data={ordersData}>
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="orders" name="Đơn hàng" stroke="#a4161a" fill="#a4161a33" />
                <Bar dataKey="orders" name="Đơn hàng" fill="#a4161a" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="section-title">Doanh thu theo tháng</div>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ padding: '8px 10px', borderRadius: 8, background: '#0f1013', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
              {revenueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" tickFormatter={v => v/1000000 + 'm'} />
                <Tooltip formatter={(v) => [formatCurrency(v), 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#e5383b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="section-title">Bình luận</div>
        <table className="table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Điểm</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {data.comments.map(c => (
              <tr key={c.id}>
                <td>{c.user}</td>
                <td><span className="badge warn">{c.rating}</span></td>
                <td style={{ color: 'var(--color-text-muted)' }}>{c.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


