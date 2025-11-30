import { useParams, Link } from 'react-router-dom'

// Mock data chi tiết thực đơn cho từng cửa hàng
const restaurantMenus = {
  r1: {
    id: 'r1',
    name: 'Bún Chả Hà Nội 1982',
    menu: [
      {
        id: 'm1',
        name: 'Bún chả đặc biệt',
        price: 55000,
        image: 'https://picsum.photos/seed/buncha1/300/200',
        description: 'Bún chả truyền thống Hà Nội với thịt nướng thơm ngon, nước chấm đậm đà, kèm rau sống tươi ngon.',
        category: 'Món chính',
        ingredients: ['Thịt ba chỉ', 'Bún tươi', 'Rau sống', 'Nước mắm pha'],
        rating: 4.8,
        reviews: 156
      },
      {
        id: 'm2',
        name: 'Nem cua bể',
        price: 45000,
        image: 'https://picsum.photos/seed/nemcua1/300/200',
        description: 'Nem cua bể giòn tan, nhân cua tươi ngon, chấm nước mắm chua ngọt đặc biệt.',
        category: 'Món phụ',
        ingredients: ['Cua bể tươi', 'Bánh tráng', 'Rau thơm', 'Nước mắm chua ngọt'],
        rating: 4.6,
        reviews: 89
      },
      {
        id: 'm3',
        name: 'Bún nem',
        price: 50000,
        image: 'https://picsum.photos/seed/bunnem1/300/200',
        description: 'Bún nem thơm ngon với nem rán giòn, nước dùng trong, rau sống tươi.',
        category: 'Món chính',
        ingredients: ['Bún tươi', 'Nem rán', 'Nước dùng', 'Rau sống'],
        rating: 4.5,
        reviews: 124
      }
    ]
  },
  r2: {
    id: 'r2',
    name: 'Cơm Tấm Sài Gòn',
    menu: [
      {
        id: 'm4',
        name: 'Cơm tấm sườn bì chả',
        price: 45000,
        image: 'https://picsum.photos/seed/comtam1/300/200',
        description: 'Cơm tấm truyền thống Sài Gòn với sườn nướng, bì, chả, dưa leo và nước mắm pha.',
        category: 'Món chính',
        ingredients: ['Cơm tấm', 'Sườn nướng', 'Bì', 'Chả', 'Dưa leo'],
        rating: 4.3,
        reviews: 203
      }
    ]
  },
  r3: {
    id: 'r3',
    name: 'Bánh Mì Phượng',
    menu: [
      {
        id: 'm5',
        name: 'Bánh mì thịt nướng',
        price: 30000,
        image: 'https://picsum.photos/seed/banhmi1/300/200',
        description: 'Bánh mì giòn với thịt nướng thơm ngon, pate đặc biệt, rau sống và gia vị.',
        category: 'Món chính',
        ingredients: ['Bánh mì', 'Thịt nướng', 'Pate', 'Rau sống', 'Gia vị'],
        rating: 4.1,
        reviews: 78
      }
    ]
  }
}

export default function MenuDetail() {
  const { id } = useParams()
  const restaurant = restaurantMenus[id]
  
  if (!restaurant) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Không tìm thấy cửa hàng</h2>
        <Link to="/restaurants" className="btn primary">Quay lại</Link>
      </div>
    )
  }

  const formatCurrency = (v) => v.toLocaleString('vi-VN') + ' đ'

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to={`/restaurants/${id}`} className="btn ghost">← Quay lại</Link>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Thực đơn - {restaurant.name}</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>
            {restaurant.menu.length} món ăn
          </p>
        </div>
      </div>

      <div className="grid" style={{ gap: 16 }}>
        {restaurant.menu.map(item => (
          <div key={item.id} className="card" style={{ padding: 16, display: 'flex', gap: 16 }}>
            <img 
              src={item.image} 
              alt={item.name}
              style={{ 
                width: 200, 
                height: 150, 
                borderRadius: 12, 
                objectFit: 'cover',
                flexShrink: 0
              }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{item.name}</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge warn">★ {item.rating}</span>
                  <span className="badge" style={{ background: 'var(--color-primary-500)', color: 'white' }}>
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span className="badge">{item.category}</span>
                <span className="badge" style={{ color: 'var(--color-text-muted)' }}>
                  {item.reviews} đánh giá
                </span>
              </div>
              
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                {item.description}
              </p>
              
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-muted)' }}>
                  Thành phần:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.ingredients.map((ingredient, index) => (
                    <span key={index} className="badge" style={{ fontSize: 12 }}>
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

