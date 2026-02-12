import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProfilePage from '../pages/ProfilePage'
import FriendsPage from '../pages/FriendsPage'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import WishlsitPage from '../pages/WishlistPage'
import ItemPage from '../pages/ItemPage'

function AuthRedirect() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/auth/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ResponsiveLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'wishlist/:id', element: <WishlsitPage /> },
      { path: 'wishlist/:id/:itemId', element: <ItemPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/:userId', element: <ProfilePage /> },
      { path: 'friends', element: <FriendsPage /> },
    ],
  },
  {
    path: '/auth',
    children: [
      { index: true, element: <AuthRedirect /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}