import { Box, Button, HStack, IconButton, Text } from '@chakra-ui/react'
import { getWishlistIcon } from '../../../utils/wishlistIcons'
import { COLORS } from '../../../styles/common'

interface WishlistItemProps {
  id: string
  title: string
  color?: string
  image?: string
  isCollapsed: boolean
  onClick: () => void
}

export function WishlistItem({ title, color, image, isCollapsed, onClick }: WishlistItemProps) {
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
    >
      <Box as={IconComponent} boxSize="18px" />
    </Box>
  )

  if (isCollapsed) {
    return (
      <IconButton
        aria-label={title}
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
    >
      <HStack>
        {iconBox}
        <Text fontSize="sm" truncate>
          {title}
        </Text>
      </HStack>
    </Button>
  )
}