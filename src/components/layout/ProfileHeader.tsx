import { Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../services/api'
import { ProfileSection } from './sidebar/ProfileSection'

export function ProfileHeader() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const profileImage = user?.id ? `${API_URL}users/${user.id}/profile-image` : null
  const displayName = user?.name || user?.username || 'Guest'

  return (
    <Box display={{ base: "block", lg: "none" }} p={4} bg="#141414" >
      <ProfileSection 
        displayName={displayName}
        profileImage={profileImage}
        isExpanded={true}
        onNavigate={() => navigate('/profile')}
      />
    </Box>
  )
}