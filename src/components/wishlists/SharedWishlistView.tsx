import { Box, HStack, VStack, Heading, Text, Avatar } from '@chakra-ui/react'
import { getWishlistIcon } from '../../utils/wishlistIcons'
import { COLORS } from '../../styles/common'
import { API_URL } from '../../services/api'

interface SharedWishlistViewProps {
  wishlist: {
    id: string
    title: string
    owner_name: string
    owner_id: string
    description?: string
    color?: string
    image?: string
    item_count?: number
    updated_at?: string
    created_at?: string
  }
}

export function SharedWishlistView({ wishlist }: SharedWishlistViewProps) {
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

  return (
    <Box bg={wishlist.color || COLORS.cardGray} px={8} py={6}>
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
          <Text fontSize="sm" fontWeight="semibold" color={COLORS.text.secondary}>
            Shared Wishlist
          </Text>
          
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
              <Avatar.Fallback name={wishlist.owner_name} />
              <Avatar.Image src={profileImage || undefined} />
            </Avatar.Root>
            <Text fontWeight="semibold" color="white">
              {wishlist.owner_name}
            </Text>
            <Text>•</Text>
            <Text>
              {wishlist.item_count || 0} {wishlist.item_count === 1 ? 'item' : 'items'}</Text>
            <Text>•</Text>
            <Text>Last updated {formatDate(wishlist.updated_at || wishlist.created_at)}</Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  )
}