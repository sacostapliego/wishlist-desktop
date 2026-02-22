import { Box, VStack, HStack, Text, Input, Grid, Image, Button } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { LuUpload, LuX } from 'react-icons/lu'
import { COLORS } from '../../styles/common'
import { WISHLIST_ICON_MAP, getWishlistIcon } from '../../utils/wishlistIcons'

const ICON_OPTIONS = Object.keys(WISHLIST_ICON_MAP)

interface ThumbnailPickerProps {
  thumbnailType: 'icon' | 'image'
  selectedIcon: string
  /** URL of an existing uploaded image (from the server) */
  existingImageUrl?: string | null
  /** Local file selected by the user */
  selectedImageFile?: File | null
  onThumbnailTypeChange: (type: 'icon' | 'image') => void
  onIconSelect: (iconKey: string) => void
  onImageSelect: (file: File | null) => void
}

export function ThumbnailPicker({
  thumbnailType,
  selectedIcon,
  existingImageUrl,
  selectedImageFile,
  onThumbnailTypeChange,
  onIconSelect,
  onImageSelect,
}: ThumbnailPickerProps) {
  const [iconSearch, setIconSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Determine what image preview to show
  const imagePreviewUrl = selectedImageFile
    ? URL.createObjectURL(selectedImageFile)
    : existingImageUrl || null

  const filteredIcons = iconSearch.trim()
    ? ICON_OPTIONS.filter((key) =>
        key.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : ICON_OPTIONS

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onImageSelect(file)
  }

  const handleRemoveImage = () => {
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="sm" fontWeight="medium" color={COLORS.text.secondary}>
        Thumbnail
      </Text>

      {/* Mode toggle */}
      <HStack gap={2}>
        <Button
          size="sm"
          variant={thumbnailType === 'icon' ? 'solid' : 'outline'}
          bg={thumbnailType === 'icon' ? COLORS.primary : 'transparent'}
          color="white"
          borderColor={COLORS.border}
          _hover={{ bg: thumbnailType === 'icon' ? COLORS.primary : COLORS.cardGray }}
          onClick={() => onThumbnailTypeChange('icon')}
        >
          Icon
        </Button>
        <Button
          size="sm"
          variant={thumbnailType === 'image' ? 'solid' : 'outline'}
          bg={thumbnailType === 'image' ? COLORS.primary : 'transparent'}
          color="white"
          borderColor={COLORS.border}
          _hover={{ bg: thumbnailType === 'image' ? COLORS.primary : COLORS.cardGray }}
          onClick={() => onThumbnailTypeChange('image')}
        >
          Image
        </Button>
      </HStack>

      {/* Icon picker mode */}
      {thumbnailType === 'icon' && (
        <VStack align="stretch" gap={3}>
          <Input
            placeholder="Search icons..."
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            bg={COLORS.cardGray}
            border="none"
            size="sm"
            _placeholder={{ color: COLORS.inactive }}
            _focus={{ bg: COLORS.cardDarkLight }}
          />
          <Grid templateColumns="repeat(4, 1fr)" gap={3}>
            {filteredIcons.map((iconKey: string) => {
              const IconComponent = getWishlistIcon(iconKey)
              return (
                <Box
                  key={iconKey}
                  p={3}
                  borderRadius="md"
                  bg={selectedIcon === iconKey ? COLORS.primary : COLORS.cardGray}
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.2s"
                  _hover={{
                    bg: selectedIcon === iconKey ? COLORS.primary : COLORS.cardDarkLight,
                  }}
                  onClick={() => onIconSelect(iconKey)}
                >
                  <Box
                    as={IconComponent}
                    boxSize="24px"
                    color={selectedIcon === iconKey ? 'white' : COLORS.text.primary}
                  />
                </Box>
              )
            })}
          </Grid>
        </VStack>
      )}

      {/* Image upload mode */}
      {thumbnailType === 'image' && (
        <VStack align="stretch" gap={3}>
          {imagePreviewUrl ? (
            <Box position="relative" w="120px" h="120px">
              <Image
                src={imagePreviewUrl}
                alt="Thumbnail preview"
                w="120px"
                h="120px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box
                as="button"
                position="absolute"
                top={1}
                right={1}
                bg="rgba(0,0,0,0.7)"
                borderRadius="full"
                p={1}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={handleRemoveImage}
                _hover={{ bg: 'rgba(0,0,0,0.9)' }}
              >
                <Box as={LuX} boxSize="14px" color="white" />
              </Box>
            </Box>
          ) : (
            <Box
              w="120px"
              h="120px"
              borderRadius="md"
              border="2px dashed"
              borderColor={COLORS.border}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              _hover={{ borderColor: COLORS.text.muted }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Box as={LuUpload} boxSize="24px" color={COLORS.text.muted} mb={1} />
              <Text fontSize="xs" color={COLORS.text.muted}>
                Upload
              </Text>
            </Box>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {!imagePreviewUrl && (
            <Text fontSize="xs" color={COLORS.text.muted}>
              Upload a custom image for your wishlist thumbnail
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  )
}
