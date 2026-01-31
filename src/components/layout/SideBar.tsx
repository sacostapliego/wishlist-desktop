import { Box, VStack, HStack, Text, Button, Separator, IconButton, Avatar } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { LuHouse, LuPlus, LuUserRound } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { wishlistAPI } from '../../services/wishlist'
import { friendsAPI, type FriendWishlistResponse } from '../../services/friends'

interface Wishlist {
  id: string
  title: string
  color?: string
}

interface SidebarProps {
  isExpanded: boolean
  isCollapsed: boolean
  isHidden: boolean
  onToggle: () => void
}

export default function Sidebar({ isExpanded, isCollapsed, isHidden }: SidebarProps) {
  const navigate = useNavigate()
  const [myWishlists, setMyWishlists] = useState<Wishlist[]>([])
  const [friendsWishlists, setFriendsWishlists] = useState<FriendWishlistResponse[]>([])

  useEffect(() => {
    loadWishlists()
  }, [])

  const loadWishlists = async () => {
    try {
      const [mine, friends] = await Promise.all([
        wishlistAPI.getWishlists(),
        friendsAPI.getFriendsWishlists()
      ])
      setMyWishlists(mine)
      setFriendsWishlists(friends)
    } catch (error) {
      console.error('Error loading wishlists:', error)
    }
  }

  if (isHidden) return null

  return (
    <Box
      bg="#141414"
      h="100%"
      overflowY="auto"
      p={isCollapsed ? 2 : 4}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
    >
      {/* User Profile Section */}
      <Box mb={4}>
        {isExpanded ? (
          <Button
            variant="ghost"
            justifyContent="flex-start"
            onClick={() => navigate('/profile')}
            w="100%"
            h="auto"
          >
            <HStack gap={3}>
              <LuUserRound  />
              <VStack align="stretch">
                <Text fontSize="sm" fontWeight="semibold">
                  Steven Acosta
                </Text>
              </VStack>
            </HStack>
          </Button>
        ) : (
          <IconButton
            aria-label="Profile"
            variant="ghost"
            onClick={() => navigate('/profile')}
            w="100%"
          >
            <LuUserRound  />
          </IconButton>
        )}
      </Box>

      <Separator mb={4} />

      <VStack align="stretch" gap={4} flex="1">
        {/* Top Buttons */}
        <VStack align="stretch" gap={2}>
          {isExpanded ? (
            <>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => navigate('/')}
              >
                <HStack>
                  <LuHouse />
                  <Text>Home</Text>
                </HStack>
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => navigate('/create')}
              >
                <HStack>
                  <LuPlus />
                  <Text>Create</Text>
                </HStack>
              </Button>
            </>
          ) : (
            <>
              <IconButton
                aria-label="Home"
                variant="ghost"
                onClick={() => navigate('/')}
              >
                <LuHouse />
              </IconButton>
              <IconButton
                aria-label="Create"
                variant="ghost"
                onClick={() => navigate('/create')}
              >
                <LuPlus />
              </IconButton>
            </>
          )}
        </VStack>

        {isExpanded && (
          <>
            <Separator />

            {/* My Wishlists */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2} px={2} color="fg.muted">
                My Wishlists
              </Text>
              <VStack align="stretch" gap={1}>
                {myWishlists.map((wishlist) => (
                  <Button
                    key={wishlist.id}
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => navigate(`/wishlist/${wishlist.id}`)}
                    size="sm"
                    px={2}
                  >
                    <HStack>
                      {wishlist.color && (
                        <Box
                          w="12px"
                          h="12px"
                          borderRadius="sm"
                          bg={wishlist.color}
                        />
                      )}
                      <Text fontSize="sm" truncate>
                        {wishlist.title}
                      </Text>
                    </HStack>
                  </Button>
                ))}
              </VStack>
            </Box>

            <Separator />

            {/* Friends' Wishlists */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2} px={2} color="fg.muted">
                Friends' Wishlists
              </Text>
              <VStack align="stretch" gap={1}>
                {friendsWishlists.map((wishlist) => (
                  <Button
                    key={wishlist.id}
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => navigate(`/wishlist/friend/${wishlist.id}`)}
                    size="sm"
                    px={2}
                  >
                    <VStack align="start" gap={0}>
                      <Text fontSize="sm" truncate>
                        {wishlist.title}
                      </Text>
                      <Text fontSize="xs" color="fg.muted" truncate>
                        {wishlist.owner_name || wishlist.owner_username}
                      </Text>
                    </VStack>
                  </Button>
                ))}
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  )
}