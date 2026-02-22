import { Box, VStack } from '@chakra-ui/react'
import { ClaimedItemsSection } from '../components/home/ClaimedItemSection'
import { WishlistCarousel } from '../components/home/WishlistCarousel'
import { useEffect, useState } from 'react'
import { wishlistAPI, type ClaimedItemResponse } from '../services/wishlist'
import { friendsAPI, type FriendWishlistResponse } from '../services/friends'
import { toaster } from '../components/ui/toaster'
import { useNavigate } from 'react-router-dom'
import { ProfileHeader } from '../components/layout/ProfileHeader'
import { COLORS } from '../styles/common'
import type { Wishlist as WishlistType } from '../types/types'

interface Wishlist {
  id: string
  name: string
  image?: string
  color?: string
  thumbnail_type?: 'icon' | 'image'
  thumbnail_icon?: string | null
  thumbnail_image?: string | null
}

interface ClaimedItem {
  id: string
  name: string
  price?: number
  image?: string
  owner_name: string
  color?: string
  wishlist_id?: string
}

function HomePage() {
  const navigate = useNavigate()
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
      const [myWishlistsData, friendsWishlistsData, claimedItemsData] = await Promise.all([
        wishlistAPI.getWishlists(),
        friendsAPI.getFriendsWishlists(),
        wishlistAPI.getClaimedItems()
      ])

      // Transform my wishlists data
      const transformedMyWishlists = myWishlistsData.map((wishlist: WishlistType) => ({
        id: wishlist.id,
        name: wishlist.title,
        image: wishlist.image,
        color: wishlist.color,
        thumbnail_type: wishlist.thumbnail_type,
        thumbnail_icon: wishlist.thumbnail_icon,
        thumbnail_image: wishlist.thumbnail_image,
      }))

      // Transform friends wishlists data
      const transformedFriendsWishlists = friendsWishlistsData.map((wishlist: FriendWishlistResponse) => ({
        id: wishlist.id,
        name: wishlist.title,
        ownerName: wishlist.owner_name || wishlist.owner_username,
        image: wishlist.image,
        color: wishlist.color,
        thumbnail_type: wishlist.thumbnail_type,
        thumbnail_icon: wishlist.thumbnail_icon,
        thumbnail_image: wishlist.thumbnail_image,
      }))

      // Transform claimed items data
      const transformedClaimedItems = claimedItemsData.map((item: ClaimedItemResponse) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        owner_name: item.owner_name,
        color: item.wishlist_color,
        wishlist_id: item.wishlist_id
      }))

      setMyWishlists(transformedMyWishlists)
      setFriendsWishlists(transformedFriendsWishlists)
      setClaimedItems(transformedClaimedItems)

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
        {/* Add loading spinner here */}
      </Box>
    )
  }

  return (
    <Box h={{base: "calc(100vh + 80px)", md:"calc(100vh - 32px)"}} w="100%" overflowX="visible" bg={COLORS.background} py={2}>
      <ProfileHeader />
      <VStack align="stretch">
        {/* Claimed Items Section */}
        {claimedItems.length > 0 && (
          <ClaimedItemsSection 
            items={claimedItems}
            onShowAll={() => navigate('/items/claimed')}
            onItemClick={(item) => navigate(`/wishlist/${item.wishlist_id}/${item.id}`)}
          />
        )}

        {/* Friends Wishlists Carousel */}
        {friendsWishlists.length > 0 && (
          <WishlistCarousel 
            title="Friends Lists" 
            wishlists={friendsWishlists}
            onShowAll={() => navigate('/wishlists/friends')}
            onWishlistClick={(id) => navigate(`/wishlist/${id}`)}
          />
        )}

        {/* My Wishlists Carousel */}
        {myWishlists.length > 0 && (
          <WishlistCarousel 
            title="My Lists" 
            wishlists={myWishlists}
            onShowAll={() => navigate('/wishlists/mine')}
            onWishlistClick={(id) => navigate(`/wishlist/${id}`)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default HomePage