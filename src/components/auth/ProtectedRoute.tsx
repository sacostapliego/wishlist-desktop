import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Box, Spinner } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center" bg="#070707">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}