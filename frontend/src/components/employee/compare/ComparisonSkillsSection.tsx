import { Box, Group, Stack, Text, Progress } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { TopSkillProgressBar } from './TopSkillProgressBar';
import type { CandidateSkillAnswer } from '../../../services/candidate-application.service';
import type { TechExperienceStats } from '../../../hooks/useCandidateTechExperience';

export interface ComparisonSkillsSectionProps {
  skillAnswers?: CandidateSkillAnswer[];
  techStats?: TechExperienceStats;
  accordionValue: string[];
  onToggle: () => void;
  isDark: boolean;
}

export const ComparisonSkillsSection = ({
  skillAnswers,
  techStats,
  accordionValue,
  onToggle,
  isDark,
}: ComparisonSkillsSectionProps) => {
  const { t } = useTranslation(['candidates']);

  return (
    <CollapsibleSection
      title={t('compare.card.sections.yearsPerTech')}
      icon={<IconStar size={13} color="#f59e0b" />}
      value="skills"
      accordionValue={accordionValue}
      onToggle={onToggle}
      isDark={isDark}
    >
      {skillAnswers && skillAnswers.length > 0 ? (
        <Stack gap="md">
          {skillAnswers.map((answer) => {
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
        <Text size="sm" c="dimmed">
          {t('compare.card.empty.skills')}
        </Text>
      )}
    </CollapsibleSection>
  );
};

