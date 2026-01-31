import { Box, VStack } from '@chakra-ui/react'
import { ClaimedItemsSection } from '../components/home/ClaimedItemSection'
import { WishlistCarousel } from '../components/home/WishlistCarousel'
import { useEffect, useState } from 'react'
import { wishlistAPI } from '../services/wishlist'
import { friendsAPI, type FriendWishlistResponse } from '../services/friends'
import { toaster } from '../components/ui/toaster'

interface Wishlist {
  id: string
  name: string
  image?: string
  color?: string
}

interface ClaimedItem {
  id: number
  name: string
  friendName: string
  image: string
}

function HomePage() {
  const [myWishlists, setMyWishlists] = useState<Wishlist[]>([])
  const [friendsWishlists, setFriendsWishlists] = useState<Wishlist[]>([])
  const [claimedItems, setClaimedItems] = useState<ClaimedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [myWishlistsData, friendsWishlistsData] = await Promise.all([
        wishlistAPI.getWishlists(),
        friendsAPI.getFriendsWishlists()
      ])

      // Transform my wishlists data
      const transformedMyWishlists = myWishlistsData.map((wishlist: any) => ({
        id: wishlist.id,
        name: wishlist.title,
        image: wishlist.image,
        color: wishlist.color
      }))

      // Transform friends wishlists data
      const transformedFriendsWishlists = friendsWishlistsData.map((wishlist: FriendWishlistResponse) => ({
        id: wishlist.id,
        name: wishlist.title,
        ownerName: wishlist.owner_name || wishlist.owner_username,
        image: wishlist.image,
        color: wishlist.color
      }))

      setMyWishlists(transformedMyWishlists)
      setFriendsWishlists(transformedFriendsWishlists)

      // TODO: Load claimed items from API when endpoint is available
      setClaimedItems([])

    } catch (error) {
      console.error('Error loading data:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to load wishlists',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Box h="calc(100vh - 32px)" w="100%" display="flex" alignItems="center" justifyContent="center">
        {/* Add loading spinner here if desired */}
      </Box>
    )
  }

  return (
    <Box h="calc(100vh - 32px)" w="100%" overflowX="visible" py={8}>
      <VStack align="stretch">
        {/* Claimed Items Section */}
        {claimedItems.length > 0 && (
          <ClaimedItemsSection 
            items={claimedItems}
            onShowAll={() => console.log('Show all claimed items')}
          />
        )}

        {/* My Wishlists Carousel */}
        {myWishlists.length > 0 && (
          <WishlistCarousel 
            title="My Lists" 
            wishlists={myWishlists}
            onShowAll={() => console.log('Show all my wishlists')}
            onWishlistClick={(id) => console.log('Clicked wishlist:', id)}
          />
        )}

        {/* Friends Wishlists Carousel */}
        {friendsWishlists.length > 0 && (
          <WishlistCarousel 
            title="Friends Lists" 
            wishlists={friendsWishlists}
            onShowAll={() => console.log('Show all friends wishlists')}
            onWishlistClick={(id) => console.log('Clicked friend wishlist:', id)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default HomePage