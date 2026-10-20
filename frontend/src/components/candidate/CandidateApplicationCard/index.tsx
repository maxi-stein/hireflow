import {
  Grid,
  Stack,
  Group,
  Button,
  Text,
  Box,
  ThemeIcon,
  Card,
  Badge,
  Paper,
  Title,
} from '@mantine/core';
import {
  IconExternalLink,
  IconClock,
  IconX,
  IconCalendarEvent,
  IconCurrencyDollar,
  IconCheck,
  IconSend,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import type { Interview } from '../../../services/interview.service';
import { InterviewStatus } from '../../../services/interview.service';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationTimeline } from './ApplicationTimeline';
import { JobOfferMeta } from '../../jobs/JobOfferCard/JobOfferMeta';
import { JobOfferSkills } from '../../jobs/JobOfferCard/JobOfferSkills';

const StyledApplicationCard = styled(Card as any)`
  background: #ffffff;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02) !important;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease !important;
  overflow: hidden !important;

  [data-mantine-color-scheme='dark'] & {
    background: #1e293b;
    border-color: #334155 !important;
  }

  &:hover {
    transform: translateY(-3px) !important;
    border-color: #93c5fd !important;
    box-shadow: 0 16px 30px -10px rgba(37, 99, 235, 0.1), 0 6px 12px -4px rgba(15, 23, 42, 0.04) !important;
  }
`;

interface CandidateApplicationCardProps {
  application: CandidateApplication;
  interviews: Interview[];
}

export const CandidateApplicationCard = ({
  application,
  interviews,
}: CandidateApplicationCardProps) => {
  const { t, i18n } = useTranslation('applications');
  const { job_offer } = application;
  const navigate = useNavigate();

  const hasScheduledInterview = interviews.some((i) => i.status === InterviewStatus.SCHEDULED);
  const isRejected = application.status === 'REJECTED';
  const isHired = application.status === 'HIRED';

  const formattedDate = new Date(application.created_at).toLocaleDateString(i18n.language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <StyledApplicationCard padding="xl">
      <Grid gutter="xl">
        {/* Left Column (Job info & skills) */}
        <Grid.Col span={{ base: 12, md: 7 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <Stack gap="md" style={{ flexGrow: 1 }}>
            {/* Header row: Workmode, location & status badge */}
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <JobOfferMeta location={job_offer.location} workMode={job_offer.work_mode} />
              <ApplicationStatusBadge
                status={application.status}
                hasScheduledInterview={hasScheduledInterview}
              />
            </Group>

            {/* Job Title */}
            <Title
              order={2}
              size="h3"
              style={{
                color: 'light-dark(#0f172a, #f8fafc)',
                fontWeight: 800,
                lineHeight: 1.3,
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/jobs?search=${encodeURIComponent(job_offer.position)}`)}
            >
              {job_offer.position}
            </Title>

            {/* Description Snippet */}
            <Text size="sm" c="light-dark(#475569, #94a3b8)" lineClamp={2} style={{ lineHeight: 1.6 }}>
              {job_offer.description}
            </Text>

            {/* Salary & Application date */}
            <Group gap="md" align="center" wrap="wrap">
              {job_offer.salary && (
                <Badge
                  size="md"
                  radius="md"
                  variant="light"
                  color="blue"
                  leftSection={<IconCurrencyDollar size={14} />}
                  style={{ fontWeight: 700 }}
                >
                  AR$ {job_offer.salary}
                  <Text component="span" size="xs" c="dimmed" fw={400} ml={4}>
                    /mes
                  </Text>
                </Badge>
              )}

              <Group gap={6} c="dimmed">
                <IconCalendarEvent size={16} />
                <Text size="xs">
                  {t('card.appliedOn', 'Postulado el')} <Text component="span" fw={700} c="light-dark(#0f172a, #f8fafc)">{formattedDate}</Text>
                </Text>
              </Group>
            </Group>

            {/* Skills */}
            <JobOfferSkills skills={job_offer.skills || []} />

            {/* Action button */}
            <Box mt="auto" pt="sm">
              <Button
                variant="subtle"
                color="blue"
                size="sm"
                rightSection={<IconExternalLink size={16} />}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(job_offer.position)}`)}
                style={{ paddingLeft: 0, fontWeight: 600 }}
              >
                {t('card.viewOriginalJob', 'Ver detalles de la oferta')}
              </Button>
            </Box>
          </Stack>
        </Grid.Col>

        {/* Right Column (Interview timeline / Process Status) */}
        <Grid.Col
          span={{ base: 12, md: 5 }}
          style={{
            borderLeft: '1px solid light-dark(#f1f5f9, #334155)',
            paddingLeft: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack gap="md" style={{ height: '100%', justifyContent: 'space-between' }}>
            {/* Dynamic Process Status & Timeline */}
            {interviews.length > 0 ? (
              <Box style={{ flex: 1 }}>
                <ApplicationTimeline interviews={interviews} />
                {isHired && (
                  <Paper p="sm" radius="md" bg="light-dark(#ecfdf5, rgba(16, 185, 129, 0.1))" mt="md" style={{ border: '1px solid light-dark(#a7f3d0, rgba(16, 185, 129, 0.3))' }}>
                    <Group align="center" gap="xs">
                      <ThemeIcon size="md" radius="xl" color="teal" variant="filled">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="xs" fw={700} c="teal.9">
                        {t('card.hiredTitle', '¡Felicitaciones! Has sido seleccionado')}
                      </Text>
                    </Group>
                  </Paper>
                )}
                {isRejected && (
                  <Paper p="sm" radius="md" bg="light-dark(#fef2f2, rgba(239, 68, 68, 0.1))" mt="md" style={{ border: '1px solid light-dark(#fecaca, rgba(239, 68, 68, 0.3))' }}>
                    <Group align="center" gap="xs">
                      <ThemeIcon size="md" radius="xl" color="red" variant="light">
                        <IconX size={14} />
                      </ThemeIcon>
                      <Text size="xs" fw={700} c="red.9">
                        {t('card.rejected', 'Proceso finalizado')}
                      </Text>
                    </Group>
                  </Paper>
                )}
              </Box>
            ) : isHired ? (
              <Paper p="md" radius="md" bg="light-dark(#ecfdf5, rgba(16, 185, 129, 0.1))" style={{ border: '1px solid light-dark(#a7f3d0, rgba(16, 185, 129, 0.3))' }}>
                <Group align="flex-start" gap="sm">
                  <ThemeIcon size="lg" radius="xl" color="teal" variant="filled">
                    <IconCheck size={18} />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={700} c="teal.9">
                      {t('card.hiredTitle', '¡Felicitaciones! Has sido seleccionado')}
                    </Text>
                    <Text size="xs" c="teal.8" mt={2} lh={1.5}>
                      {t('card.hiredMessage', 'El equipo de Consultoría Global te contactará a la brevedad para coordinar los próximos pasos.')}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ) : isRejected ? (
              <Paper p="md" radius="md" bg="light-dark(#fef2f2, rgba(239, 68, 68, 0.1))" style={{ border: '1px solid light-dark(#fecaca, rgba(239, 68, 68, 0.3))' }}>
                <Group align="flex-start" gap="sm">
                  <ThemeIcon size="lg" radius="xl" color="red" variant="light">
                    <IconX size={18} />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={700} c="red.9">
                      {t('card.rejected', 'Proceso finalizado')}
                    </Text>
                    <Text size="xs" c="red.8" mt={2} lh={1.5}>
                      {t(
                        'card.rejectedMessage',
                        'Agradecemos tu tiempo y postulación. En esta oportunidad el equipo avanzó con otros perfiles, pero mantendremos tus datos para futuras búsquedas.'
                      )}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ) : (
              <Paper p="md" radius="md" bg="light-dark(#f8fafc, #0f172a)" withBorder style={{ flex: 1, borderColor: 'light-dark(#e2e8f0, #334155)' }}>
                <Stack justify="space-between" h="100%" gap="sm">
                  <Group gap="sm" align="center">
                    <ThemeIcon size={38} radius="xl" color="blue" variant="light">
                      <IconClock size={18} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" fw={700} c="blue.7" tt="uppercase">
                        {t('card.underReviewBadge', 'Revisión en curso')}
                      </Text>
                      <Text size="sm" fw={700} c="light-dark(#0f172a, #f8fafc)">
                        {t('card.underReview', 'Postulación activa')}
                      </Text>
                    </Box>
                  </Group>

                  <Text size="xs" c="dimmed" lh={1.6}>
                    {t(
                      'card.underReviewMessage',
                      'Tu perfil y años de experiencia en las tecnologías requeridas están siendo evaluados por los reclutadores.'
                    )}
                  </Text>

                  <Box pt="xs" style={{ borderTop: '1px solid light-dark(#e2e8f0, #334155)' }}>
                    <Group gap={6} c="dimmed">
                      <IconSend size={13} />
                      <Text size="xs">
                        {t('card.emailNotificationNotice', 'Te notificaremos por email cuando haya novedades.')}
                      </Text>
                    </Group>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </StyledApplicationCard>
  );
};
