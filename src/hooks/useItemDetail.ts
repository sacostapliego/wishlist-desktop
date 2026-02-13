import { useState, useEffect, useCallback } from 'react'
import { wishlistAPI } from '../services/wishlist'
import { friendsAPI } from '../services/friends'
import { userAPI } from '../services/user'
import { COLORS } from '../styles/common'

interface ItemDetail {
  id: string
  name: string
  description?: string
  price?: number
  url?: string
  image?: string
  wishlist_id: string
  priority?: number
  created_at?: string
  updated_at?: string
}

interface WishlistInfo {
  name: string
  ownerName: string
}

export const useItemDetail = (
  itemId: string | undefined,
  wishlistId: string | undefined,
  isPublicView: boolean = false
) => {
  const [item, setItem] = useState<ItemDetail | null>(null)
  const [wishlistColor, setWishlistColor] = useState<string>('')
  const [wishlistInfo, setWishlistInfo] = useState<WishlistInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  const fetchData = useCallback(async () => {
    if (!itemId || !wishlistId) {
      setError('Item ID or Wishlist ID is missing.')
      setIsLoading(false)
      setItem(null)
      setWishlistColor('')
      setWishlistInfo(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setItem(null)
    setWishlistColor('')
    setWishlistInfo(null)

    try {
      if (isPublicView) {
        const publicWishlist = await wishlistAPI.getPublicWishlist(wishlistId)

        if (!publicWishlist) {
          setError('Wishlist not found or is not public.')
          setIsLoading(false)
          return
        }

        setWishlistColor(publicWishlist.color || COLORS.cardGray)

        // Extract owner name, fallback to fetching public profile
        let ownerName = publicWishlist.owner_name || publicWishlist.owner_username
        const ownerId = publicWishlist.user_id || publicWishlist.owner_id

        if (!ownerName && ownerId) {
          try {
            const ownerProfile = await userAPI.getPublicUserDetails(ownerId)
            ownerName = ownerProfile.name || ownerProfile.username || 'Unknown'
          } catch (profileError) {
            console.error('Failed to fetch owner profile:', profileError)
            ownerName = 'Unknown'
          }
        }

        setWishlistInfo({
          name: publicWishlist.title || publicWishlist.wishlist_name || 'Wishlist',
          ownerName: ownerName || 'Unknown'
        })

        const publicItems = await wishlistAPI.getPublicWishlistItems(wishlistId)
        const foundItem = publicItems.find((i: any) => i.id === itemId)

        if (foundItem) {
          setItem(foundItem)
          setIsOwner(false)
        } else {
          setError('Item not found in this public wishlist.')
        }
      } else {
        const myWishlists = await wishlistAPI.getWishlists()
        const isMyWishlist = myWishlists.some((w: any) => w.id === wishlistId)

        if (isMyWishlist) {
          setIsOwner(true)

          const [fetchedItem, fetchedWishlist] = await Promise.all([
            wishlistAPI.getWisihlistItem(itemId),
            wishlistAPI.getWishlist(wishlistId)
          ])

          if (fetchedItem) {
            setItem(fetchedItem)
          } else {
            setError('Item not found.')
          }

          setWishlistColor(fetchedWishlist?.color || COLORS.cardGray)
          setWishlistInfo(null)
        } else {
          setIsOwner(false)

          let color = COLORS.cardGray
          let wishlistName = 'Wishlist'
          let ownerName = 'Unknown'
          let ownerId: string | undefined

          const friendsWishlists = await friendsAPI.getFriendsWishlists()
          const friendWishlist = friendsWishlists.find((w: any) => w.id === wishlistId)

          if (friendWishlist) {
            color = friendWishlist.color || COLORS.cardGray
            wishlistName = friendWishlist.title || 'Wishlist'
            ownerName = friendWishlist.owner_name || 'Unknown'
            ownerId = friendWishlist.owner_id
          }

          try {
            const publicWishlist = await wishlistAPI.getPublicWishlist(wishlistId)
            if (publicWishlist?.color) {
              color = publicWishlist.color
            }
            if (publicWishlist?.title || publicWishlist?.wishlist_name) {
              wishlistName = publicWishlist.title || publicWishlist.wishlist_name
            }
            
            // Extract owner name from public wishlist, or fetch profile
            let extractedOwnerName = publicWishlist.owner_name || publicWishlist.owner_username
            const extractedOwnerId = publicWishlist.user_id || publicWishlist.owner_id

            if (!extractedOwnerName && extractedOwnerId) {
              try {
                const ownerProfile = await userAPI.getPublicUserDetails(extractedOwnerId)
                extractedOwnerName = ownerProfile.name || ownerProfile.username || 'Unknown'
              } catch (profileError) {
                console.error('Failed to fetch owner profile:', profileError)
                extractedOwnerName = 'Unknown'
              }
            }

            if (extractedOwnerName) {
              ownerName = extractedOwnerName
            }
            if (extractedOwnerId) {
              ownerId = extractedOwnerId
            }

            const publicItems = await wishlistAPI.getPublicWishlistItems(wishlistId)
            const foundItem = publicItems.find((i: any) => i.id === itemId)

            setWishlistColor(color)
            setWishlistInfo({ name: wishlistName, ownerName })

            if (foundItem) {
              setItem(foundItem)
            } else {
              setError('Item not found in this wishlist.')
            }
          } catch (publicError: any) {
            console.error('Error fetching public wishlist items:', publicError)
            if (publicError.response?.status === 403) {
              setError('Access denied. This wishlist is private.')
            } else if (publicError.response?.status === 404) {
              setError('Wishlist not found.')
            } else {
              setError('Failed to load item details.')
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch item details:', err)
      let specificError = 'Failed to load item details.'

      if (err.response?.status === 401 || err.response?.status === 403) {
        specificError = 'Access denied. You may need to be logged in or the content is private.'
      } else if (err.response?.data?.detail) {
        specificError = typeof err.response.data.detail === 'string'
          ? err.response.data.detail
          : specificError
      }

      setError(specificError)
    } finally {
      setIsLoading(false)
    }
  }, [itemId, wishlistId, isPublicView])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { item, wishlistColor, wishlistInfo, isLoading, error, isOwner, refetchItemData: fetchData, refetchData: fetchData }
}