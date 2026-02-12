import { Box, VStack, Heading, Text, IconButton, HStack, Image } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { LuArrowLeft, LuSettings } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { COLORS } from '../styles/common'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../services/api'
import { SizeCards } from '../components/profile/SizeCards'
import userAPI, { type PublicUserDetailsResponse } from '../services/user'
import { toaster } from '../components/ui/toaster'
import { friendsAPI, type FriendWishlistResponse } from '../services/friends'
import { WishlistCarousel } from '../components/home/WishlistCarousel'

function ProfilePage() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId?: string }>()
  const { user } = useAuth()
  const [publicUser, setPublicUser] = useState<PublicUserDetailsResponse | null>(null)
  const [friendWishlists, setFriendWishlists] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const isSelf = !userId || userId === user?.id

  useEffect(() => {
    if (!isSelf && userId) {
      loadPublicUser(userId)
      loadFriendWishlists(userId)
    }
  }, [userId, isSelf])

  const loadFriendWishlists = async (ownerId: string) => {
  try {
    // Get all saved wishlists, then filter by owner
    const allWishlists = await friendsAPI.getFriendsWishlists()
    
    // Filter to only show wishlists from this specific owner
    const ownerWishlists = allWishlists.filter((w: FriendWishlistResponse) => 
      w.owner_id === ownerId
    )
    
    const transformed = ownerWishlists.map((w: FriendWishlistResponse) => ({
      id: w.id,
      name: w.title,
      ownerName: w.owner_name || w.owner_username,
      image: w.image,
      color: w.color
    }))
    
    setFriendWishlists(transformed)
  } catch (error) {
    console.error('Error loading friend wishlists:', error)
  }
}

  const loadPublicUser = async (id: string) => {
    try {
      setLoading(true)
      const userData = await userAPI.getPublicUserDetails(id)
      setPublicUser(userData)
    } catch (error) {
      console.error('Error loading user profile:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to load user profile',
        type: 'error',
      })
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  if (loading || (!isSelf && !publicUser)) {
    return (
      <Box h="calc(100vh - 32px)" w="100%" display="flex" alignItems="center" justifyContent="center">
        <Text color="white">Loading...</Text>
      </Box>
    )
  }

  if (!isSelf && !publicUser) {
    return (
      <Box h="calc(100vh - 32px)" w="100%" display="flex" alignItems="center" justifyContent="center">
        <Text color="white">User not found</Text>
      </Box>
    )
  }

  const target = isSelf ? user : publicUser
  
  if (!target) {
    return (
      <Box h="calc(100vh - 32px)" w="100%" display="flex" alignItems="center" justifyContent="center">
        <Text color="white">Loading...</Text>
      </Box>
    )
  }

  const profileImage = target.id ? `${API_URL}users/${target.id}/profile-image` : null
  const displayName = target.name || target.username

  const sizeValues = {
    shoe_size: target.shoe_size,
    shirt_size: target.shirt_size,
    pants_size: target.pants_size,
    hat_size: target.hat_size,
    ring_size: target.ring_size,
    dress_size: target.dress_size,
    jacket_size: target.jacket_size,
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

          {isSelf && (
            <IconButton
              aria-label="Settings"
              variant="ghost"
              onClick={() => navigate('/settings')}
              color="white"
              size="lg"
            >
              <LuSettings />
            </IconButton>
          )}
        </HStack>
      </Box>

      {/* Profile Content */}
      <VStack gap={6} px={8} py={8} align="stretch">
        {/* Profile Image and User Info */}
        <VStack gap={4}>
          {/* Profile Image */}
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            overflow="hidden"
            bg={COLORS.cardGray}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt={displayName}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            ) : (
              <Text color={COLORS.text.secondary} fontSize="4xl" fontWeight="bold">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
          </Box>

          {/* User Info */}
          <VStack gap={1}>
            <Heading size="xl" color="white">
              {displayName}
            </Heading>
            <Text color={COLORS.text.secondary} fontSize="lg">
              @{target.username}
            </Text>
          </VStack>
        </VStack>

        {/* Sizes Section */}
        {Object.values(sizeValues).some(value => value) && (
          <Box>
            <Text 
              fontSize="lg" 
              fontWeight="semibold" 
              color="white" 
              mb={3}
            >
              Sizes
            </Text>
            <SizeCards values={sizeValues} />
          </Box>
        )}

        {!isSelf && friendWishlists.length > 0 && (
          <Box>
            <WishlistCarousel 
              title={`Saved Lists`}
              wishlists={friendWishlists}
              onWishlistClick={(id) => navigate(`/wishlist/${id}`)}
            />
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default ProfilePage