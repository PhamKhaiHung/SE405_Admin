import { useMemo, useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { fetchSummary, fetchMonthlyStatistics } from '../services/StatisticsService'

const revenueData = [
  { name: 'T1', revenue: 12000000 },
  { name: 'T2', revenue: 14500000 },
  { name: 'T3', revenue: 17000000 },
  { name: 'T4', revenue: 15000000 },
  { name: 'T5', revenue: 21000000 },
  { name: 'T6', revenue: 26000000 },
]

export default function Dashboard() {
  const formatCurrency = (v) => v.toLocaleString('vi-VN') + ' đ'
  
  const [summary, setSummary] = useState({ totalUsers: 0, totalRestaurants: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  // Lấy tổng số người dùng và nhà hàng
  const loadSummary = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchSummary()
      setSummary({
        totalUsers: data.totalUsers || 0,
        totalRestaurants: data.totalRestaurants || 0,
      })
    } catch (err) {
      console.error(err)
      setError('Không tải được thống kê tổng quan.')
    } finally {
      setLoading(false)
    }
  }

  // Lấy thống kê theo tháng
  const loadMonthlyStatistics = async (selectedYear) => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchMonthlyStatistics(selectedYear)
      
      // Chuyển đổi format từ API (month: 1-12) sang format cho chart (month: "T1"-"T12")
      const formatted = data.map(item => ({
        month: `T${item.month}`,
        users: item.users || 0,
        restaurants: item.restaurants || 0,
      }))
      
      setMonthlyData(formatted)
    } catch (err) {
      console.error(err)
      setError('Không tải được thống kê theo tháng.')
    } finally {
      setLoading(false)
    }
  }

  // Load summary khi component mount
  useEffect(() => {
    loadSummary()
  }, [])

  // Load monthly data khi component mount và khi year thay đổi
  useEffect(() => {
    loadMonthlyStatistics(year)
  }, [year])

  // Tạo danh sách năm (từ năm hiện tại trở về trước 3 năm)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i)

  return (
    <div className="grid" style={{ gap: 16 }}>
      {error && (
        <div className="card" style={{ padding: 12, background: 'rgba(250, 82, 82, 0.1)', border: '1px solid rgba(250, 82, 82, 0.3)' }}>
          <div style={{ color: '#fa5252', fontSize: 14 }}>{error}</div>
        </div>
      )}

      <div className="grid cols-3">
        <div className="stat-card">
          <div className="label">Tổng người dùng</div>
          <div className="value">
            {loading ? '...' : summary.totalUsers.toLocaleString('vi-VN')}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Tổng cửa hàng</div>
          <div className="value">
            {loading ? '...' : summary.totalRestaurants.toLocaleString('vi-VN')}
          </div>
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

      {/* Biểu đồ người dùng theo tháng */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-title">Thống kê người dùng theo tháng</div>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} 
            disabled={loading}
            style={{ 
              padding: '8px 10px', 
              borderRadius: 8, 
              background: '#0f1013', 
              color: 'var(--color-text)', 
              border: '1px solid var(--color-border)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          {loading && monthlyData.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
              Đang tải dữ liệu...
            </div>
          ) : (
            <ResponsiveContainer>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5383b" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#e5383b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip formatter={(v) => [v.toLocaleString('vi-VN'), 'Người dùng']} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#e5383b" 
                  fillOpacity={1} 
                  fill="url(#usersGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ nhà hàng theo tháng */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-title">Thống kê nhà hàng theo tháng</div>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} 
            disabled={loading}
            style={{ 
              padding: '8px 10px', 
              borderRadius: 8, 
              background: '#0f1013', 
              color: 'var(--color-text)', 
              border: '1px solid var(--color-border)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          {loading && monthlyData.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
              Đang tải dữ liệu...
            </div>
          ) : (
            <ResponsiveContainer>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="restaurantsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a4161a" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#a4161a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip formatter={(v) => [v.toLocaleString('vi-VN'), 'Nhà hàng']} />
                <Area 
                  type="monotone" 
                  dataKey="restaurants" 
                  stroke="#a4161a" 
                  fillOpacity={1} 
                  fill="url(#restaurantsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}


