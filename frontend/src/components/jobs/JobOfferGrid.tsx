import { Grid, Card, Center, Stack, Text, Pagination } from '@mantine/core';
import type { ReactNode } from 'react';
import type { JobOffer } from '../../services/job-offer.service';
import { JobOfferCard } from './JobOfferCard';
import { useHighlightEffect } from '../../hooks/useHighlightEffect';
import { useTranslation } from 'react-i18next';

interface JobOfferGridProps {
  jobs: JobOffer[];
  /** Renders the action button for each job card */
  renderAction: (job: JobOffer) => ReactNode;
  /** Empty state message key (i18n) or plain string */
  emptyMessage?: string;
  emptySubtitle?: string;
  /** Pagination */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const JobOfferGrid = ({
  jobs,
  renderAction,
  emptyMessage,
  emptySubtitle,
  page,
  totalPages,
  onPageChange,
}: JobOfferGridProps) => {
  const { t } = useTranslation(['jobs']);
  const { highlightedId, setElementRef } = useHighlightEffect();

  if (jobs.length === 0) {
    return (
      <Card withBorder p="xl" radius="md">
        <Center>
          <Stack align="center" gap="xs">
            <Text size="lg" fw={500}>
              {emptyMessage ?? t('jobs:landing.noJobs')}
            </Text>
            {emptySubtitle && <Text c="dimmed">{emptySubtitle}</Text>}
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Stack gap="xl">
      <Grid>
        {jobs.map((job) => {
          const isHighlighted = highlightedId === job.id;

          return (
            <Grid.Col
              id={`job-${job.id}`}
              span={{ base: 12, md: 6, lg: 6 }}
              key={job.id}
              ref={setElementRef(job.id)}
              style={{
                transition: 'all 0.3s ease',
                transform: isHighlighted ? 'scale(1.01)' : 'scale(1)',
                boxShadow: isHighlighted ? '0 8px 30px rgba(99, 102, 241, 0.4)' : 'none',
                borderRadius: '8px',
              }}
            >
              <JobOfferCard job={job} action={renderAction(job)} />
            </Grid.Col>
          );
        })}
      </Grid>

      {totalPages !== undefined && totalPages > 1 && onPageChange && (
        <Center>
          <Pagination
            value={page}
            onChange={onPageChange}
            total={totalPages}
            color="blue"
            withEdges
          />
        </Center>
      )}
    </Stack>
  );
};
