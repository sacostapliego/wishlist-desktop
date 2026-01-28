import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'
import HomePage from '../pages/HomePage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <ResponsiveLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/auth',
    children: [
    ],
  },
  {
    path: '/shared/:id',
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}