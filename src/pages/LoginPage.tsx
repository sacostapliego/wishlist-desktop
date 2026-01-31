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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toaster.create({
        title: 'Error',
        description: 'Enter email and password.',
        type: 'error',
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await login(email, password)
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
    } catch (e: any) {
      let msg = 'Login failed.'
      if (e?.response?.data?.detail) msg = e.response.data.detail
      else if (typeof e?.message === 'string') msg = e.message
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
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              bg="#1a1a1a"
              border="2px solid"
              borderColor={COLORS.primary}
              color="white"
              _placeholder={{ color: 'white' }}
            //   _hover={{ borderColor: 'blue.500' }}
            //   _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
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
            //   _hover={{ borderColor: 'blue.500' }}
            //   _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />

            <Button
              w="100%"
              size="lg"
              background={COLORS.primary}
              color={'white'}
              onClick={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>

            <Text color={COLORS.background} fontSize="sm">
              Don't have an account?{' '}
              {/* <Text as={Link} to="/auth/register" color="blue.400" fontWeight="semibold" _hover={{ color: 'blue.300' }}>
                Register
              </Text> */}
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}