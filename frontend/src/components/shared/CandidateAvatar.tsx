import { useState, useEffect } from 'react';
import { Avatar, type AvatarProps } from '@mantine/core';
import { useCandidateFilesQuery } from '../../hooks/api/useUserFiles';
import { FileType, userFileService } from '../../services/user-file.service';

interface CandidateAvatarProps extends AvatarProps {
  candidateId: string;
  firstName?: string;
  lastName?: string;
}

export function CandidateAvatar({ candidateId, firstName, lastName, ...props }: CandidateAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: files } = useCandidateFilesQuery(candidateId);

  useEffect(() => {
    const profilePicture = files?.find(f => f.file_type === FileType.PROFILE_PICTURE);
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      if (profilePicture) {
        try {
          // Get the image as a binary large object from the database 
          const blob = await userFileService.downloadFile(profilePicture.id);

          // Create a temporary URL for the image in RAM memory
          // The src in Avatar (<img/>) needs a URL to display the image
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
  }, [files]);

  return (
    <Avatar src={imageUrl} color="blue" {...props}>
      {firstName?.charAt(0)}{lastName?.charAt(0)}
    </Avatar>
  );
}
