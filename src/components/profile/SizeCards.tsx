import { Box, Grid, Text, HStack } from '@chakra-ui/react'
import { 
  LuShirt, 
  LuDiamond, 
} from 'react-icons/lu'
import { PiSneaker, PiDress, PiPants } from 'react-icons/pi'
import { LiaHatCowboySideSolid } from "react-icons/lia";
import { TbJacket } from "react-icons/tb";
import { COLORS } from '../../styles/common'

type SizeKey=
  | 'shoe_size'
  | 'shirt_size'
  | 'pants_size'
  | 'hat_size'
  | 'ring_size'
  | 'dress_size'
  | 'jacket_size'

type SizeValues = Partial<Record<SizeKey, string | null | undefined>>

const SIZE_FIELDS: { key: SizeKey; label: string }[] = [
  { key: 'shoe_size', label: 'Shoes' },
  { key: 'shirt_size', label: 'Shirts' },
  { key: 'pants_size', label: 'Pants' },
  { key: 'hat_size', label: 'Hats' },
  { key: 'ring_size', label: 'Rings' },
  { key: 'dress_size', label: 'Dresses' },
  { key: 'jacket_size', label: 'Jackets' },
]

const ICON_MAP: Record<SizeKey, React.ReactNode> = {
  shoe_size: <PiSneaker />,
  shirt_size: <LuShirt />,
  pants_size: <PiPants />,
  hat_size: <LiaHatCowboySideSolid />,
  ring_size: <LuDiamond />,
  dress_size: <PiDress />,
  jacket_size: <TbJacket />,
}

export function SizeCards({ values }: { values: SizeValues }) {
  const visibleSizeItems = SIZE_FIELDS
    .map(sizeField => ({ ...sizeField, value: values[sizeField.key] }))
    .filter(
      (sizeEntry): sizeEntry is { key: SizeKey; label: string; value: string } =>
        typeof sizeEntry.value === 'string' && sizeEntry.value.trim().length > 0
    )

  if (visibleSizeItems.length === 0) return null

  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
      gap={3}
      w="100%"
    >
      {visibleSizeItems.map(sizeItem => (
        <Box
          key={sizeItem.key}
          bg={COLORS.cardGray}
          p={4}
          borderRadius="md"
        >
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color={COLORS.text.secondary}>
              {sizeItem.label}
            </Text>
            <Box color={COLORS.text.secondary} fontSize="lg">
              {ICON_MAP[sizeItem.key]}
            </Box>
          </HStack>
          <Text fontSize="lg" fontWeight="semibold" color="white">
            {sizeItem.value}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}