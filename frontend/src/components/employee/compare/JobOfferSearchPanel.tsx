import { Box, TextInput, SimpleGrid, Text, useMantineColorScheme } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { JobOfferAccordionItem } from './JobOfferAccordionItem';
import type { JobOffer } from '../../../services/job-offer.service';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { IconBriefcase } from '@tabler/icons-react';

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
  const { t } = useTranslation('candidates');
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const bgColors = ['blue', 'teal', 'grape', 'orange', 'indigo', 'green', 'cyan', 'pink'];

  const handleJobToggle = (jobId: string) => {
    onJobSelect(selectedJobOfferId === jobId ? null : jobId);
  };

  return (
    <Box
      style={{
        borderRadius: 16,
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        background: dark ? '#1e293b' : '#ffffff',
        overflow: 'hidden',
        boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(15,23,42,0.05)',
      }}
    >
      {/* Search toolbar */}
      <Box
        px="xl"
        py="md"
        style={{
          background: dark ? '#0f172a' : '#f8fafc',
          borderBottom: `1px solid ${dark ? '#334155' : '#f1f5f9'}`,
        }}
      >
        <TextInput
          placeholder={t('compare.searchPanel.placeholder')}
          leftSection={<IconSearch size={15} />}
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          radius="md"
        />
      </Box>

      <Box p="xl">
        {isLoadingJobs && (
          <Text ta="center" c="dimmed" py="xl">{t('compare.searchPanel.loading')}</Text>
        )}

        {!isLoadingJobs && jobOffers.length === 0 && (
          <Box py="xl" style={{ textAlign: 'center' }}>
            <Box
              p="lg"
              mx="auto"
              mb="md"
              style={{
                width: 'fit-content',
                borderRadius: '50%',
                background: dark ? '#334155' : '#f1f5f9',
              }}
            >
              <IconBriefcase size={28} color={dark ? '#64748b' : '#94a3b8'} />
            </Box>
            <Text c="dimmed">{t('compare.searchPanel.empty')}</Text>
          </Box>
        )}

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
                onToggle={handleJobToggle}
                isLoadingApps={isLoadingApps && isOpen}
                filteredCandidates={isOpen ? filteredCandidates : []}
                selectedCandidates={selectedCandidates}
                onCandidateToggle={onCandidateToggle}
                isDark={isDark}
              />
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
