import { useState, useEffect, useCallback } from 'react'
import { wishlistAPI } from '../services/wishlist'
import { friendsAPI } from '../services/friends'
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

export const useItemDetail = (
  itemId: string | undefined,
  wishlistId: string | undefined,
  isPublicView: boolean = false
) => {
  const [item, setItem] = useState<ItemDetail | null>(null)
  const [wishlistColor, setWishlistColor] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  const fetchData = useCallback(async () => {
    if (!itemId || !wishlistId) {
      setError('Item ID or Wishlist ID is missing.')
      setIsLoading(false)
      setItem(null)
      setWishlistColor('')
      return
    }

    setIsLoading(true)
    setError(null)
    setItem(null)
    setWishlistColor('')

    try {
      if (isPublicView) {
        // Public view: Fetch public wishlist and find item in public items
        const publicWishlist = await wishlistAPI.getPublicWishlist(wishlistId)

        if (!publicWishlist) {
          setError('Wishlist not found or is not public.')
          setIsLoading(false)
          return
        }

        setWishlistColor(publicWishlist.color || COLORS.cardGray)

        const publicItems = await wishlistAPI.getPublicWishlistItems(wishlistId)
        const foundItem = publicItems.find((i: any) => i.id === itemId)

        if (foundItem) {
          setItem(foundItem)
          setIsOwner(false)
        } else {
          setError('Item not found in this public wishlist.')
        }
      } else {
        // Authenticated view: Check if it's user's wishlist or someone else's
        const myWishlists = await wishlistAPI.getWishlists()
        const isMyWishlist = myWishlists.some((w: any) => w.id === wishlistId)

        if (isMyWishlist) {
          // Owner's wishlist - use getWisihlistItem (direct item fetch) + getWishlist for color
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
        } else {
          // Not owner: treat as public/shared wishlist
          // Use the same approach as React Native: getPublicWishlist + getPublicWishlistItems
          setIsOwner(false)

          // First get the color from friends wishlists or public wishlist
          let color = COLORS.cardGray

          const friendsWishlists = await friendsAPI.getFriendsWishlists()
          const friendWishlist = friendsWishlists.find((w: any) => w.id === wishlistId)

          if (friendWishlist) {
            color = friendWishlist.color || COLORS.cardGray
          }

          // Fetch items using the public endpoint (same as React Native useItemDetail with isPublicView=true)
          try {
            const publicWishlist = await wishlistAPI.getPublicWishlist(wishlistId)
            if (publicWishlist?.color) {
              color = publicWishlist.color
            }

            const publicItems = await wishlistAPI.getPublicWishlistItems(wishlistId)
            const foundItem = publicItems.find((i: any) => i.id === itemId)

            setWishlistColor(color)

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
      } else if (err.response?.status === 404) {
        specificError = 'The requested item or wishlist was not found.'
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

  return { item, wishlistColor, isLoading, error, isOwner, refetchItemData: fetchData }
}