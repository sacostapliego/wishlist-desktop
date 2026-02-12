import { useState, useEffect } from 'react'
import { wishlistAPI } from '../services/wishlist'
import { toaster } from '../components/ui/toaster'
import type { WishlistItem } from '../components/wishlists/WishlistItemView'

interface Wishlist {
  id: string
  title: string
  description?: string
  owner_id: string
  is_public: boolean
  color?: string
  image?: string
  item_count?: number
  updated_at?: string
  created_at?: string
}

export function useWishlistDetail(wishlistId: string | undefined, shouldRefresh?: number) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (wishlistId) {
      fetchWishlistDetails()
    }
  }, [wishlistId, shouldRefresh])

  const fetchWishlistDetails = async () => {
    if (!wishlistId) return

    setIsLoading(true)
    try {
      // Try to fetch as owner first
      let wishlistData: Wishlist | null = null
      let itemsData: any[] = []

      try {
        wishlistData = await wishlistAPI.getWishlist(wishlistId)
        const allItems = await wishlistAPI.getItems()
        itemsData = allItems.filter(
          (item: any) => item.wishlist_id === wishlistId
        )
      } catch (ownerError: any) {
        // If that fails, try public wishlist
        if (ownerError.response?.status === 403 || ownerError.response?.status === 404) {
          try {
            wishlistData = await wishlistAPI.getPublicWishlist(wishlistId)
            itemsData = await wishlistAPI.getPublicWishlistItems(wishlistId)
          } catch (publicError) {
            console.error('Failed to fetch public wishlist:', publicError)
            throw publicError
          }
        } else {
          throw ownerError
        }
      }

      setWishlist(wishlistData)
      setItems(itemsData)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch wishlist details:', error)
      setError('Failed to load wishlist details')
      toaster.create({
        title: 'Error',
        description: 'Failed to load wishlist details',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { wishlist, items, isLoading, error, refetchItems: fetchWishlistDetails }
}