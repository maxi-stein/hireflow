import { Paper, TextInput, SimpleGrid, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { JobOfferAccordionItem } from './JobOfferAccordionItem';
import type { JobOffer } from '../../../services/job-offer.service';
import type { CandidateApplication } from '../../../services/candidate-application.service';

export interface JobOfferSearchPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  jobOffers: JobOffer[];
  selectedJobOfferId: string | null;
  onJobSelect: (jobId: string | null) => void;
  selectedCandidates: Set<string>;
  onCandidateToggle: (candidateId: string) => void;
  isLoadingJobs: boolean;
  isLoadingApps: boolean;
  filteredCandidates: CandidateApplication[];
  isDark: boolean;
}

/**
 * Search panel with job offer accordion list
 * Allows users to search for job offers and select candidates within each offer
 */
export function JobOfferSearchPanel({
  search,
  onSearchChange,
  jobOffers,
  selectedJobOfferId,
  onJobSelect,
  selectedCandidates,
  onCandidateToggle,
  isLoadingJobs,
  isLoadingApps,
  filteredCandidates,
  isDark,
}: JobOfferSearchPanelProps) {
  const bgColors = ['blue', 'teal', 'grape', 'orange', 'indigo', 'green', 'cyan', 'pink'];

  return (
    <Paper p="md" withBorder>
      <TextInput
        placeholder="Search job offers by position..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        mb="md"
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {jobOffers.map((offer, index) => {
          const color = bgColors[index % bgColors.length];
          const isOpen = selectedJobOfferId === offer.id;

          return (
            <JobOfferAccordionItem
              key={offer.id}
              offer={offer}
              color={color}
              isOpen={isOpen}
              onToggle={onJobSelect}
              isLoadingApps={isLoadingApps && isOpen}
              filteredCandidates={isOpen ? filteredCandidates : []}
              selectedCandidates={selectedCandidates}
              onCandidateToggle={onCandidateToggle}
              isDark={isDark}
            />
          );
        })}
      </SimpleGrid>

      {isLoadingJobs && (
        <Text ta="center" c="dimmed" py="md">Loading job offers...</Text>
      )}

      {!isLoadingJobs && jobOffers.length === 0 && (
        <Text ta="center" c="dimmed" py="md">No job offers found</Text>
      )}
    </Paper>
  );
}
