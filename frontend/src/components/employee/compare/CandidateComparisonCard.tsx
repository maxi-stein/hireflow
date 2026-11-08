import {
  Stack,
  LoadingOverlay,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import type { ApplicationStatus } from '../../../services/candidate-application.service';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import type { TechExperienceStats } from '../../../hooks/useCandidateTechExperience';
import { useCandidateComparisonCardData } from '../../../hooks/domain/useCandidateComparisonCardData';
import { CandidateComparisonHeader } from './CandidateComparisonHeader';
import { ComparisonSkillsSection } from './ComparisonSkillsSection';
import { ComparisonExperienceSection } from './ComparisonExperienceSection';
import { ComparisonEducationSection } from './ComparisonEducationSection';
import { CandidateComparisonFooter } from './CandidateComparisonFooter';

interface CandidateComparisonCardProps {
  application: CandidateApplication;
  onReject: (application: CandidateApplication) => void;
  onScheduleInterview: (applicationId: string) => void;
  onHire: (application: CandidateApplication) => void;
  getStatusColor?: (status: ApplicationStatus) => string;
  accordionValue: string[];
  onAccordionChange: (value: string[]) => void;
  techStats?: TechExperienceStats;
}

export function CandidateComparisonCard({
  application,
  onReject,
  onScheduleInterview,
  onHire,
  accordionValue,
  onAccordionChange,
  techStats,
}: CandidateComparisonCardProps) {
  const { t } = useTranslation(['candidates']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    candidateProfile,
    resume,
    handleDownloadResume,
    interviews,
    latestExperience,
    isLoading,
  } = useCandidateComparisonCardData({
    candidateId: application.candidate.id,
    applicationId: application.id,
  });

  const handleToggleSection = (sectionValue: string) => {
    onAccordionChange(
      accordionValue.includes(sectionValue)
          ? accordionValue.filter((v) => v !== sectionValue)
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
        <CandidateComparisonHeader
          application={application}
          candidateProfile={candidateProfile}
          latestExperience={latestExperience}
          hasResume={!!resume}
          onDownloadResume={handleDownloadResume}
        />

      {/* ── SCROLLABLE CONTENT ── */}
      <Box style={{ flex: 1, overflowY: 'auto', position: 'relative' }} p="md">
        <Stack gap="sm">
          {/* Skills Section */}
          <ComparisonSkillsSection
            skillAnswers={application.skill_answers}
            techStats={techStats}
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('skills')}
            isDark={isDark}
          />

          {/* Work Experience Section */}
          <ComparisonExperienceSection
            workExperiences={candidateProfile?.work_experiences}
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('experience')}
            isDark={isDark}
          />

          {/* Education Section */}
          <ComparisonEducationSection
            educations={candidateProfile?.educations}
            accordionValue={accordionValue}
            onToggle={() => handleToggleSection('education')}
            isDark={isDark}
          />

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
      <CandidateComparisonFooter
        status={application.status}
        onHire={() => onHire(application)}
        onSchedule={() => onScheduleInterview(application.id)}
        onReject={() => onReject(application)}
      />
    </Box>
  );
}
