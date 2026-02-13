import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { COLORS } from '../../styles/common'

export default function GuestLayout() {
  return (
    <Box minH="100vh" bg={COLORS.background}>
      <Outlet />
    </Box>
  )
}