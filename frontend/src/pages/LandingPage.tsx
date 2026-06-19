import { Title, Text, Stack, LoadingOverlay, Button, Box, Group } from '@mantine/core';
import { useNavigate, Navigate } from 'react-router-dom';
import { useJobOffersQuery } from '../hooks/api/useJobOffers';
import { useAppStore } from '../store/useAppStore';
import { JobOfferStatus } from '../services/job-offer.service';
import type { JobOffer } from '../services/job-offer.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingHero } from '../components/landing/LandingHero';
import { JobOfferGrid } from '../components/jobs/JobOfferGrid';
import { LandingSection } from '../components/landing/LandingSection';
import googleLogo from '../assets/google.png';
import oracleLogo from '../assets/oracle.png'

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
      <LandingSection>
        <Stack gap="xl">
          <Group justify="space-between" align="flex-end">
            <div>
              <Text c="blue" size="xs" fw={700} style={{ textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                {t('jobs:landing.availableJobs', 'Posiciones Abiertas')}
              </Text>
              <Title order={2} size="h1" style={{ color: '#000000', fontWeight: 800 }} mt={4}>
                {t('jobs:landing.findChallenge', 'Encontrá tu próximo desafío')}
              </Title>
              <Text c="dimmed" size="lg" mt="xs">
                {t('jobs:landing.availableJobsSubtitle', 'Descubrí nuestras últimas ofertas y encontrá tu lugar ideal.')}
              </Text>
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
                <Text size='xl'>{t('applyNow', 'Aplicar')}</Text>
              </Button>
            )}
            emptyMessage={t('jobs:landing.noJobs')}
            emptySubtitle={t('jobs:landing.noJobsSubtitle')}
            page={page}
            totalPages={jobOffers?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </Stack>
      </LandingSection>


      {/* CV Upload CTA Section */}
      <LandingSection
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a5276 100%)',
          borderBottom: 'none',
        }}
      >
        <Stack gap="lg" align="center" ta="center">
          <Title
            order={2}
            style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              lineHeight: 1.2,
            }}
          >
            {t('jobs:landing.cvCta.title')}
          </Title>
          <Text
            size="lg"
            maw={560}
            style={{ color: '#94b8d8', fontWeight: 400, lineHeight: 1.7 }}
          >
            {t('jobs:landing.cvCta.subtitle')}
          </Text>
          <Button
            size="lg"
            radius="xl"
            variant="white"
            color="dark"
            mt="sm"
            style={{ fontWeight: 700, paddingLeft: 32, paddingRight: 32 }}
            onClick={() => navigate('/login', { state: { from: { pathname: '/profile' } } })}
          >
            {t('jobs:landing.cvCta.button')}
          </Button>
        </Stack>
      </LandingSection>

      {/* Allies Section */}
      <LandingSection>
        <Stack gap="lg" align="center" ta="center">
          <Title order={4} size="h3" style={{ color: '#0f172a' }} tt="uppercase" c="gray.7">
            {t('jobs:landing.alliesTitle')}
          </Title>
          <Group justify="center" gap="xl" mt="md">
            <img src={googleLogo} alt="Google" style={{ width: 150, height: 50, objectFit: 'contain' }} />
            <img src={oracleLogo} alt="Oracle" style={{ width: 150, height: 50, objectFit: 'contain' }} />
          </Group>
        </Stack>
      </LandingSection>

    </Box>
  );
};

