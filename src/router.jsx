import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './screens/Dashboard'
import Users from './screens/Users'
import Restaurants from './screens/Restaurants'
import RestaurantDetail from './screens/RestaurantDetail'
import Reviews from './screens/Reviews'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'restaurants', element: <Restaurants /> },
      { path: 'restaurants/:id', element: <RestaurantDetail /> },
      { path: 'reviews', element: <Reviews /> },
    ],
  },
])

export default router


