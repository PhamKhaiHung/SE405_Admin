/**
 * Component Modal xác nhận hành động (xóa, cảnh báo, v.v.)
 * Có thể tái sử dụng cho nhiều trang khác nhau
 */
export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận', 
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger' // 'danger', 'warning', 'info'
}) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(250, 82, 82, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa5252" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255, 212, 59, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffd43b" strokeWidth="2">
              <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div 
        className="card"
        style={{ 
          width: '100%', 
          maxWidth: 420, 
          padding: 24,
          background: 'var(--color-surface)',
          textAlign: 'center',
          animation: 'fadeInScale 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {getIcon()}
        
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: 12,
          fontSize: 20,
          fontWeight: 600,
        }}>
          {title}
        </h2>
        
        <p style={{ 
          marginTop: 0, 
          marginBottom: 24,
          color: 'var(--color-text-muted)',
          fontSize: 14,
          lineHeight: '1.6',
        }}>
          {message}
        </p>

        <div style={{ 
          display: 'flex', 
          gap: 12, 
          justifyContent: 'center',
        }}>
          <button 
            className="btn ghost" 
            onClick={onClose}
            style={{ minWidth: 100 }}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${type === 'danger' ? 'danger' : 'primary'}`}
            onClick={() => {
              onConfirm()
              onClose()
            }}
            style={{ minWidth: 100 }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

