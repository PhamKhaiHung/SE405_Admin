import { useMemo, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ComposedChart, Bar, Legend } from 'recharts'

const revenueData = [
  { name: 'T1', revenue: 12000000 },
  { name: 'T2', revenue: 14500000 },
  { name: 'T3', revenue: 17000000 },
  { name: 'T4', revenue: 15000000 },
  { name: 'T5', revenue: 21000000 },
  { name: 'T6', revenue: 26000000 },
]

// dữ liệu mock: user và restaurant theo tháng cho các năm
const monthlyStats = {
  2023: Array.from({ length: 12 }, (_, i) => ({ month: `T${i + 1}`, users: [80,90,95,110,120,130,140,150,145,160,170,180][i], restaurants: [10,12,11,14,15,13,16,18,17,19,20,22][i] })),
  2024: Array.from({ length: 12 }, (_, i) => ({ month: `T${i + 1}`, users: [100,120,130,140,150,155,160,170,180,190,200,210][i], restaurants: [12,14,13,16,18,17,19,20,21,22,24,25][i] })),
  2025: Array.from({ length: 12 }, (_, i) => ({ month: `T${i + 1}`, users: [110,125,150,160,170,180,190,210,220,230,240,260][i], restaurants: [13,15,14,18,19,18,21,22,23,25,26,28][i] })),
}

export default function Dashboard() {
  const formatCurrency = (v) => v.toLocaleString('vi-VN') + ' đ'
  const years = Object.keys(monthlyStats).map(Number).sort()
  const [year, setYear] = useState(years[years.length - 1])
  const userRestaurantData = useMemo(() => monthlyStats[year], [year])

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-3">
        <div className="stat-card">
          <div className="label">Tổng người dùng</div>
          <div className="value">12,430</div>
        </div>
        <div className="stat-card">
          <div className="label">Tổng cửa hàng</div>
          <div className="value">1,024</div>
        </div>
        <div className="stat-card">
          <div className="label">Doanh thu tháng này</div>
          <div className="value" style={{ color: 'var(--color-primary-500)' }}>{formatCurrency(26000000)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="section-title">Doanh thu theo tháng</div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e5383b" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#e5383b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#737373" />
              <YAxis stroke="#737373" tickFormatter={v => v/1000000 + 'm'} />
              <Tooltip formatter={(v) => [formatCurrency(v), 'Doanh thu']} />
              <Area type="monotone" dataKey="revenue" stroke="#e5383b" fillOpacity={1} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-title">Thống kê người dùng & cửa hàng theo tháng</div>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ padding: '8px 10px', borderRadius: 8, background: '#0f1013', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={userRestaurantData}>
              <XAxis dataKey="month" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="users" name="Người dùng" stroke="#e5383b" fill="#e5383b33" />
              <Bar dataKey="restaurants" name="Cửa hàng" fill="#a4161a" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


