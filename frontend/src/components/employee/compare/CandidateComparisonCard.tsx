import {
  Card,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Accordion,
  LoadingOverlay,
  Paper,
  Grid,
  Box
} from '@mantine/core';
import { IconX, IconCalendarEvent, IconDownload, IconMail, IconPhone, IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCandidateQuery } from '../../../hooks/api/useCandidates';
import { useCandidateInterviewsQuery } from '../../../hooks/api/useInterviews';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';

interface CandidateComparisonCardProps {
  application: CandidateApplication;
  onReject: (application: CandidateApplication) => void;
  onScheduleInterview: (applicationId: string) => void;
  onHire: (application: CandidateApplication) => void;
  getStatusColor: (status: ApplicationStatus) => string;
  accordionValue: string[];
  onAccordionChange: (value: string[]) => void;
}

export function CandidateComparisonCard({
  application,
  onReject,
  onScheduleInterview,
  onHire,
  getStatusColor,
  accordionValue,
  onAccordionChange
}: CandidateComparisonCardProps) {
  const { t } = useTranslation('candidates');
  const { data: candidateProfile, isLoading: isLoadingProfile } = useCandidateQuery(application.candidate.id);
  const { data: interviewsData, isLoading: isLoadingInterviews } = useCandidateInterviewsQuery(application.candidate.id);

  const interviews = interviewsData?.data?.filter(i =>
    i.applications.some(app => app.id === application.id)
  ).sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()) || [];

  const isLoading = isLoadingProfile || isLoadingInterviews;

  return (
    <Card
      shadow="sm"
      padding={0}
      radius="md"
      withBorder
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <LoadingOverlay visible={isLoading} />

      {/* Sticky Header */}
      <Paper
        p="md"
        radius={0}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid var(--mantine-color-default-border)',
          backgroundColor: 'var(--mantine-color-body)'
        }}
      >
        <Group mb="sm">
          <CandidateAvatar
            candidateId={application.candidate.id}
            firstName={application.candidate.user.first_name}
            lastName={application.candidate.user.last_name}
            size="lg"
            radius="xl"
          />
          <div style={{ flex: 1 }}>
            <Text fw={700} size="lg">
              {application.candidate.user.first_name} {application.candidate.user.last_name}
            </Text>
            <Group gap="xs" mt={4}>
              <IconMail size={14} style={{ opacity: 0.6 }} />
              <Text size="sm" c="dimmed">{application.candidate.user.email}</Text>
            </Group>
            {candidateProfile?.phone && (
              <Group gap="xs" mt={2}>
                <IconPhone size={14} style={{ opacity: 0.6 }} />
                <Text size="xs" c="dimmed">{candidateProfile.phone}</Text>
              </Group>
            )}
          </div>
        </Group>

        <Badge color={getStatusColor(application.status)} variant="light" w="fit-content">
          {application.status}
        </Badge>
      </Paper>

      {/* Download CV Button */}
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Button
          leftSection={<IconDownload size={16} />}
          variant="subtle"
          fullWidth
          disabled
        >
          {t('candidate.management.links.downloadResume', { ns: 'profile' })}
        </Button>
      </Box>

      {/* Scrollable Content */}
      <Box style={{ flex: 1, overflowY: 'auto', position: 'relative' }} p="md">
        <Stack gap="md">
          {/* Interviews & Reviews Section */}
          <Box>
            <Text fw={600} size="sm" c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-white))">
              {t('compare.card.sections.interviewHistory')}
            </Text>
            <CandidateInterviewsDisplay
              interviews={interviews}
              applicationId={application.id}
            />
          </Box>

          {/* Skills Section - Always rendered */}
          <Box>
            <Accordion
              variant="separated"
              multiple
              value={accordionValue}
              onChange={onAccordionChange}
            >
              <Accordion.Item value="skills">
                <Accordion.Control>{t('compare.card.sections.skills')}</Accordion.Control>
                <Accordion.Panel>
                  {application.skill_answers && application.skill_answers.length > 0 ? (
                    <Grid gutter="xs">
                      {application.skill_answers.map(answer => {
                        const isLong = answer.job_offer_skill.skill_name.length > 10;
                        return (
                          <Grid.Col key={answer.id} span={isLong ? 12 : 6}>
                            <Paper p="xs" withBorder>
                              <Group justify="space-between" wrap="nowrap" gap="xs">
                                <Text fw={600} size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {answer.job_offer_skill.skill_name}
                                </Text>
                                <Badge variant="light" color="blue" size="xs" style={{ flexShrink: 0 }}>
                                  {answer.years_of_experience} {answer.years_of_experience === 1 ? t('compare.card.year') : t('compare.card.years')}
                                </Badge>
                              </Group>
                            </Paper>
                          </Grid.Col>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Text size="sm" c="dimmed">{t('compare.card.empty.skills')}</Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Box>

          {/* Work Experience Section */}
          <Box>
            <Accordion
              variant="separated"
              multiple
              value={accordionValue}
              onChange={onAccordionChange}
            >
              <Accordion.Item value="experience">
                <Accordion.Control>{t('experience.title', { ns: 'profile' })}</Accordion.Control>
                <Accordion.Panel>
                  {candidateProfile?.work_experiences && candidateProfile.work_experiences.length > 0 ? (
                    <Stack gap="md">
                      {candidateProfile.work_experiences.map(exp => (
                        <div key={exp.id}>
                          <Text fw={600} size="sm">{exp.position}</Text>
                          <Text size="sm" c="dimmed">{exp.company_name}</Text>
                          <Text size="xs" c="dimmed">
                            {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : t('present', { ns: 'common' })}
                          </Text>
                          {exp.description && (
                            <Text size="sm" mt="xs">{exp.description}</Text>
                          )}
                        </div>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed">{t('compare.card.empty.experience')}</Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Box>

          {/* Education Section */}
          <Box>
            <Accordion
              variant="separated"
              multiple
              value={accordionValue}
              onChange={onAccordionChange}
            >
              <Accordion.Item value="education">
                <Accordion.Control>{t('education.title', { ns: 'profile' })}</Accordion.Control>
                <Accordion.Panel>
                  {candidateProfile?.educations && candidateProfile.educations.length > 0 ? (
                    <Stack gap="md">
                      {candidateProfile.educations.map(edu => (
                        <div key={edu.id}>
                          <Text fw={600} size="sm">{edu.degree_type} - {edu.field_of_study}</Text>
                          <Text size="sm" c="dimmed">{edu.institution}</Text>
                          <Text size="xs" c="dimmed">
                            {new Date(edu.start_date).toLocaleDateString()} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : t('present', { ns: 'common' })}
                          </Text>
                          {edu.description && (
                            <Text size="sm" mt="xs">{edu.description}</Text>
                          )}
                        </div>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed">{t('compare.card.empty.education')}</Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Box>

          {/* Additional Info Section */}
          <Box>
            <Accordion
              variant="separated"
              multiple
              value={accordionValue}
              onChange={onAccordionChange}
            >
              <Accordion.Item value="info">
                <Accordion.Control>{t('candidate.personalInfo', { ns: 'profile' })}</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs">
                    {candidateProfile?.age && (
                      <Text size="sm"><strong>{t('candidate.age', { ns: 'profile' })}:</strong> {candidateProfile.age}</Text>
                    )}
                    {candidateProfile?.city && candidateProfile?.country && (
                      <Text size="sm"><strong>{t('candidate.city', { ns: 'profile' })}/{t('candidate.country', { ns: 'profile' })}:</strong> {candidateProfile.city}, {candidateProfile.country}</Text>
                    )}
                    {candidateProfile?.linkedin && (
                      <Text size="sm">
                        <strong>{t('candidate.linkedin', { ns: 'profile' })}:</strong>{' '}
                        <a href={candidateProfile.linkedin} target="_blank" rel="noopener noreferrer">
                          Profile
                        </a>
                      </Text>
                    )}
                    {candidateProfile?.github && (
                      <Text size="sm">
                        <strong>{t('candidate.github', { ns: 'profile' })}:</strong>{' '}
                        <a href={candidateProfile.github} target="_blank" rel="noopener noreferrer">
                          Profile
                        </a>
                      </Text>
                    )}
                    {!candidateProfile?.age && !candidateProfile?.city && !candidateProfile?.linkedin && !candidateProfile?.github && (
                      <Text size="sm" c="dimmed">{t('compare.card.empty.info')}</Text>
                    )}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Box>
        </Stack>
      </Box>

      {/* Fixed Footer with Action Buttons */}
      <Paper
        p="md"
        radius={0}
        style={{
          borderTop: '1px solid var(--mantine-color-default-border)',
          marginTop: 'auto',
          backgroundColor: 'var(--mantine-color-body)'
        }}
      >
        <Stack gap="xs">
          {application.status !== ApplicationStatus.HIRED && application.status !== ApplicationStatus.REJECTED && (
            <Button
              leftSection={<IconCheck size={16} />}
              variant="filled"
              color="green"
              fullWidth
              onClick={() => onHire(application)}
            >
              {t('candidate.actions.hire', { ns: 'profile' })}
            </Button>
          )}
          <Button
            leftSection={<IconCalendarEvent size={16} />}
            variant="light"
            fullWidth
            onClick={() => onScheduleInterview(application.id)}
          >
            {t('candidate.actions.schedule', { ns: 'profile' })}
          </Button>
          <Button
            leftSection={<IconX size={16} />}
            variant="light"
            color="red"
            fullWidth
            onClick={() => onReject(application)}
          >
            {t('candidate.actions.reject', { ns: 'profile' })}
          </Button>
        </Stack>
      </Paper>
    </Card>
  );
}
