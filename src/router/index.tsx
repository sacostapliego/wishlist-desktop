import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
import FriendsPage from '../pages/FriendsPage'
import SettingsPage from '../pages/SettingsPage'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import WishlsitPage from '../pages/WishlistPage'
import ItemPage from '../pages/ItemPage'
import AllWishlistsPage from '../pages/AllWishlistsPage'
import AllClaimedItemsPage from '../pages/AllClaimedItemsPage'

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
      { path: 'wishlists/friends', element: <AllWishlistsPage type="friends" /> },
      { path: 'wishlists/mine', element: <AllWishlistsPage type="mine" /> },
      { path: 'items/claimed', element: <AllClaimedItemsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/:userId', element: <ProfilePage /> },
      { path: 'friends', element: <FriendsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/auth',
    children: [
      { index: true, element: <AuthRedirect /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}