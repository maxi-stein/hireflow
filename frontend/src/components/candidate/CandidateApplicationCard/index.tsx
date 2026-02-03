import { Card, Stack, Group, Title, Button, Text, Box, ThemeIcon } from '@mantine/core';
import { IconExternalLink, IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import type { Interview } from '../../../services/interview.service';
import { InterviewStatus } from '../../../services/interview.service';
import { ApplicationMeta } from './ApplicationMeta';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationTimeline } from './ApplicationTimeline';

interface CandidateApplicationCardProps {
  application: CandidateApplication;
  interviews: Interview[];
}

export const CandidateApplicationCard = ({ application, interviews }: CandidateApplicationCardProps) => {
  const { job_offer } = application;
  const navigate = useNavigate();

  const hasScheduledInterview = interviews.some(i => i.status === InterviewStatus.SCHEDULED);

  // Determine border color based on status
  const getBorderLeftColor = () => {
    if (hasScheduledInterview) return 'var(--mantine-color-violet-filled)';
    if (application.status === 'HIRED') return 'var(--mantine-color-green-filled)';
    if (application.status === 'REJECTED') return 'var(--mantine-color-red-filled)';
    return 'var(--mantine-color-blue-filled)';
  };

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      style={{
        borderLeft: `4px solid ${getBorderLeftColor()}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--mantine-shadow-md)',
          }
        }
      }}
    >
      {/* Header Section */}
      <Card.Section
        bg="var(--mantine-color-body)"
        withBorder
        inheritPadding
        py="md"
        style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1 }}>
            <Title order={3} size="h4" fw={700}>
              {job_offer.position}
            </Title>
            <ApplicationMeta
              location={job_offer.location}
              workMode={job_offer.work_mode}
              appliedDate={application.created_at}
            />
          </Stack>
          <ApplicationStatusBadge status={application.status} hasScheduledInterview={hasScheduledInterview} />
        </Group>
      </Card.Section>

      <Stack gap="lg" mt="lg">
        {interviews.length > 0 ? (
          <ApplicationTimeline interviews={interviews} />
        ) : (
          <Box
            mt="md"
            p="lg"
            bg="var(--mantine-color-blue-light)"
            style={{
              borderRadius: '8px',
              border: '1px solid var(--mantine-color-blue-light-color)'
            }}
          >
            <Group align="center" gap="md">
              <ThemeIcon size="lg" radius="xl" variant="white" color="blue">
                <IconClock size={20} />
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={600} c="blue.9">Application Under Review</Text>
                <Text size="sm" c="blue.8" lh={1.4}>
                  Our team is currently reviewing your profile. You will be notified regarding any updates or next steps in the process.
                </Text>
              </Box>
            </Group>
          </Box>
        )}
      </Stack>

      {/* Footer / Actions */}
      <Card.Section
        inheritPadding
        py="md"
        mt="xl"
        style={{
          borderTop: '1px solid var(--mantine-color-default-border)',
          backgroundColor: 'var(--mantine-color-default-hover)',
        }}
      >
        <Group justify="flex-end">
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            rightSection={<IconExternalLink size={16} />}
            onClick={() => navigate(`/jobs?highlight=${job_offer.id}`)}
          >
            View Original Job Post
          </Button>

          {/* Primary action if relevant, e.g. View Messages or similar could go here */}
        </Group>
      </Card.Section>

    </Card>
  );
};
