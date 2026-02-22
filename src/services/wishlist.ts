import api from "./api";
import type { 
  Wishlist, 
  WishlistItem, 
  CreateItemData, 
  UpdateItemData,
  ScrapedItemData,
  CreateWishlistData,
  UpdateWishlistData
} from '../types/types'

export interface ClaimedItemResponse {
  id: string;
  name: string;
  price?: number;
  image?: string;
  owner_id: string;
  owner_name: string;
  wishlist_id?: string;
  wishlist_color?: string;
  claimed_at?: string;
}

export interface ProcessImageResponse {
  image_data_url: string;
}

export interface ClaimItemData {
  user_id?: string;
  guest_name?: string;
}

export interface ImageUpload {
  uri: string;
  name: string;
  type: string;
}

export const wishlistAPI = {
  getWishlistItems: async (wishlistId: string): Promise<WishlistItem[]> => {
    const response = await api.get(`/wishlist/items/${wishlistId}`)
    return response.data;
},
  
  getItems: async (): Promise<WishlistItem[]> => {
    const response = await api.get('/wishlist/'); 
    return response.data;
  },

  createItem: async (item: CreateItemData, image?: File | string): Promise<WishlistItem> => {
    const formData = new FormData();
    
    // Add all item properties to form data
    Object.keys(item).forEach(key => {
      const value = item[key as keyof CreateItemData];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    // Handle image properly
    if (image) {
      if (typeof image === 'string' && image.startsWith('data:')) {
        // Convert base64 data URL to blob
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append('image', blob, 'image.png');
        } catch (error) {
          console.error('Error converting base64 to blob:', error);
          throw new Error('Failed to process image data');
        }
      } else if (image instanceof File) {
        // Check if this is a malformed File object with base64 in the filename
        if (image.name && image.name.startsWith('item-image.data:')) {
          // Extract the base64 data from the filename
          const base64Data = image.name.replace('item-image.', '');
          
          try {
            const response = await fetch(base64Data);
            const blob = await response.blob();
            formData.append('image', blob, 'image.png');
          } catch (error) {
            console.error('Error converting malformed File base64 to blob:', error);
            throw new Error('Failed to process malformed image data');
          }
        } else {
          // Normal File object, append directly
          formData.append('image', image);
        }
      } else {
        console.warn('Image is neither File nor base64 string:', typeof image);
      }
    }
    
    const response = await api.post('/wishlist/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateItem: async (id: string, item: Partial<UpdateItemData>, image?: File | string): Promise<WishlistItem> => {
    const formData = new FormData();
    
    // Add all item properties to form data
    Object.entries(item).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    // Handle image properly - check if it's base64 or File
    if (image) {
      if (typeof image === 'string' && image.startsWith('data:')) {
        // Convert base64 data URL to blob
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append('image', blob, 'image.png');
        } catch (error) {
          console.error('Error converting base64 to blob:', error);
          throw new Error('Failed to process image data');
        }
      } else if (image instanceof File) {
        // Already a proper file, append directly
        formData.append('image', image);
      } else {
        console.warn('Image is neither File nor base64 string:', typeof image);
      }
    }
    
    const response = await api.put(`/wishlist/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteItem: async (id: string): Promise<void> => {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  },
  
  getUserWishlist: async (userId: string): Promise<Wishlist[]> => {
    const response = await api.get(`/wishlist/user/${userId}`);
    return response.data;
  },

  getWishlists: async (): Promise<Wishlist[]> => {
    const response = await api.get('/wishlists/');
    return response.data;
  },
  
  getWishlist: async (id: string): Promise<Wishlist> => {
    const response = await api.get(`/wishlists/${id}`);
    return response.data;
  },
  
  createWishlist: async (wishlist: CreateWishlistData): Promise<Wishlist> => {
    try {
      const response = await api.post('/wishlists/', wishlist);
      return response.data;
    } catch (error) {
      console.error('API Error in createWishlist:', error);
      throw error;
    }
  },
  
  updateWishlist: async (id: string, wishlist: UpdateWishlistData): Promise<Wishlist> => {
    const response = await api.put(`/wishlists/${id}`, wishlist);
    return response.data;
  },
  
  deleteWishlist: async (id: string): Promise<void> => {
    const response = await api.delete(`/wishlists/${id}`);
    return response.data;
  },
  
  getUserWishlists: async (userId: string): Promise<Wishlist[]> => {
    const response = await api.get(`/wishlists/user/${userId}`);
    return response.data;
  },

  getPublicWishlist: async (id: string): Promise<Wishlist> => {
    try {
      const response = await api.get(`/wishlists/public/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public wishlist:', error);
      throw error;
    }
  },
  
  getPublicWishlistItems: async (wishlistId: string): Promise<WishlistItem[]> => {
    try {
      const response = await api.get(`/wishlist/public/${wishlistId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for public wishlist ${wishlistId}:`, error);
      return []; 
    }
  },
  
  getWisihlistItem: async (itemId: string): Promise<WishlistItem> => {
    try {
      const response = await api.get(`/wishlist/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item ${itemId}:`, error);
      throw error;
    }
  },

  processImageForBackgroundRemoval: async (imageFile: File | ImageUpload): Promise<ProcessImageResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile as Blob);

    const response = await api.post('/wishlist/process-image/remove-background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeItemBackground: async (itemId: string): Promise<WishlistItem> => {
    const response = await api.post(`/wishlist/${itemId}/remove-background`);
    return response.data;
  },

  scrapeUrl: async (url: string): Promise<ScrapedItemData> => {
    try {
      const response = await api.post('/wishlist/scrape-url', { url });
      return response.data;
    } catch (error) {
      console.error('Error scraping URL:', error);
      throw error;
    }
  },

  claimItem: async (itemId: string, claimData: ClaimItemData): Promise<WishlistItem> => {
    const response = await api.post(`/wishlist/${itemId}/claim`, claimData);
    return response.data;
  },

  unclaimItem: async (itemId: string, unclaimData: ClaimItemData): Promise<WishlistItem> => {
    const response = await api.delete(`/wishlist/${itemId}/claim`, { data: unclaimData });
    return response.data;
  },

  getClaimedItems: async (): Promise<ClaimedItemResponse[]> => {
    try {
      const response = await api.get('/wishlist/claimed/my-items');
      return response.data;
    } catch (error) {
      console.error('Error fetching claimed items:', error);
      throw error;
    }
  },
};

export default wishlistAPI;