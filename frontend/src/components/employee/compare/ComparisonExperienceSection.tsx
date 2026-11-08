import { Text, Timeline } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { parseLocalDate } from '../../../utils/dateUtils';
import type { WorkExperience } from '../../../services/work-experience.service';

export interface ComparisonExperienceSectionProps {
  workExperiences?: WorkExperience[];
  accordionValue: string[];
  onToggle: () => void;
  isDark: boolean;
}

export const ComparisonExperienceSection = ({
  workExperiences,
  accordionValue,
  onToggle,
  isDark,
}: ComparisonExperienceSectionProps) => {
  const { t } = useTranslation(['candidates', 'profile', 'common']);

  return (
    <CollapsibleSection
      title={t('experience.title', { ns: 'profile' })}
      icon={<IconBriefcase size={13} color="#3b82f6" />}
      value="experience"
      accordionValue={accordionValue}
      onToggle={onToggle}
      isDark={isDark}
    >
      {workExperiences && workExperiences.length > 0 ? (
        <Timeline
          active={workExperiences.length}
          bulletSize={12}
          lineWidth={1}
          color="blue.3"
        >
          {workExperiences.map((exp) => (
            <Timeline.Item key={exp.id} title={<Text fw={600} size="sm">{exp.position}</Text>}>
              <Text size="xs" c="dimmed">{exp.company_name}</Text>
              <Text size="xs" c="dimmed" mt={2}>
                {parseLocalDate(exp.start_date)?.toLocaleDateString()} —{' '}
                {exp.end_date ? parseLocalDate(exp.end_date)?.toLocaleDateString() : t('present', { ns: 'common' })}
              </Text>
              {exp.description && (
                <Text size="xs" mt={4} c="dimmed" lineClamp={2}>
                  {exp.description}
                </Text>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Text size="sm" c="dimmed">
          {t('compare.card.empty.experience')}
        </Text>
      )}
    </CollapsibleSection>
  );
};

