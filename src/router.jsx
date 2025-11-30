import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './screens/Dashboard'
import Users from './screens/Users'
import Restaurants from './screens/Restaurants'
import RestaurantDetail from './screens/RestaurantDetail'
import MenuDetail from './screens/MenuDetail'
import Reviews from './screens/Reviews'
import Complaints from './screens/Complaints'
import Vouchers from './screens/Vouchers'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'restaurants', element: <Restaurants /> },
      { path: 'restaurants/:id', element: <RestaurantDetail /> },
      { path: 'restaurants/:id/menu', element: <MenuDetail /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'complaints', element: <Complaints /> },
      { path: 'vouchers', element: <Vouchers /> },
    ],
  },
])

export default router


