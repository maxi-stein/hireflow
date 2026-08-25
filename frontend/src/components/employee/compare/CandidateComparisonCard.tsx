import {
  Card,
  Stack,
  Group,
  Text,
  Button,
  Accordion,
  LoadingOverlay,
  Paper,
  Grid,
  Box,
  Progress,
  Timeline,
  ActionIcon
} from '@mantine/core';
import {
  IconX,
  IconCalendarEvent,
  IconDownload,
  IconCheck,
  IconStar,
  IconSchool,
  IconBriefcase,
  IconMapPin,
  IconUsers,
  IconFlame,
  IconBrandLinkedin,
  IconBrandGithub
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCandidateQuery } from '../../../hooks/api/useCandidates';
import { useCandidateInterviewsQuery } from '../../../hooks/api/useInterviews';
import { useCandidateFilesQuery } from '../../../hooks/api/useUserFiles';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { FileType, userFileService } from '../../../services/user-file.service';
import { notifications } from '@mantine/notifications';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';
import type { TechExperienceStats } from '../../../hooks/useCandidateTechExperience';
import { TopSkillProgressBar } from './TopSkillProgressBar';
import styled from 'styled-components';

const StyledActionButton = styled(Button as any)`
  transition: background-color 0.3s ease, color 0.3s ease !important;

  &:not([disabled]):hover {
    background-color: #1864ab !important; /* Premium dark blue */
    color: #ffffff !important;
  }
`;

interface CandidateComparisonCardProps {
  application: CandidateApplication;
  onReject: (application: CandidateApplication) => void;
  onScheduleInterview: (applicationId: string) => void;
  onHire: (application: CandidateApplication) => void;
  getStatusColor: (status: ApplicationStatus) => string;
  accordionValue: string[];
  onAccordionChange: (value: string[]) => void;
  techStats?: TechExperienceStats;
}

export function CandidateComparisonCard({
  application,
  onReject,
  onScheduleInterview,
  onHire,
  getStatusColor,
  accordionValue,
  onAccordionChange,
  techStats
}: CandidateComparisonCardProps) {
  const { t } = useTranslation(['candidates', 'profile']);
  const { data: candidateProfile, isLoading: isLoadingProfile } = useCandidateQuery(application.candidate.id);
  const { data: interviewsData, isLoading: isLoadingInterviews } = useCandidateInterviewsQuery(application.candidate.id);
  const { data: files, isLoading: isLoadingFiles } = useCandidateFilesQuery(application.candidate.id);

  const resume = files?.find(f => f.file_type === FileType.RESUME);

  const handleDownloadResume = async () => {
    if (!resume) return;
    try {
      const blob = await userFileService.downloadFile(resume.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.file_name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notifications.show({
        title: t('candidate.notifications.errorTitle', { ns: 'profile' }),
        message: t('candidate.actions.downloadError', { ns: 'profile' }),
        color: 'red',
      });
    }
  };

  const interviews = interviewsData?.data?.filter(i =>
    i.applications.some(app => app.id === application.id)
  ).sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()) || [];

  const latestExperience = candidateProfile?.work_experiences?.length
    ? [...candidateProfile.work_experiences].sort((a, b) => {
      if (!a.end_date) return -1;
      if (!b.end_date) return 1;
      return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
    })[0]
    : null;

  const isLoading = isLoadingProfile || isLoadingInterviews || isLoadingFiles;

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
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid var(--mantine-color-default-border)',
          backgroundColor: 'var(--mantine-color-body)',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundImage: 'radial-gradient(circle at bottom right, rgba(51, 154, 240, 0.15) 0%, transparent 50%)',
          minHeight: 130
        }}
      >
        <Group mb="sm" align="flex-start" wrap="nowrap">
          <CandidateAvatar
            candidateId={application.candidate.id}
            firstName={application.candidate.user.first_name}
            lastName={application.candidate.user.last_name}
            size="lg"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack gap={3}>
              <Text fw={700} size="lg" truncate style={{ lineHeight: 1.2 }}>
                {application.candidate.user.first_name} {application.candidate.user.last_name}
              </Text>
              {latestExperience && (
                <Text size="sm" fw={500} c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-2))" truncate style={{ lineHeight: 1.2 }}>
                  {latestExperience.position}
                </Text>
              )}
              {(candidateProfile?.city || candidateProfile?.country) && (
                <Group gap={4} wrap="nowrap" style={{ lineHeight: 1.2 }}>
                  <IconMapPin size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
                  <Text size="xs" c="dimmed" truncate>
                    {candidateProfile.city}{candidateProfile.city && candidateProfile.country ? ', ' : ''}{candidateProfile.country}
                  </Text>
                </Group>
              )}
            </Stack>
          </div>
        </Group>

        <Group gap="xs" mt="sm" wrap="wrap">
          <StyledActionButton
            variant="subtle"
            size="xs"
            disabled={!resume}
            onClick={handleDownloadResume}
            px="sm"
            py={4}
            style={{ height: 'auto' }}
            leftSection={<IconDownload size={14} />}
          >
            {t('candidate.management.links.downloadResume', { ns: 'profile' })}
          </StyledActionButton>

          <StyledActionButton
            variant="subtle"
            size="xs"
            component="a"
            href={candidateProfile?.linkedin || undefined}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!candidateProfile?.linkedin}
            px="sm"
            py={4}
            style={{ height: 'auto' }}
            leftSection={<IconBrandLinkedin size={14} />}
          >
            LinkedIn
          </StyledActionButton>

          {candidateProfile?.github && (
            <StyledActionButton
              variant="subtle"
              size="xs"
              component="a"
              href={candidateProfile.github}
              target="_blank"
              rel="noopener noreferrer"
              px="sm"
              py={4}
              style={{ height: 'auto' }}
              leftSection={<IconBrandGithub size={14} />}
            >
              GitHub
            </StyledActionButton>
          )}
        </Group>
      </Paper>

      {/* Scrollable Content */}
      <Box style={{ flex: 1, overflowY: 'auto', position: 'relative' }} p="md">
        <Stack gap="md">
          {/* Skills Section - Always rendered */}
          <Box>
            <Accordion
              variant="separated"
              multiple
              value={accordionValue}
              onChange={onAccordionChange}
            >
              <Accordion.Item value="skills">
                <Accordion.Control icon={<IconStar size={15} color="var(--mantine-color-blue-filled)" />}>
                  <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>{t('compare.card.sections.yearsPerTech')}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  {application.skill_answers && application.skill_answers.length > 0 ? (
                    <Stack gap="md">
                      {application.skill_answers.map(answer => {
                        const skillName = answer.job_offer_skill.skill_name;
                        const years = answer.years_of_experience;
                        const isTop = techStats ? techStats.isTopCandidateForSkill(skillName, years) : false;
                        const maxYears = techStats?.maxYearsBySkill[skillName] || 10;
                        const progressValue = maxYears > 0 ? (years / maxYears) * 100 : 0;

                        return (
                          <Box key={answer.id}>
                            <Group justify="space-between" mb={4}>
                              <Group gap={4} style={{ maxWidth: '70%' }} wrap="nowrap">
                                <Text size="sm" fw={500}>
                                  {skillName}
                                </Text>
                                {isTop && (
                                  <ActionIcon
                                    variant="transparent"
                                    size="sm"
                                    color='yellow'
                                  >
                                    <IconStar size={14} />
                                  </ActionIcon>
                                )}
                              </Group>
                              <Text size="xs" c="dimmed">
                                {years} {years === 1 ? t('compare.card.year') : t('compare.card.years')}
                              </Text>
                            </Group>
                            {isTop ? (
                              <TopSkillProgressBar />
                            ) : (
                              <Progress
                                value={progressValue}
                                color="gray.5"
                                size="sm"
                                radius="xl"
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
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
                <Accordion.Control icon={<IconBriefcase size={15} color="var(--mantine-color-blue-filled)" />}>
                  <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>{t('experience.title', { ns: 'profile' })}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  {candidateProfile?.work_experiences && candidateProfile.work_experiences.length > 0 ? (
                    <Timeline active={candidateProfile.work_experiences.length} bulletSize={14} lineWidth={2} color="var(--mantine-color-blue-3)">
                      {candidateProfile.work_experiences.map(exp => (
                        <Timeline.Item key={exp.id} title={<Text fw={600} size="sm">{exp.position}</Text>}>
                          <Text size="xs" c="dimmed">{exp.company_name}</Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : t('present', { ns: 'common' })}
                          </Text>
                          {exp.description && (
                            <Text size="xs" mt={4} c="dimmed">{exp.description}</Text>
                          )}
                        </Timeline.Item>
                      ))}
                    </Timeline>
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
                <Accordion.Control icon={<IconSchool size={15} color="var(--mantine-color-blue-filled)" />}>
                  <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>{t('education.title', { ns: 'profile' })}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  {candidateProfile?.educations && candidateProfile.educations.length > 0 ? (
                    <Stack gap="xs">
                      {candidateProfile.educations.map(edu => (
                        <Paper key={edu.id} py="xs" pr="xs" pl="md" withBorder>
                          <Text fw={600} size="sm">{edu.degree_type} - {edu.field_of_study}</Text>
                          <Text size="xs" c="dimmed">{edu.institution}</Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            {new Date(edu.start_date).toLocaleDateString()} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : t('present', { ns: 'common' })}
                          </Text>
                          {edu.description && (
                            <Text size="xs" mt={4}>{edu.description}</Text>
                          )}
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed">{t('compare.card.empty.education')}</Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Box>


          {/* Interviews & Reviews Section */}
          <Box>
            <Accordion
              variant="separated"
              multiple
              value={accordionValue}
              onChange={onAccordionChange}
            >
              <Accordion.Item value="interviews">
                <Accordion.Control icon={<IconUsers size={15} color="var(--mantine-color-blue-filled)" />}>
                  <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>{t('compare.card.sections.interviewHistory')}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <CandidateInterviewsDisplay
                    interviews={interviews}
                    applicationId={application.id}
                  />
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
