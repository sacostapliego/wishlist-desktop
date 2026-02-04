import { Box, SimpleGrid, Image, Text, VStack, HStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { COLORS } from '../../styles/common'
import { API_URL } from '../../services/api'
import getLightColor from '../common/getLightColor'

export type SortOption = 'none' | 'price-low' | 'price-high' | 'priority-high'

export interface WishlistItem {
  id: string
  name: string
  image?: string
  price?: number
  priority: number
  created_at?: string
}

interface WishlistItemViewProps {
  items: WishlistItem[]
  onItemClick?: (item: WishlistItem) => void
  wishlistColor?: string
  sortBy?: SortOption
}

const getPriorityValue = (priority?: string | number): number => {
  if (priority === undefined || priority === null) return 2
  const parsed = parseInt(priority.toString(), 10)
  return !isNaN(parsed) && parsed >= 0 && parsed <= 4 ? parsed : 2
}


const getPriorityColor = (baseColor: string, priority?: number): string => {
  const priorityValue = getPriorityValue(priority)
  
  // Adjust opacity based on priority (0=lowest, 4=highest)
  const opacityMap: { [key: number]: number } = {
    0: 0.3,  // Very low
    1: 0.5,  // Low
    2: 0.7,  // Medium
    3: 0.85, // High
    4: 1.0   // Very high
  }
  
  const opacity = opacityMap[priorityValue] || 0.7
  
  // Convert hex to rgba
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
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



export function SimpleGridView({ 
  items, 
  onItemClick, 
  wishlistColor,
  sortBy = 'none'
}: WishlistItemViewProps) {
  const sortedItems = useMemo(() => {
    const itemsCopy = [...items]
    
    switch (sortBy) {
      case 'price-high':
        return itemsCopy.sort((a, b) => (b.price || 0) - (a.price || 0))
      case 'price-low':
        return itemsCopy.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'priority-high':
        return itemsCopy.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority))
      default:
        return itemsCopy
    }
  }, [items, sortBy])

  const backgroundLightColor = getLightColor(wishlistColor || COLORS.cardGray);


  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4} px={8} py={4}>
      {sortedItems.map((item) => {
        const hasImage = item.id && item.image
        const baseWishlistColor = wishlistColor || COLORS.cardGray
        
        const itemBackgroundColor = sortBy === 'priority-high' 
          ? getPriorityColor(baseWishlistColor, item.priority)
          : baseWishlistColor

        return (
          <Box
            key={item.id}
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            onClick={() => onItemClick?.(item)}
            bg={itemBackgroundColor}
          >
            {hasImage ? (
              <>
                <Box
                  w="100%"
                  aspectRatio={1}
                  bg={backgroundLightColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Image
                    src={`${API_URL}wishlist/${item.id}/image`}
                    alt={item.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                </Box>
                <VStack align="start" p={3} gap={1}>
                  <Text color="white" fontWeight="semibold" fontSize="sm" lineClamp={2}>
                    {item.name}
                  </Text>
                  <HStack justify="space-between" w="100%">
                    {item.price !== undefined && item.price !== null && (
                      <Text color={COLORS.text.secondary} fontSize="sm" fontWeight="bold">
                        ${item.price.toFixed(2)}
                      </Text>
                    )}
                    <Text color={COLORS.text.muted} fontSize="xs">
                      {formatDate(item.created_at)}
                    </Text>
                  </HStack>
                </VStack>
              </>
            ) : (
              <VStack align="start" p={4} gap={2} minH="150px" justify="space-between">
                <Text color="white" fontWeight="semibold" fontSize="md" lineClamp={3}>
                  {item.name}
                </Text>
                <VStack align="start" gap={1} w="100%">
                  {item.price !== undefined && item.price !== null && (
                    <Text color={COLORS.text.secondary} fontSize="sm" fontWeight="bold">
                      ${item.price.toFixed(2)}
                    </Text>
                  )}
                  <Text color={COLORS.text.muted} fontSize="xs">
                    {formatDate(item.created_at)}
                  </Text>
                </VStack>
              </VStack>
            )}
          </Box>
        )
      })}
    </SimpleGrid>
  )
}