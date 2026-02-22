import { Box, Heading, IconButton } from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'
import { useState, useEffect, useRef } from 'react'
import { WishlistForm } from './WishlistForm'
import type { WishlistFormRef } from './WishlistForm'
import { COLORS } from '../../styles/common'
import wishlistAPI from '../../services/wishlist'
import { toaster } from '../ui/toaster'
import type { UpdateWishlistData } from '../../types/types'

interface EditWishlistModalProps {
  isOpen: boolean
  onClose: () => void
  wishlistId: string
  onSuccess?: () => void
}

export function EditWishlistModal({ isOpen, onClose, wishlistId, onSuccess }: EditWishlistModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  const formRef = useRef<WishlistFormRef>(null)
    
  useEffect(() => {
    if (isOpen && wishlistId) {
      fetchWishlistDetails()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, wishlistId])

  const fetchWishlistDetails = async () => {
    setIsLoading(true)
    try {
      const wishlistData = await wishlistAPI.getWishlist(wishlistId)
      setInitialValues({
        title: wishlistData.title,
        description: wishlistData.description,
        color: wishlistData.color,
        is_public: wishlistData.is_public,
        image: wishlistData.image
      })
    } catch (error) {
      console.error('Error fetching wishlist details:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to load wishlist details',
        type: 'error'})
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateWishlist = async (wishlistData: Partial<UpdateWishlistData>) => {
    setIsSaving(true)
    try {
      await wishlistAPI.updateWishlist(wishlistId, wishlistData)
      
      toaster.create({
        title: 'Success',
        description: 'Wishlist updated successfully!',
        type: 'success'
      })
      
      if (onSuccess) {
        onSuccess()
      }
      
      onClose()
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to update wishlist',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.7)"
        zIndex={999}
        onClick={onClose}
      />

      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg={COLORS.cardDarkLight}
        borderRadius="lg"
        zIndex={1000}
        maxW="600px"
        maxH="90vh"
        w="90vw"
        overflowY="auto"
      >
        {/* Header */}
        <Box
          position="sticky"
          top={0}
          bg={COLORS.cardDarkLight}
          borderBottom="1px solid"
          borderColor={COLORS.cardGray}
          px={6}
          py={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          zIndex={1}
        >
          <Heading size="lg">Edit Wishlist</Heading>
          <IconButton
            aria-label="Close"
            variant="ghost"
            onClick={onClose}
            size="sm"
          >
            <LuX />
          </IconButton>
        </Box>

        {/* Form */}
        {!isLoading && (
          <WishlistForm
            ref={formRef}
            initialValues={initialValues}
            onSubmit={handleUpdateWishlist}
            isLoading={isSaving}
            submitLabel="Save Changes"
          />
        )}
      </Box>
    </>
  )
}