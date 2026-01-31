import { Box, VStack } from '@chakra-ui/react'
import { ClaimedItemsSection } from '../components/home/ClaimedItemSection'
import { WishlistCarousel } from '../components/home/WishlistCarousel'

// Mock data - replace with actual data later
const myWishlists = [
  { id: 1, name: 'Birthday Wishlist', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 2, name: 'Christmas 2026', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 3, name: 'Gaming Setup', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 4, name: 'Books to Read', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 5, name: 'Travel Essentials', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 6, name: 'Fitness Gear', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 7, name: 'Home Decor Ideas', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 8, name: 'Tech Gadgets', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
]

const friendsWishlists = [
  { id: 1, name: "John's Birthday", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 2, name: "Sarah's Wedding", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 3, name: "Mike's Wishlist", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 4, name: "Emma's Travel Plans", image: 'https://media.cnn.com/api/v1/images/stellar/prod/220323041553-01-trae-young-03222022.jpg?c=original' },
]

const claimedItems = [
  { id: 1, name: 'Wireless Headphones', friendName: "John Doe", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 2, name: 'Coffee Maker', friendName: "Sarah Smith", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 3, name: 'Gaming Mouse', friendName: "Mike Johnson", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 4, name: 'Book Collection', friendName: "Emma Wilson", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
  { id: 5, name: 'Smartwatch', friendName: "David Brown", image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277905.png&w=350&h=254' },
]

function HomePage() {
  return (
    <Box h="100%" w="100%" bg="#141414" overflowX="hidden" py={8}>
      <VStack align="stretch">
        {/* Claimed Items Section */}
        <ClaimedItemsSection 
          items={claimedItems}
          onShowAll={() => console.log('Show all claimed items')}
        />

        {/* My Wishlists Carousel */}
        <WishlistCarousel 
          title="My Lists" 
          wishlists={myWishlists}
          onShowAll={() => console.log('Show all my wishlists')}
          onWishlistClick={(id) => console.log('Clicked wishlist:', id)}
        />

        {/* Friends Wishlists Carousel */}
        <WishlistCarousel 
          title="Friends Lists" 
          wishlists={friendsWishlists}
          onShowAll={() => console.log('Show all friends wishlists')}
          onWishlistClick={(id) => console.log('Clicked friend wishlist:', id)}
        />

      </VStack>
    </Box>
  )
}

export default HomePage