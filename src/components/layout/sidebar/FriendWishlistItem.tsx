import { Box, Button, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { getWishlistIcon } from '../../../utils/wishlistIcons'
import { COLORS } from '../../../styles/common'

interface FriendWishlistItemProps {
  id: string
  title: string
  ownerName: string
  color?: string
  image?: string
  isCollapsed: boolean
  onClick: () => void
}

export function FriendWishlistItem({ 
  title, 
  ownerName, 
  color, 
  image, 
  isCollapsed, 
  onClick 
}: FriendWishlistItemProps) {
  const IconComponent = getWishlistIcon(image)

  const iconBox = (
    <Box
      w="28px"
      h="28px"
      borderRadius="sm"
      bg={color || COLORS.cardGray}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Box as={IconComponent} boxSize="18px" />
    </Box>
  )

  if (isCollapsed) {
    return (
      <IconButton
        aria-label={`${title} - ${ownerName}`}
        variant="ghost"
        onClick={onClick}
        w="100%"
      >
        {iconBox}
      </IconButton>
    )
  }

  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      onClick={onClick}
      size="sm"
      px={2}
      w="100%"
    >
      <HStack gap={2}>
        {iconBox}
        <VStack align="start" gap={0} flex={1} minW={0}>
          <Text fontSize="sm">{title}</Text>
          <Text fontSize="xs" color={COLORS.text.muted}>
            {ownerName}
          </Text>
        </VStack>
      </HStack>
    </Button>
  )
}