import { Avatar, type AvatarProps } from '@mantine/core';
import { useProfilePictureDataUrl } from '../../../hooks/api/useUserFiles';

interface CandidateAvatarProps extends AvatarProps {
  candidateId?: string;
  firstName?: string;
  lastName?: string;
}

export function CandidateAvatar({
  candidateId,
  firstName,
  lastName,
  radius = 'md',
  size = 71,
  src: externalSrc,
  ...props
}: CandidateAvatarProps) {
  const { data: profilePictureDataUrl } = useProfilePictureDataUrl(candidateId);

  // Internal query URL takes priority, then external src
  const resolvedSrc = profilePictureDataUrl || externalSrc || null;

  return (
    <Avatar
      // Force browser repaint when src changes — blob URLs inside
      // fixed-position compositing layers (header) may not paint
      // until a visibility change otherwise.
      key={resolvedSrc || 'no-src'}
      src={resolvedSrc}
      color="blue"
      radius={radius}
      size={size}
      {...props}
    >
      {props.children || `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`}
    </Avatar>
  );
}
