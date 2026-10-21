import {
  Stack,
  Group,
  Text,
  Button,
  LoadingOverlay,
  Box,
  Progress,
  Timeline,
  ActionIcon,
  Badge,
  Tooltip,
  useMantineColorScheme,
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
  IconBrandLinkedin,
  IconBrandGithub,
  IconChevronDown,
  IconChevronRight,
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
import { parseLocalDate } from '../../../utils/dateUtils';

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

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  accordionValue: string[];
  onToggle: () => void;
  isDark: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, value, accordionValue, onToggle, isDark, children }: SectionProps) {
  const isOpen = accordionValue.includes(value);

  return (
    <Box
      style={{
        borderRadius: 12,
        border: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
        overflow: 'hidden',
      }}
    >
      <Box
        px="md"
        py="sm"
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          background: isDark ? '#0f172a' : '#f8fafc',
          borderBottom: isOpen ? `1px solid ${isDark ? '#334155' : '#f1f5f9'}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <Group gap="sm">
          {icon}
          <Text size="xs" fw={700} style={{ color: isDark ? '#94a3b8' : '#475569', letterSpacing: '0.03em' }}>
            {title}
          </Text>
        </Group>
        {isOpen ? (
          <IconChevronDown size={14} color={isDark ? '#64748b' : '#94a3b8'} />
        ) : (
          <IconChevronRight size={14} color={isDark ? '#64748b' : '#94a3b8'} />
        )}
      </Box>
      {isOpen && (
        <Box p="md" style={{ background: isDark ? '#1e293b' : '#ffffff' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export function CandidateComparisonCard({
  application,
  onReject,
  onScheduleInterview,
  onHire,
  accordionValue,
  onAccordionChange,
  techStats
}: CandidateComparisonCardProps) {
  const { t } = useTranslation(['candidates', 'profile']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
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
    } catch {
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

  const handleToggleSection = (sectionValue: string) => {
    onAccordionChange(
      accordionValue.includes(sectionValue)
        ? accordionValue.filter(v => v !== sectionValue)
        : [...accordionValue, sectionValue]
    );
  };

  return (
    <Box
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 20,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        background: isDark ? '#1e293b' : '#ffffff',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(15,23,42,0.08)',
        overflow: 'hidden',
      }}
    >
      <LoadingOverlay visible={isLoading} />

      {/* ── HEADER ── */}
      <Box
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
          overflow: 'hidden',
        }}
      >
        {/* Cover gradient strip */}
        <Box
          h={56}
          style={{
            background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #2563eb 100%)',
          }}
        />

        <Box px="lg" pb="md" style={{ background: isDark ? '#1e293b' : '#ffffff' }}>
          {/* Avatar overlaps cover */}
          <Group mb="sm" align="flex-end" style={{ marginTop: -32 }} wrap="nowrap">
            <Box style={{ flexShrink: 0 }}>
              <Box
                style={{
                  borderRadius: 14,
                  border: `3px solid ${isDark ? '#1e293b' : '#ffffff'}`,
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                }}
              >
                <CandidateAvatar
                  candidateId={application.candidate.id}
                  firstName={application.candidate.user.first_name}
                  lastName={application.candidate.user.last_name}
                  size={60}
                />
              </Box>
            </Box>
            <Box style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
              <Text fw={700} size="md" truncate style={{ lineHeight: 1.2, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                {application.candidate.user.first_name} {application.candidate.user.last_name}
              </Text>
              {latestExperience && (
                <Text size="xs" fw={500} c="dimmed" truncate style={{ lineHeight: 1.2 }}>
                  {latestExperience.position}
                </Text>
              )}
              {(candidateProfile?.city || candidateProfile?.country) && (
                <Group gap={4} wrap="nowrap" style={{ lineHeight: 1.2, marginTop: 2 }}>
                  <IconMapPin size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <Text size="xs" c="dimmed" truncate>
                    {candidateProfile.city}{candidateProfile.city && candidateProfile.country ? ', ' : ''}{candidateProfile.country}
                  </Text>
                </Group>
              )}
            </Box>
          </Group>

          {/* Action links */}
          <Group gap="xs" mt={4} wrap="wrap">
            <Tooltip label={resume ? t('candidate.management.links.downloadResume', { ns: 'profile' }) : t('candidate.management.links.noResume', { ns: 'profile' })}>
              <Button
                variant="light"
                size="xs"
                disabled={!resume}
                onClick={handleDownloadResume}
                radius="md"
                leftSection={<IconDownload size={13} />}
              >
                CV
              </Button>
            </Tooltip>

            <Tooltip label="LinkedIn">
              <ActionIcon
                variant="light"
                color="blue"
                size="sm"
                component="a"
                href={candidateProfile?.linkedin || undefined}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!candidateProfile?.linkedin}
                radius="md"
              >
                <IconBrandLinkedin size={14} />
              </ActionIcon>
            </Tooltip>

            {candidateProfile?.github && (
              <Tooltip label="GitHub">
                <ActionIcon
                  variant="light"
                  color="gray"
                  size="sm"
                  component="a"
                  href={candidateProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="md"
                >
                  <IconBrandGithub size={14} />
                </ActionIcon>
              </Tooltip>
            )}

            <Badge
              variant="light"
              color={application.status === ApplicationStatus.HIRED ? 'green' : application.status === ApplicationStatus.REJECTED ? 'red' : 'blue'}
              size="sm"
              radius="md"
              ml="auto"
            >
              {application.status}
            </Badge>
          </Group>
        </Box>
      </Box>

      {/* ── SCROLLABLE CONTENT ── */}
      <Box style={{ flex: 1, overflowY: 'auto', position: 'relative' }} p="md">
        <Stack gap="sm">
          {/* Skills Section */}
          <CollapsibleSection
            title={t('compare.card.sections.yearsPerTech')}
            icon={<IconStar size={13} color="#f59e0b" />}
            value="skills"
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('skills')}
            isDark={isDark}
          >
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
                      <Group justify="space-between" mb={5}>
                        <Group gap={5} style={{ maxWidth: '70%' }} wrap="nowrap">
                          <Text size="sm" fw={500}>
                            {skillName}
                          </Text>
                          {isTop && (
                            <Box style={{ color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                              <IconStar size={13} />
                            </Box>
                          )}
                        </Group>
                        <Text size="xs" fw={700} c={isTop ? 'yellow.6' : 'dimmed'}>
                          {years} {years === 1 ? t('compare.card.year') : t('compare.card.years')}
                        </Text>
                      </Group>
                      {isTop ? (
                        <TopSkillProgressBar />
                      ) : (
                        <Progress
                          value={progressValue}
                          color="blue.4"
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
          </CollapsibleSection>

          {/* Work Experience Section */}
          <CollapsibleSection
            title={t('experience.title', { ns: 'profile' })}
            icon={<IconBriefcase size={13} color="#3b82f6" />}
            value="experience"
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('experience')}
            isDark={isDark}
          >
            {candidateProfile?.work_experiences && candidateProfile.work_experiences.length > 0 ? (
              <Timeline
                active={candidateProfile.work_experiences.length}
                bulletSize={12}
                lineWidth={1}
                color="blue.3"
              >
                {candidateProfile.work_experiences.map(exp => (
                  <Timeline.Item key={exp.id} title={<Text fw={600} size="sm">{exp.position}</Text>}>
                    <Text size="xs" c="dimmed">{exp.company_name}</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {parseLocalDate(exp.start_date)?.toLocaleDateString()} — {exp.end_date ? parseLocalDate(exp.end_date)?.toLocaleDateString() : t('present', { ns: 'common' })}
                    </Text>
                    {exp.description && (
                      <Text size="xs" mt={4} c="dimmed" lineClamp={2}>{exp.description}</Text>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Text size="sm" c="dimmed">{t('compare.card.empty.experience')}</Text>
            )}
          </CollapsibleSection>

          {/* Education Section */}
          <CollapsibleSection
            title={t('education.title', { ns: 'profile' })}
            icon={<IconSchool size={13} color="#10b981" />}
            value="education"
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('education')}
            isDark={isDark}
          >
            {candidateProfile?.educations && candidateProfile.educations.length > 0 ? (
              <Stack gap="sm">
                {candidateProfile.educations.map(edu => (
                  <Box
                    key={edu.id}
                    p="sm"
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
                      background: isDark ? '#0f172a' : '#f8fafc',
                    }}
                  >
                    <Text fw={600} size="sm">{edu.degree_type} — {edu.field_of_study}</Text>
                    <Text size="xs" c="dimmed">{edu.institution}</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {parseLocalDate(edu.start_date)?.toLocaleDateString()} — {edu.end_date ? parseLocalDate(edu.end_date)?.toLocaleDateString() : t('present', { ns: 'common' })}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">{t('compare.card.empty.education')}</Text>
            )}
          </CollapsibleSection>

          {/* Interviews Section */}
          <CollapsibleSection
            title={t('compare.card.sections.interviewHistory')}
            icon={<IconCalendarEvent size={13} color="#8b5cf6" />}
            value="interviews"
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('interviews')}
            isDark={isDark}
          >
            <CandidateInterviewsDisplay
              interviews={interviews}
              applicationId={application.id}
            />
          </CollapsibleSection>
        </Stack>
      </Box>

      {/* ── FOOTER ACTIONS ── */}
      <Box
        p="md"
        style={{
          borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
          background: isDark ? '#0f172a' : '#f8fafc',
        }}
      >
        <Stack gap="xs">
          {application.status !== ApplicationStatus.HIRED && application.status !== ApplicationStatus.REJECTED && (
            <Button
              leftSection={<IconCheck size={15} />}
              variant="filled"
              color="green"
              fullWidth
              radius="md"
              size="sm"
              onClick={() => onHire(application)}
              style={{ fontWeight: 700 }}
            >
              {t('candidate.actions.hire', { ns: 'profile' })}
            </Button>
          )}
          <Button
            leftSection={<IconCalendarEvent size={15} />}
            variant="light"
            fullWidth
            radius="md"
            size="sm"
            onClick={() => onScheduleInterview(application.id)}
          >
            {t('candidate.actions.schedule', { ns: 'profile' })}
          </Button>
          <Button
            leftSection={<IconX size={15} />}
            variant="subtle"
            color="red"
            fullWidth
            radius="md"
            size="sm"
            onClick={() => onReject(application)}
          >
            {t('candidate.actions.reject', { ns: 'profile' })}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
