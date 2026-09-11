import { Box, Group, Stack, Title } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface ReviewJobGroupProps {
  jobTitle: string;
  children: ReactNode;
}

/**
 * Renders the job title header and wraps candidate cards for a single job group.
 * Shared between pending and completed review lists.
 */
export function ReviewJobGroup({ jobTitle, children }: ReviewJobGroupProps) {
  return (
    <Box mb="xl">
      <Group mb="md">
        <IconBriefcase size={20} style={{ opacity: 0.7 }} />
        <Title order={4}>{jobTitle}</Title>
      </Group>
      <Stack gap="md" pl={{ base: 0, md: 'md' }}>
        {children}
      </Stack>
    </Box>
  );
}
