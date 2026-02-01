import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { wishlistAPI } from '../services/wishlist'
import { useAuth } from '../context/AuthContext'
import { toaster } from '../components/ui/toaster'

interface Wishlist {
  id: string
  title: string
  owner_id: string
  is_public: boolean
}

function WishlistPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    if (id) {
      loadWishlist(id)
    }
  }, [id])

  const loadWishlist = async (wishlistId: string) => {
    try {
      setLoading(true)
      const data = await wishlistAPI.getWishlist(wishlistId)
      
      // Check access permissions
      const isOwner = data.owner_id === user?.id
      const isFriend = data.is_friend
      const isPublic = data.is_public

      if (!isOwner && !isFriend && !isPublic) {
        setAccessDenied(true)
      } else {
        setWishlist(data)
      }
    } catch (error: any) {
      console.error('Error loading wishlist:', error)
      if (error.response?.status === 403 || error.response?.status === 404) {
        setAccessDenied(true)
      } else {
        toaster.create({
          title: 'Error',
          description: 'Failed to load wishlist',
          type: 'error',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!id) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <Box h="calc(100vh - 32px)" w="100%" display="flex" alignItems="center" justifyContent="center">
        <Text color="white">Loading...</Text>
      </Box>
    )
  }

  if (accessDenied) {
    return (
      <Box h="calc(100vh - 32px)" w="100%" display="flex" alignItems="center" justifyContent="center" p={8}>
        <VStack gap={4}>
          <Heading size="lg" color="white">Private Wishlist</Heading>
          <Text color="gray.400" textAlign="center">
            This wishlist is private and only available to the owner.
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box h="calc(100vh - 32px)" w="100%" overflowX="visible" py={2}>
      <VStack align="stretch">
        <Heading color="white" px={8}>{wishlist?.title}</Heading>
        {/* Add your wishlist content here */}
      </VStack>
    </Box>
  )
}

export default WishlistPage