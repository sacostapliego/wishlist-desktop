import { 
  Box, 
  VStack, 
  Input, 
  Textarea, 
  Button, 
  Text,
  Switch,
  Grid,
  HStack,
  SimpleGrid
} from '@chakra-ui/react'
import { useState, useImperativeHandle, forwardRef } from 'react'
import { COLORS } from '../../styles/common'
import { getWishlistIcon, WISHLIST_ICON_MAP } from '../../utils/wishlistIcons'
import { WISHLIST_COLORS } from '../../styles/colors'

const ICON_OPTIONS = Object.keys(WISHLIST_ICON_MAP)

interface WishlistFormData {
  title: string
  description: string
  color: string
  is_public: boolean
  image: string
}

interface WishlistFormProps {
  initialValues?: Partial<WishlistFormData>
  onSubmit: (data: WishlistFormData) => Promise<void> | void
  isLoading?: boolean
  submitLabel?: string
}

export interface WishlistFormRef {
  resetForm: () => void
}

export const WishlistForm = forwardRef<WishlistFormRef, WishlistFormProps>(({
  initialValues = {},
  onSubmit,
  isLoading,
  submitLabel = "Save Wishlist"
}, ref) => {
  const [title, setTitle] = useState(initialValues.title || '')
  const [description, setDescription] = useState(initialValues.description || '')
  const [isPublic, setIsPublic] = useState(initialValues.is_public || false)
  const [selectedColor, setSelectedColor] = useState(initialValues.color || '#ff7f50')
  const [selectedImage, setSelectedImage] = useState(initialValues.image || 'gift-outline')

  const handleSubmit = async () => {
    if (!title.trim()) return
    
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      color: selectedColor,
      is_public: isPublic,
      image: selectedImage
    })
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setIsPublic(false)
    setSelectedColor('#ff7f50')
    setSelectedImage('gift-outline')
  }
  
  useImperativeHandle(ref, () => ({
    resetForm
  }))
  
  return (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2} color={COLORS.text.secondary}>
          Title
        </Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Wishlist"
          bg={COLORS.cardGray}
          border="none"
          _placeholder={{ color: COLORS.inactive }}
          _focus={{ bg: COLORS.cardDarkLight }}
        />
      </Box>
      
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2} color={COLORS.text.secondary}>
          Description (Optional)
        </Text>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this wishlist for?"
          bg={COLORS.cardGray}
          border="none"
          _placeholder={{ color: COLORS.inactive }}
          _focus={{ bg: COLORS.cardDarkLight }}
          minH="100px"
          resize="vertical"
        />
      </Box>
      
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={3} color={COLORS.text.secondary}>
          Color
        </Text>
        <SimpleGrid columns={{ base: 6, md: 10 }} gap={3}>
          {Object.values(WISHLIST_COLORS).map((color) => (
            <Box
              key={color}
              w="40px"
              h="40px"
              borderRadius="md"
              bg={color}
              cursor="pointer"
              border={selectedColor === color ? '3px solid white' : '3px solid transparent'}
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.1)' }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </SimpleGrid>
      </Box>
      
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="medium" color={COLORS.text.secondary}>
          Make Public
        </Text>
        <Switch.Root checked={isPublic} onCheckedChange={(e) => setIsPublic(e.checked)} colorPalette="red">
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </HStack>

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={3} color={COLORS.text.secondary}>
          Icon
        </Text>
        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
          {ICON_OPTIONS.map((iconKey: string) => {
            const IconComponent = getWishlistIcon(iconKey)
            return (
              <Box
                key={iconKey}
                p={3}
                borderRadius="md"
                bg={selectedImage === iconKey ? COLORS.primary : COLORS.cardGray}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                _hover={{ bg: selectedImage === iconKey ? COLORS.primary : COLORS.cardDarkLight }}
                onClick={() => setSelectedImage(iconKey)}
              >
                <Box 
                  as={IconComponent} 
                  boxSize="24px" 
                  color={selectedImage === iconKey ? 'white' : COLORS.text.primary} 
                />
              </Box>
            )
          })}
        </Grid>
      </Box>
      
      <Button
        onClick={handleSubmit}
        colorScheme="blue"
        size="lg"
        mt={4}
        disabled={isLoading || !title.trim()}
        loading={isLoading}
      >
        {submitLabel}
      </Button>
    </VStack>
  )
})

WishlistForm.displayName = 'WishlistForm'