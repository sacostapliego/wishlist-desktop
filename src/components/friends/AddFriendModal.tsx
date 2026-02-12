import { Dialog } from '@chakra-ui/react'
import { Box, VStack, HStack, Input, Button, Text, Avatar } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import { useState } from 'react'
import { friendsAPI, type UserSearchResponse } from '../../services/friends'
import { COLORS } from '../../styles/common'
import { API_URL } from '../../services/api'
import { toaster } from '../ui/toaster'

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddFriendModal({ isOpen, onClose, onSuccess }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<UserSearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingFriend, setIsAddingFriend] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await friendsAPI.searchUsers(searchQuery.trim())
      setSearchResult(Array.isArray(results) && results.length > 0 ? results[0] : null)
      
      if (!results || (Array.isArray(results) && results.length === 0)) {
        toaster.create({
          title: 'Not found',
          description: 'User not found',
          type: 'info',
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to search for user',
        type: 'error',
      })
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddFriend = async () => {
    if (!searchResult?.id) return

    setIsAddingFriend(true)
    try {
      await friendsAPI.sendFriendRequest(searchResult.id)
      toaster.create({
        title: 'Success',
        description: 'Friend request sent!',
        type: 'success',
      })
      setSearchResult(null)
      setSearchQuery('')
      onSuccess()
    } catch (error) {
      console.error('Add friend error:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to send friend request',
        type: 'error',
      })
    } finally {
      setIsAddingFriend(false)
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    setSearchResult(null)
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Add Friend</Dialog.Title>
          </Dialog.Header>
          
          <Dialog.Body>
            <VStack align="stretch" gap={4}>
              <HStack>
                <Input
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  bg={COLORS.primary}
                  color={COLORS.text.primary}
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  <LuSearch />
                </Button>
              </HStack>

              {searchResult && (
                <Box
                  bg="#1a1a1a"
                  p={4}
                  borderRadius="lg"
                >
                  <HStack justify="space-between">
                    <HStack gap={3}>
                      <Avatar.Root size="md">
                        <Avatar.Fallback name={searchResult.name || searchResult.username} />
                        <Avatar.Image 
                          src={`${API_URL}users/${searchResult.id}/profile-image`} 
                        />
                      </Avatar.Root>
                      <VStack align="start" gap={0}>
                        <Text color="white" fontWeight="semibold">
                          {searchResult.name || searchResult.username}
                        </Text>
                        <Text color={COLORS.text.secondary} fontSize="sm">
                          @{searchResult.username}
                        </Text>
                      </VStack>
                    </HStack>
                    <Button
                      bg={COLORS.primary}
                      color={COLORS.text.primary}
                      size="sm"
                      onClick={handleAddFriend}
                      disabled={isAddingFriend}
                    >
                      {isAddingFriend ? 'Sending...' : 'Add Friend'}
                    </Button>
                  </HStack>
                </Box>
              )}
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}