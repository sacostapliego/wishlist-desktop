import { Box, VStack, Heading, Text, Button, HStack, IconButton } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { LuArrowLeft, LuLogOut } from 'react-icons/lu'
import { useAuth } from '../context/AuthContext'
import { COLORS } from '../styles/common'

function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Box h="calc(100vh - 32px)" w="100%" overflowY="auto" bg={COLORS.background}>
      {/* Header */}
      <Box bg={COLORS.background} px={8} py={4} position="sticky" top={0} zIndex={10}>
        <HStack justify="space-between">
          <IconButton
            aria-label="Go back"
            variant="ghost"
            onClick={() => navigate(-1)}
            color="white"
            size="lg"
          >
            <LuArrowLeft />
          </IconButton>
          <Heading size="lg" color="white">
            Settings
          </Heading>
          <Box w="40px" /> {/* Spacer for alignment */}
        </HStack>
      </Box>

      {/* Settings Content */}
      <VStack gap={6} align="stretch" px={8} py={6}>
        {/* Account Information Section */}
        <Box>
          <Heading size="md" color="white" mb={4}>
            Account Information
          </Heading>
          
          <VStack
            gap={4}
            align="stretch"
            bg={COLORS.cardGray}
            borderRadius="xl"
            p={6}
          >
            {/* Name */}
            <Box>
              <Text color={COLORS.text.secondary} fontSize="sm" mb={1}>
                Name
              </Text>
              <Text color="white" fontSize="lg">
                {user.name || 'Not set'}
              </Text>
            </Box>

            {/* Username */}
            <Box>
              <Text color={COLORS.text.secondary} fontSize="sm" mb={1}>
                Username
              </Text>
              <Text color="white" fontSize="lg">
                @{user.username}
              </Text>
            </Box>

            {/* Email */}
            <Box>
              <Text color={COLORS.text.secondary} fontSize="sm" mb={1}>
                Email
              </Text>
              <Text color="white" fontSize="lg">
                {user.email}
              </Text>
            </Box>

            {/* Reset Password Button */}
            <Box pt={2}>
              <Button
                w="100%"
                variant="outline"
                colorScheme="blue"
                onClick={() => {
                  // TODO: Implement password reset
                  console.log('Reset password clicked')
                }}
              >
                Reset Password
              </Button>
            </Box>
          </VStack>
        </Box>

        {/* Logout Section */}
        <Box>
          <Box
            bg={COLORS.cardGray}
            borderRadius="xl"
            p={4}
            cursor="pointer"
            onClick={handleLogout}
            _hover={{ bg: 'rgba(239, 68, 68, 0.1)' }}
            transition="background 0.2s"
          >
            <HStack gap={3}>
              <LuLogOut size={24} color="#ef4444" />
              <Text color="#ef4444" fontSize="lg" fontWeight="medium">
                Logout
              </Text>
            </HStack>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default SettingsPage