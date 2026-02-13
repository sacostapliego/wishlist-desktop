import { useState, useEffect } from 'react'
import { wishlistAPI } from '../services/wishlist'
import { toaster } from '../components/ui/toaster'
import { useAuth } from '../context/AuthContext'

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

interface WishlistItem {
  id: string
  name: string
  description?: string
  image?: string
  price?: number
  url?: string
  wishlist_id: string
  priority: number
  is_claimed?: boolean | null
}

export function useWishlistDetail(wishlistId: string | undefined, shouldRefresh?: number, isPublicView: boolean = false) {
  const { isLoggedIn } = useAuth()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (wishlistId) {
      fetchWishlistDetails()
    }
  }, [wishlistId, shouldRefresh, isLoggedIn])

  const fetchWishlistDetails = async () => {
    if (!wishlistId) return

    setIsLoading(true)
    try {
      let wishlistData: Wishlist | null = null
      let itemsData: any[] = []

      // If it's a public view or user is not logged in, go straight to public endpoint
      if (isPublicView || !isLoggedIn) {
        wishlistData = await wishlistAPI.getPublicWishlist(wishlistId)
        const publicItems = await wishlistAPI.getPublicWishlistItems(wishlistId)
        itemsData = publicItems.map((item: any) => ({ ...item, priority: item.priority ?? 0 }))
      } else {
        // Try authenticated endpoint first for logged in users
        try {
          wishlistData = await wishlistAPI.getWishlist(wishlistId)
          const allItems = await wishlistAPI.getItems()
          itemsData = allItems
            .filter((item: any) => item.wishlist_id === wishlistId)
            .map((item: any) => ({ ...item, priority: item.priority ?? 0 }))
        } catch (ownerError: any) {
          // Fallback to public endpoint if authenticated fails
          if (ownerError.response?.status === 403 || ownerError.response?.status === 404) {
            wishlistData = await wishlistAPI.getPublicWishlist(wishlistId)
            const publicItems = await wishlistAPI.getPublicWishlistItems(wishlistId)
            itemsData = publicItems.map((item: any) => ({ ...item, priority: item.priority ?? 0 }))
          } else {
            throw ownerError
          }
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