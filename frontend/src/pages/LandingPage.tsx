import { Container, Title, Text, Stack, Card, LoadingOverlay, Button, Box, Center, Badge, Group, Pagination } from '@mantine/core';
import { useNavigate, Navigate } from 'react-router-dom';
import { useHighlightEffect } from '../hooks/useHighlightEffect';
import { useJobOffersQuery } from '../hooks/api/useJobOffers';
import { useAppStore } from '../store/useAppStore';
import { JobOfferStatus } from '../services/job-offer.service';
import type { JobOffer } from '../services/job-offer.service';
import { useState } from 'react';
import { JobOfferCard } from '../components/jobs/JobOfferCard';
import { useTranslation } from 'react-i18next';
import { LandingHero } from '../components/landing/LandingHero';

export const LANDING_MAX_WIDTH = 1440;

export const LandingPage = () => {
  const { t } = useTranslation(['common', 'jobs']);
  const navigate = useNavigate();
  const { highlightedId, setElementRef } = useHighlightEffect();
  const user = useAppStore((state) => state.user);

  const [page, setPage] = useState(1);

  const { data: jobOffers, isLoading } = useJobOffersQuery({
    status: JobOfferStatus.OPEN,
    page,
    limit: 5,
  });

  const handleApplyClick = (job: JobOffer) => {
    // Send to login with current hash pointing to /jobs so they return to the correct card after authentication
    navigate('/login', { state: { from: { pathname: '/jobs', hash: `#job-${job.id}` } } });
  };

  if (user) {
    return <Navigate to={user.type === 'employee' ? "/manage/dashboard" : "/jobs"} replace />;
  }

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <LandingHero />

      {/* Jobs List Section */}
      <Container size={LANDING_MAX_WIDTH} py={{ base: 40, md: 80 }}>
        <Stack gap="xl">
          <Group justify="space-between" align="flex-end">
            <div>
              <Title order={2} size="h2">{t('jobs:landing.availableJobs', 'Trabajos Disponibles')}</Title>
              <Text c="dimmed" size="lg" mt="xs">{t('jobs:landing.availableJobsSubtitle', 'Descubre nuestras últimas ofertas y encuentra tu lugar ideal.')}</Text>
            </div>
          </Group>

          {!jobOffers?.data || jobOffers.data.length === 0 ? (
            <Card withBorder p="xl" radius="md">
              <Center>
                <Stack align="center" gap="xs">
                  <Text size="lg" fw={500}>{t('jobs:landing.noJobs', 'No hay trabajos disponibles por el momento')}</Text>
                  <Text c="dimmed">{t('jobs:landing.noJobsSubtitle', 'Por favor, vuelve a revisar más tarde.')}</Text>
                </Stack>
              </Center>
            </Card>
          ) : (
            <Stack gap="md">
              {jobOffers.data.map((job) => {
                const isHighlighted = highlightedId === job.id;

                return (
                  <div
                    id={`job-${job.id}`}
                    key={job.id}
                    ref={setElementRef(job.id)}
                    style={{
                      transition: 'all 0.3s ease',
                      transform: isHighlighted ? 'scale(1.01)' : 'scale(1)',
                      boxShadow: isHighlighted ? '0 8px 30px rgba(99, 102, 241, 0.4)' : 'none',
                      borderRadius: '8px',
                    }}
                  >
                    <JobOfferCard
                      job={job}
                      action={
                        <Button
                          fullWidth
                          variant="filled"
                          color="blue"
                          onClick={() => handleApplyClick(job)}
                        >
                          {t('applyNow', 'Aplicar')}
                        </Button>
                      }
                    />
                  </div>
                );
              })}

              {jobOffers.pagination && jobOffers.pagination.totalPages > 1 && (
                <Center mt="xl">
                  <Pagination
                    value={page}
                    onChange={setPage}
                    total={jobOffers.pagination.totalPages}
                    color="blue"
                    withEdges
                  />
                </Center>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
