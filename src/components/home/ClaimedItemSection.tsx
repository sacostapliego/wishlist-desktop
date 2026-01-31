import { Box, Heading, HStack, Button, SimpleGrid, Image, Text, VStack } from '@chakra-ui/react'

interface ClaimedItem {
  id: number
  name: string
  friendName: string
  image: string
}

interface ClaimedItemsSectionProps {
  items: ClaimedItem[]
  onShowAll?: () => void
}

export function ClaimedItemsSection({ items, onShowAll }: ClaimedItemsSectionProps) {
  return (
    <Box p={8}>
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="lg" color="white">Items I've Claimed</Heading>
        <Button color="gray.400" fontSize="sm" onClick={onShowAll}>
          Show all
        </Button>
      </HStack>
      
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {items.map((item) => (
          <HStack
            key={item.id}
            bg="#1a1a1a"
            borderRadius="md"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: '#2a2a2a' }}
            gap={0}
            overflow="hidden"
          >
            <Image
              src={item.image}
              alt={item.name}
              w="80px"
              h="80px"
              objectFit="cover"
              flexShrink={0}
            />
            <VStack align="start" gap={0} flex={1} p={3}>
              <Text color="white" fontWeight="bold" fontSize="md">
                {item.name}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {item.friendName}
              </Text>
            </VStack>
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  )
}