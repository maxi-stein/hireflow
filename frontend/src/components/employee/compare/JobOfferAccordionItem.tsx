import { memo } from 'react';
import { Accordion, Group, Text, Badge, LoadingOverlay } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CandidateSelectionList } from './CandidateSelectionList';
import type { JobOffer } from '../../../services/job-offer.service';
import type { CandidateApplication } from '../../../services/candidate-application.service';

export interface JobOfferAccordionItemProps {
  offer: JobOffer;
  color: string;
  isOpen: boolean;
  onToggle: (offerId: string) => void;
  isLoadingApps: boolean;
  filteredCandidates: CandidateApplication[];
  selectedCandidates: Set<string>;
  onCandidateToggle: (candidateId: string) => void;
  isDark: boolean;
}

/**
 * Individual job offer accordion item
 * Displays position, location, applicant count, and candidate selection list
 * Memoized to prevent re-renders when other job offers change
 */
function JobOfferAccordionItemComponent({
  offer,
  color,
  isOpen,
  onToggle,
  isLoadingApps,
  filteredCandidates,
  selectedCandidates,
  onCandidateToggle,
  isDark,
}: JobOfferAccordionItemProps) {
  const { t } = useTranslation('candidates');
  return (
    <Accordion
      variant="separated"
      value={isOpen ? offer.id : null}
      onChange={() => onToggle(offer.id)}
      styles={{
        item: {
          backgroundColor: isDark
            ? `var(--mantine-color-${color}-light)`
            : `var(--mantine-color-${color}-light)`,
          borderColor: `var(--mantine-color-${color}-light-color)`,
        },
        control: {
          '&:hover': {
            backgroundColor: isDark
              ? `var(--mantine-color-${color}-9)`
              : `var(--mantine-color-${color}-1)`,
          }
        }
      }}
    >
      <Accordion.Item value={offer.id}>
        <Accordion.Control>
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text fw={500}>{offer.position}</Text>
            </div>
            <Badge>{t('compare.searchPanel.applicants', { count: offer.applicants_count })}</Badge>
          </Group>
        </Accordion.Control>
        <Accordion.Panel style={{ position: 'relative', minHeight: 100 }}>
          <LoadingOverlay visible={isLoadingApps} />
          <CandidateSelectionList
            candidates={filteredCandidates}
            selectedCandidates={selectedCandidates}
            onCandidateToggle={onCandidateToggle}
            isDark={isDark}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export const JobOfferAccordionItem = memo(JobOfferAccordionItemComponent);
