import { LuGift, LuShoppingCart, LuTag, LuStar, LuHeart, LuDiamond, LuBike, LuGamepad2, LuShirt, LuPlane, LuHouse, LuBook } from 'react-icons/lu'

export const WISHLIST_ICON_MAP: Record<string, any> = {
  'gift-outline': LuGift,
  'cart-outline': LuShoppingCart,
  'pricetag-outline': LuTag,
  'star-outline': LuStar,
  'heart-outline': LuHeart,
  'diamond-outline': LuDiamond,
  'bicycle-outline': LuBike,
  'game-controller-outline': LuGamepad2,
  'shirt-outline': LuShirt,
  'airplane-outline': LuPlane,
  'home-outline': LuHouse,
  'book-outline': LuBook,
}

export const getWishlistIcon = (iconName?: string) => {
  return WISHLIST_ICON_MAP[iconName || ''] || LuHeart
}