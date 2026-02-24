'use client'

import type { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import { COLORS } from '../../styles/common'

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="120vh" bg={COLORS.background}>
      {children}
    </Box>
  )
}