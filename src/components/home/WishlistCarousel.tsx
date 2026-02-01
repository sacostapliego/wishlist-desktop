import { Box, Heading, HStack, Button, Text } from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useRef, useState } from 'react'
import { COLORS } from '../../styles/common'
import { getWishlistIcon } from '../../utils/wishlistIcons'

interface Wishlist {
  id: string
  name: string
  image?: string
  color?: string
}

interface WishlistCarouselProps {
  title: string
  wishlists: Wishlist[]
  onShowAll?: () => void
  onWishlistClick?: (wishlistId: string) => void
}

export function WishlistCarousel({ title, wishlists, onShowAll, onWishlistClick }: WishlistCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Box mb={{base: 8, md:2}}>
      <HStack justifyContent="space-between" px={8} >
        <Heading size="lg" color="white">{title}</Heading>
        <Button color={COLORS.text.muted} bg={COLORS.background} fontWeight={"bolder"} fontSize="sm" onClick={onShowAll}>
          Show all
        </Button>
      </HStack>
      
      <Box 
        position="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => scroll('left')}
          bg="rgba(0,0,0,0.7)"
          _hover={{ bg: 'rgba(0,0,0,0.9)' }}
          color="white"
          borderRadius="full"
          size="sm"
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.2s"
          pointerEvents={isHovered ? 'auto' : 'none'}
        >
          <FaChevronLeft />
        </Button>

        <HStack
          ref={scrollRef}
          overflowX="auto"
          gap={4}
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none'
          }}
          pb={2}
          pl={8}
        >
          {wishlists.map((wishlist) => {
            const IconComponent = getWishlistIcon(wishlist.image)
            
            return (
              <Box
                key={wishlist.id}
                w={{base:"8rem", md:"10rem", lg:"14rem"}}
                h={{base:"10rem", md:"12rem", lg:"16rem"}}
                flexShrink={0}
                borderRadius="md"
                p={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: '#2a2a2a' }}
                onClick={() => onWishlistClick?.(wishlist.id)}
              >
                <Box 
                  h="80%" 
                  mb={3} 
                  overflow="hidden" 
                  borderRadius="md" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  bg={wishlist.color || COLORS.cardGray}
                >
                  <Box as={IconComponent} boxSize="80px" color="white" />
                </Box>
                <Box h="20%" display="flex" alignItems="center">
                  <Text color="white" fontWeight="semibold" fontSize="sm" lineClamp={2}>
                    {wishlist.name}
                  </Text>
                </Box>
              </Box>
            )
          })}
        </HStack>

        <Button
          position="absolute"
          right={0}
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => scroll('right')}
          bg="rgba(0,0,0,0.7)"
          _hover={{ bg: 'rgba(0,0,0,0.9)' }}
          color="white"
          borderRadius="full"
          size="sm"
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.2s"
          pointerEvents={isHovered ? 'auto' : 'none'}
        >
          <FaChevronRight />
        </Button>
      </Box>
    </Box>
  )
}