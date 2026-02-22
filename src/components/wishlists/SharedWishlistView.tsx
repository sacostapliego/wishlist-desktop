import { Box, HStack, VStack, Heading, Text, Avatar, IconButton } from '@chakra-ui/react'
import { LuArrowLeft, LuEllipsisVertical } from 'react-icons/lu'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../styles/common'
import { API_URL } from '../../services/api'
import { WishlistMenu, getSharedMenuOptions } from './WishlistMenu'
import { friendsAPI } from '../../services/friends'
import { useAuth } from '../../context/AuthContext'
import { WishlistThumbnail } from './WishlistThumbnail'

interface SharedWishlistViewProps {
  wishlist: {
    id: string
    title: string
    owner_name: string
    owner_id: string
    description?: string
    color?: string
    image?: string
    thumbnail_type?: 'icon' | 'image'
    thumbnail_icon?: string | null
    thumbnail_image?: string | null
    item_count?: number
    updated_at?: string
    created_at?: string
  }
}

export function SharedWishlistView({ wishlist }: SharedWishlistViewProps) {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const profileImage = wishlist.owner_id ? `${API_URL}users/${wishlist.owner_id}/profile-image` : null

  useEffect(() => {
    checkRelationship()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist.id, wishlist.owner_id, user?.id, isLoggedIn])

  const checkRelationship = async () => {
    // Skip relationship checks for guests
    if (!isLoggedIn || !wishlist?.owner_id || !user?.id) {
      setLoading(false)
      return
    }

    // Don't show add friend for own wishlist
    if (wishlist.owner_id === user.id) {
      setIsFriend(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Check friendship status
      const friendsWishlists = await friendsAPI.getFriendsWishlists()
      const isAlreadyFriend = friendsWishlists.some(w => w.owner_id === wishlist.owner_id)
      setIsFriend(isAlreadyFriend)

      // Check if wishlist is saved
      try {
        const savedStatus = await friendsAPI.checkWishlistSaved(wishlist.id)
        setIsSaved(savedStatus.is_saved)
      } catch (error) {
        console.error('Error checking saved status:', error)
        setIsSaved(false)
      }
    } catch (error) {
      console.error('Error checking friendship status:', error)
      setIsFriend(false)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  const menuOptions = isLoggedIn 
    ? getSharedMenuOptions({
        onAddFriend: !isFriend ? () => console.log('Add friend') : undefined,
        onSaveWishlist: !isSaved ? () => console.log('Save wishlist') : undefined,
        onRemoveSaved: isSaved ? () => console.log('Remove saved wishlist') : undefined,
      })
    : getSharedMenuOptions({
        onCreateAccount: () => navigate('/auth/register'),
        onSignIn: () => navigate('/auth/login'),
      })

  return (
    <Box bg={wishlist.color || COLORS.cardGray} px={8} py={6}>
      {/* Header with back button and menu */}
      <HStack justify="space-between" mb={4}>
        <IconButton
          aria-label="Go back"
          variant="ghost"
          onClick={() => navigate(-1)}
          color="white"
          size="lg"
        >
          <LuArrowLeft />
        </IconButton>

        <IconButton
          aria-label="Menu"
          variant="ghost"
          onClick={() => setIsMenuOpen(true)}
          color="white"
          size="lg"
          disabled={loading}
        >
          <LuEllipsisVertical />
        </IconButton>
      </HStack>

      <HStack align="flex-end" gap={6}>
        {/* Wishlist Icon */}
        <WishlistThumbnail
          wishlist={wishlist}
          boxSize={{ base: "9rem", md: "13rem", lg: "15rem", '2xl': "17rem" }}
          iconSize={{ base: "5rem", md: "6rem", lg: "8rem", '2xl': "10rem" }}
          sx={{ boxShadow: '0 4px 60px rgba(0,0,0,0.5)' }}
          showBackground={false}
        />

        {/* Wishlist Info */}
        <VStack align="start" gap={2} pb={4}>
          <Heading 
            size={{ base: "2xl", md: "3xl", lg: "4xl" }} 
            color="white"
            lineHeight="1.2"
            wordBreak="break-word"
          >
            {wishlist.title}
          </Heading>
          
          {wishlist.description && (
            <Text color={COLORS.text.secondary} fontSize="sm" mt={2} lineClamp={1}>
              {wishlist.description}
            </Text>
          )}

          <HStack gap={2} color={COLORS.text.secondary} fontSize="sm" mt={2}>
            <Avatar.Root 
              size="xs"
              cursor="pointer"
              onClick={() => navigate(`/profile/${wishlist.owner_id}`)}
            >
              <Avatar.Fallback name={wishlist.owner_name} />
              <Avatar.Image src={profileImage || undefined} />
            </Avatar.Root>
            <Text fontWeight="semibold" color="white" cursor="pointer" onClick={() => navigate(`/profile/${wishlist.owner_id}`)}>
              {wishlist.owner_name}
            </Text>
            <Text display={{ base: 'none', md: 'block' }}>•</Text>
            <Text display={{ base: 'none', md: 'block' }}>
              {wishlist.item_count || 0} {wishlist.item_count === 1 ? 'item' : 'items'}
            </Text>
            <Text display={{ base: 'none', md: 'block' }}>•</Text>
            <Text display={{ base: 'none', md: 'block' }}>Last updated {formatDate(wishlist.updated_at || wishlist.created_at)}</Text>
          </HStack>
        </VStack>
      </HStack>

      <WishlistMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        options={menuOptions}
      />
    </Box>
  )
}