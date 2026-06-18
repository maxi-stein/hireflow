import { Container, Title, Text, Stack, LoadingOverlay, Button, Box, Group } from '@mantine/core';
import { useNavigate, Navigate } from 'react-router-dom';
import { useJobOffersQuery } from '../hooks/api/useJobOffers';
import { useAppStore } from '../store/useAppStore';
import { JobOfferStatus } from '../services/job-offer.service';
import type { JobOffer } from '../services/job-offer.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingHero } from '../components/landing/LandingHero';
import { JobOfferGrid } from '../components/jobs/JobOfferGrid';

export const LANDING_MAX_WIDTH = 1440;

export const LandingPage = () => {
  const { t } = useTranslation(['common', 'jobs']);
  const navigate = useNavigate();
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

          <JobOfferGrid
            jobs={jobOffers?.data ?? []}
            renderAction={(job) => (
              <Button
                fullWidth
                variant="filled"
                color="blue"
                onClick={() => handleApplyClick(job)}
              >
                {t('applyNow', 'Aplicar')}
              </Button>
            )}
            emptyMessage={t('jobs:landing.noJobs')}
            emptySubtitle={t('jobs:landing.noJobsSubtitle')}
            page={page}
            totalPages={jobOffers?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </Stack>
      </Container>
    </Box>
  );
};
