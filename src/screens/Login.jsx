import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../theme.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e5383b 0%, #a4161a 100%)',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: 'var(--color-primary-500)' 
            }} />
            <strong style={{ fontSize: 24, color: 'var(--color-primary-500)' }}>SE405 Admin</strong>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 8 }}>
            Đăng nhập vào hệ thống quản trị
          </p>
        </div>

        {error && (
          <div style={{
            padding: 12,
            background: 'rgba(250, 82, 82, 0.1)',
            border: '1px solid rgba(250, 82, 82, 0.3)',
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <div style={{ color: '#fa5252', fontSize: 14 }}>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: 'var(--color-text)',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e0e0e0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-500)'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: 'var(--color-text)',
            }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '2px solid #e0e0e0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-500)'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 10,
              background: loading ? '#ccc' : 'var(--color-primary-500)',
              color: '#fff',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              marginTop: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#a4161a'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = 'var(--color-primary-500)'
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}

