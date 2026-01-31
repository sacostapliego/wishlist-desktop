import type { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'

interface ResponsiveLayoutProps {
  children?: ReactNode // Make children optional since Outlet will be used
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <Flex minH="100vh">
      {/* Desktop Sidebar */}
      <Box
        display={{ base: "none", lg: "flex" }}
        w="280px"
        position="fixed"
        h="100vh"
        className="custom-sidebar" // Use custom CSS class
      >
        {/* Sidebar content */}
      </Box>

      {/* Main Content */}
      <Box
        flex="1"
        ml={{ base: 0, lg: "280px" }}
        pb={{ base: "80px", lg: 0 }} // Padding for mobile nav
      >
        {children}
      </Box>

      {/* Mobile Bottom Nav */}
      <Box
        display={{ base: "flex", lg: "none" }}
        position="fixed"
        bottom="0"
        w="100%"
        h="80px"
        className="custom-mobile-nav"
      >
        {/* Mobile nav content */}
      </Box>
    </Flex>
  )
}