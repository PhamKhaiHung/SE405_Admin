import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import Users from './screens/Users'
import Restaurants from './screens/Restaurants'
import RestaurantDetail from './screens/RestaurantDetail'
import MenuDetail from './screens/MenuDetail'
import Reviews from './screens/Reviews'
import Complaints from './screens/Complaints'
import Vouchers from './screens/Vouchers'
import RestaurantCategories from './screens/RestaurantCategories'
import ProductCategories from './screens/ProductCategories'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'restaurants', element: <Restaurants /> },
      { path: 'restaurants/:id', element: <RestaurantDetail /> },
      { path: 'restaurants/:id/menu', element: <MenuDetail /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'complaints', element: <Complaints /> },
      { path: 'vouchers', element: <Vouchers /> },
      { path: 'restaurant-categories', element: <RestaurantCategories /> },
      { path: 'product-categories', element: <ProductCategories /> },
    ],
  },
])

export default router


