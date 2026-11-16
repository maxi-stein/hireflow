import { Box, LoadingOverlay, Table, Stack, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CandidateTableRow } from './CandidateTableRow';
import type { CandidateProfile, PaginatedResponse } from '../../../services/candidate.service';

interface CandidatesTableProps {
  candidatesData?: PaginatedResponse<CandidateProfile>;
  isLoading: boolean;
  isDark: boolean;
}

export function CandidatesTable({
  candidatesData,
  isLoading,
  isDark,
}: CandidatesTableProps) {
  const { t } = useTranslation('candidates');

  return (
    <Box pos="relative" mih={300}>
      <LoadingOverlay visible={isLoading} zIndex={100} overlayProps={{ radius: 'sm', blur: 2 }} />

      <Table
        horizontalSpacing="xl"
        verticalSpacing="xs"
        highlightOnHover
        styles={{
          th: {
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isDark ? '#64748b' : '#94a3b8',
            paddingTop: 12,
            paddingBottom: 12,
            borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
            background: isDark ? '#0f172a' : '#f8fafc',
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="30%">{t('list.table.candidate')}</Table.Th>
            <Table.Th w="20%">{t('list.table.profile')}</Table.Th>
            <Table.Th w="28%">{t('list.table.applications')}</Table.Th>
            <Table.Th w="12%">{t('list.table.lastUpdated')}</Table.Th>
            <Table.Th w="10%" style={{ textAlign: 'right' }}>{t('list.table.actions')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {candidatesData?.data.map((candidate) => (
            <CandidateTableRow key={candidate.id} candidate={candidate} />
          ))}
          {!isLoading && candidatesData?.data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Stack align="center" py="xl" gap="xs">
                  <Box
                    p="lg"
                    style={{
                      borderRadius: '50%',
                      background: isDark ? '#334155' : '#f1f5f9',
                    }}
                  >
                    <IconUser size={32} color={isDark ? '#64748b' : '#94a3b8'} />
                  </Box>
                  <Text c="dimmed" fw={500}>{t('list.table.empty')}</Text>
                </Stack>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
