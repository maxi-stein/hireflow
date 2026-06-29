import { useState, useEffect } from 'react';
import { Avatar, type AvatarProps } from '@mantine/core';
import { useCandidateFilesQuery } from '../../../hooks/api/useUserFiles';
import { FileType, userFileService } from '../../../services/user-file.service';

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
  ...props
}: CandidateAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: files } = useCandidateFilesQuery(candidateId || '');

  useEffect(() => {
    if (!candidateId) {
      setImageUrl(null);
      return;
    }

    const profilePicture = files?.find(f => f.file_type === FileType.PROFILE_PICTURE);
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      if (profilePicture) {
        try {
          const blob = await userFileService.downloadFile(profilePicture.id);
          objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } catch {
          setImageUrl(null);
        }
      } else {
        setImageUrl(null);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [files, candidateId]);

  return (
    <Avatar src={imageUrl || props.src} color="blue" radius={radius} size={size} {...props}>
      {props.children || `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`}
    </Avatar>
  );
}
