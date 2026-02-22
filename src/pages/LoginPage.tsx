import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Container,
} from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import { toaster } from '../components/ui/toaster'
import { COLORS } from '../styles/common'
import type { ApiError } from '../types/types'

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      toaster.create({
        title: 'Error',
        description: 'Enter username or email and password.',
        type: 'error',
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await login(usernameOrEmail, password)
      if (response && response.user) {
        toaster.create({
          title: 'Success',
          description: 'Logged in successfully!',
          type: 'success',
        })
        navigate('/')
      } else {
        toaster.create({
          title: 'Error',
          description: 'Invalid credentials.',
          type: 'error',
        })
      }
    } catch (e) {
      const error = e as ApiError
      let msg = 'Login failed.'
      if (error?.response?.data?.detail) msg = error.response.data.detail as string
      else if (error?.message) msg = error.message
      toaster.create({
        title: 'Error',
        description: msg,
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg={COLORS.background} display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md">
        <VStack gap={6} bg="#141414" p={8} borderRadius="xl">
          <VStack gap={2} w="100%" alignItems="flex-start">
            <Heading size="2xl" color="white">
              Welcome Back
            </Heading>
            <Text color={COLORS.text.secondary}>Sign in to continue</Text>
          </VStack>

          <VStack gap={4} w="100%">
            <Input
              placeholder="Email or Username"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              size="lg"
              bg="#1a1a1a"
              border="2px solid"
              borderColor={COLORS.primary}
              color="white"
              _placeholder={{ color: 'white' }}
              disabled={isLoading}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
              bg="#1a1a1a"
              border="2px solid"
              borderColor={COLORS.primary}
              color="white"
              _placeholder={{ color: 'white' }}
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />

            <Button
              w="100%"
              size="lg"
              background={COLORS.primary}
              color="white"
              onClick={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>

            <Text color={COLORS.text.secondary} fontSize="sm" textAlign="center">
              Don't have an account?{' '}
              <Text
                as="span"
                color={COLORS.primary}
                fontWeight="semibold"
                cursor="pointer"
                onClick={() => navigate('/auth/register')}
                _hover={{ textDecoration: 'underline' }}
              >
                Register here
              </Text>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}