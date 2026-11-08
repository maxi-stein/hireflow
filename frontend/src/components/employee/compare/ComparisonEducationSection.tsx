import { Box, Stack, Text } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { parseLocalDate } from '../../../utils/dateUtils';
import type { Education } from '../../../services/education.service';

export interface ComparisonEducationSectionProps {
  educations?: Education[];
  accordionValue: string[];
  onToggle: () => void;
  isDark: boolean;
}

export const ComparisonEducationSection = ({
  educations,
  accordionValue,
  onToggle,
  isDark,
}: ComparisonEducationSectionProps) => {
  const { t } = useTranslation(['candidates', 'profile', 'common']);

  return (
    <CollapsibleSection
      title={t('education.title', { ns: 'profile' })}
      icon={<IconSchool size={13} color="#10b981" />}
      value="education"
      accordionValue={accordionValue}
      onToggle={onToggle}
      isDark={isDark}
    >
      {educations && educations.length > 0 ? (
        <Stack gap="sm">
          {educations.map((edu) => (
            <Box
              key={edu.id}
              p="sm"
              style={{
                borderRadius: 10,
                border: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
                background: isDark ? '#0f172a' : '#f8fafc',
              }}
            >
              <Text fw={600} size="sm">
                {edu.degree_type} — {edu.field_of_study}
              </Text>
              <Text size="xs" c="dimmed">
                {edu.institution}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {parseLocalDate(edu.start_date)?.toLocaleDateString()} —{' '}
                {edu.end_date ? parseLocalDate(edu.end_date)?.toLocaleDateString() : t('present', { ns: 'common' })}
              </Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">
          {t('compare.card.empty.education')}
        </Text>
      )}
    </CollapsibleSection>
  );
};

