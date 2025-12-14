import { useMemo, useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { fetchSummary, fetchMonthlyStatistics, fetchRestaurantRevenue } from '../services/StatisticsService'
import { fetchAllRestaurants } from '../services/RestaurantService'

export default function Dashboard() {
  const formatCurrency = (v) => v.toLocaleString('vi-VN') + ' đ'
  
  const [summary, setSummary] = useState({ totalUsers: 0, totalRestaurants: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [revenueLoading, setRevenueLoading] = useState(false)
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

  // Lấy doanh thu từ tất cả nhà hàng
  const loadRevenueData = async (selectedYear) => {
    try {
      setRevenueLoading(true)
      setError('')
      
      // Lấy danh sách nhà hàng
      const restaurants = await fetchAllRestaurants()
      
      if (!restaurants || restaurants.length === 0) {
        // Không có nhà hàng, set dữ liệu rỗng
        const emptyData = Array.from({ length: 12 }, (_, i) => ({
          name: `T${i + 1}`,
          revenue: 0,
        }))
        setRevenueData(emptyData)
        setCurrentMonthRevenue(0)
        return
      }

      // Lấy doanh thu từng nhà hàng theo API /revenue-reports/restaurant/{restaurantId}/monthly/{year}
      const revenuePromises = restaurants.map(restaurant => 
        fetchRestaurantRevenue(restaurant.id, selectedYear).catch(err => {
          console.error(`Error fetching revenue for restaurant ${restaurant.id}:`, err)
          // Trả về mảng với 12 tháng, doanh thu = 0 nếu lỗi
          return Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            revenue: 0,
          }))
        })
      )

      const allRevenues = await Promise.all(revenuePromises)

      // Tính tổng doanh thu theo tháng từ tất cả nhà hàng
      const monthlyTotals = Array.from({ length: 12 }, () => 0)

      allRevenues.forEach(restaurantRevenue => {
        if (Array.isArray(restaurantRevenue)) {
          restaurantRevenue.forEach(item => {
            const month = item.month || 0
            const revenue = item.revenue || 0
            // month từ API là 1-12
            if (month >= 1 && month <= 12) {
              monthlyTotals[month - 1] += revenue
            }
          })
        }
      })

      // Tính 10% doanh thu và format cho biểu đồ
      const formatted = monthlyTotals.map((total, index) => ({
        name: `T${index + 1}`,
        revenue: Math.round(total * 0.1), // 10% doanh thu tổng
      }))

      setRevenueData(formatted)

      // Tính tổng doanh thu cả năm (10% của tổng tất cả các tháng)
      const totalYearRevenue = monthlyTotals.reduce((sum, monthRevenue) => sum + monthRevenue, 0)
      const finalRevenue = Math.round(totalYearRevenue * 0.1)
      console.log('Total year revenue (10%):', finalRevenue, 'from total:', totalYearRevenue)
      setCurrentMonthRevenue(finalRevenue)
    } catch (err) {
      console.error('loadRevenueData error:', err)
      setError('Không tải được dữ liệu doanh thu.')
      // Set dữ liệu rỗng nếu lỗi
      const emptyData = Array.from({ length: 12 }, (_, i) => ({
        name: `T${i + 1}`,
        revenue: 0,
      }))
      setRevenueData(emptyData)
      setCurrentMonthRevenue(0)
    } finally {
      setRevenueLoading(false)
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

  // Load revenue data khi component mount và khi year thay đổi
  useEffect(() => {
    loadRevenueData(year)
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
          <div className="label">Tổng doanh thu năm {year}</div>
          <div className="value" >
            {revenueLoading ? '...' : formatCurrency(currentMonthRevenue)}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="section-title">Doanh thu theo tháng</div>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} 
            disabled={revenueLoading}
            style={{ 
              width: 'auto',
              padding: '10px 12px', 
              borderRadius: 10, 
              background: '#fff', 
              color: 'var(--color-text)', 
              border: '2px solid var(--color-primary-500)',
              minWidth: 140,
              cursor: revenueLoading ? 'not-allowed' : 'pointer',
              opacity: revenueLoading ? 0.6 : 1,
            }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          {revenueLoading && revenueData.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
              Đang tải dữ liệu...
            </div>
          ) : (
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
          )}
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
              width: 'auto',
              padding: '10px 12px', 
              borderRadius: 10, 
              background: '#fff', 
              color: 'var(--color-text)', 
              border: '2px solid var(--color-primary-500)',
              minWidth: 140,
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
              width: 'auto',
              padding: '10px 12px', 
              borderRadius: 10, 
              background: '#fff', 
              color: 'var(--color-text)', 
              border: '2px solid var(--color-primary-500)',
              minWidth: 140,
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


