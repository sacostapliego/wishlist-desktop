import { Box, HStack, VStack, Heading, Text, Avatar, IconButton } from '@chakra-ui/react'
import { LuArrowLeft, LuEllipsisVertical } from 'react-icons/lu'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWishlistIcon } from '../../utils/wishlistIcons'
import { COLORS } from '../../styles/common'
import { API_URL } from '../../services/api'
import { WishlistMenu, getOwnerMenuOptions } from './WishlistMenu'

interface OwnerWishlistViewProps {
  wishlist: {
    id: string
    title: string
    owner: string
    description?: string
    color?: string
    image?: string
    item_count?: number
    updated_at?: string
    created_at?: string
    owner_id?: string
  }
}

export function OwnerWishlistView({ wishlist }: OwnerWishlistViewProps) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const IconComponent = getWishlistIcon(wishlist.image)
  const profileImage = wishlist.owner_id ? `${API_URL}users/${wishlist.owner_id}/profile-image` : null

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

  const menuOptions = getOwnerMenuOptions({
    onEdit: () => console.log('Edit wishlist'),
    onSelectItems: () => console.log('Select items'),
    onShare: () => console.log('Share wishlist'),
    onDelete: () => console.log('Delete wishlist'),
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
        >
          <LuEllipsisVertical />
        </IconButton>
      </HStack>

      <HStack align="flex-end" gap={6}>
        {/* Wishlist Icon */}
        <Box
          w={{ base: "9rem", md: "13rem", lg: "15rem", '2xl': "17rem" }}
          h={{ base: "9rem", md: "13rem", lg: "15rem", '2xl': "17rem" }}
          borderRadius="md"
          bg={wishlist.color || COLORS.cardGray}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          boxShadow="0 4px 60px rgba(0,0,0,0.5)"
        >
          <Box as={IconComponent} boxSize={{ base: "5rem", md: "6rem", lg: "8rem", '2xl': "10rem" }} color="white" />
        </Box>

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
            <Text color={COLORS.text.secondary} fontSize="sm" mt={2}>
              {wishlist.description}
            </Text>
          )}

          <HStack gap={2} color={COLORS.text.secondary} fontSize="sm" mt={2}>
            <Avatar.Root size="xs">
              <Avatar.Fallback name={wishlist.owner} />
              <Avatar.Image src={profileImage || undefined} />
            </Avatar.Root>
            <Text fontWeight="semibold" color="white">
              {wishlist.owner}
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