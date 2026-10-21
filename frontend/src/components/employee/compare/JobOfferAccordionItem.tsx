import { memo } from 'react';
import { Box, Text, Badge, LoadingOverlay, Stack, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconBriefcase, IconUsers } from '@tabler/icons-react';
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

const colorMap: Record<string, { bg: string; bgDark: string; border: string; borderDark: string; icon: string }> = {
  blue:   { bg: '#eff6ff', bgDark: 'rgba(37,99,235,0.12)',  border: '#bfdbfe', borderDark: '#1e40af', icon: '#3b82f6' },
  teal:   { bg: '#f0fdfa', bgDark: 'rgba(20,184,166,0.12)', border: '#99f6e4', borderDark: '#0f766e', icon: '#14b8a6' },
  grape:  { bg: '#faf5ff', bgDark: 'rgba(139,92,246,0.12)', border: '#e9d5ff', borderDark: '#6d28d9', icon: '#8b5cf6' },
  orange: { bg: '#fff7ed', bgDark: 'rgba(249,115,22,0.12)', border: '#fed7aa', borderDark: '#c2410c', icon: '#f97316' },
  indigo: { bg: '#eef2ff', bgDark: 'rgba(99,102,241,0.12)', border: '#c7d2fe', borderDark: '#4338ca', icon: '#6366f1' },
  green:  { bg: '#f0fdf4', bgDark: 'rgba(34,197,94,0.12)',  border: '#bbf7d0', borderDark: '#15803d', icon: '#22c55e' },
  cyan:   { bg: '#ecfeff', bgDark: 'rgba(6,182,212,0.12)',  border: '#a5f3fc', borderDark: '#0e7490', icon: '#06b6d4' },
  pink:   { bg: '#fdf2f8', bgDark: 'rgba(236,72,153,0.12)', border: '#fbcfe8', borderDark: '#be185d', icon: '#ec4899' },
};

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
  const palette = colorMap[color] || colorMap['blue'];

  return (
    <Box
      style={{
        borderRadius: 14,
        border: `1px solid ${isDark ? palette.borderDark : palette.border}`,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        boxShadow: isOpen
          ? (isDark ? `0 4px 20px rgba(0,0,0,0.4)` : '0 4px 20px rgba(15,23,42,0.08)')
          : 'none',
      }}
    >
      {/* Header */}
      <Box
        px="lg"
        py="md"
        onClick={() => onToggle(isOpen ? '' as any : offer.id)}
        style={{
          cursor: 'pointer',
          background: isDark ? palette.bgDark : palette.bg,
          borderBottom: isOpen ? `1px solid ${isDark ? palette.borderDark : palette.border}` : 'none',
          transition: 'background 0.15s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.filter = 'brightness(0.96)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.filter = 'none';
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <Box
              style={{
                padding: 7,
                borderRadius: 8,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                display: 'flex',
                flexShrink: 0,
              }}
            >
              <IconBriefcase size={15} color={palette.icon} />
            </Box>
            <Text fw={700} size="sm" lineClamp={1} style={{ color: isDark ? '#f1f5f9' : '#0f172a', flex: 1 }}>
              {offer.position}
            </Text>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Badge
              size="sm"
              radius="md"
              variant="light"
              color={color}
              leftSection={<IconUsers size={11} />}
            >
              {t('compare.searchPanel.applicants', { count: offer.applicants_count })}
            </Badge>
            {isOpen ? (
              <IconChevronUp size={16} color={isDark ? '#64748b' : '#94a3b8'} />
            ) : (
              <IconChevronDown size={16} color={isDark ? '#64748b' : '#94a3b8'} />
            )}
          </Box>
        </Box>
      </Box>

      {/* Content panel */}
      {isOpen && (
        <Box
          p="md"
          style={{
            position: 'relative',
            minHeight: 80,
            background: isDark ? '#1e293b' : '#ffffff',
          }}
        >
          <LoadingOverlay visible={isLoadingApps} />
          <CandidateSelectionList
            candidates={filteredCandidates}
            selectedCandidates={selectedCandidates}
            onCandidateToggle={onCandidateToggle}
            isDark={isDark}
          />
        </Box>
      )}
    </Box>
  );
}

export const JobOfferAccordionItem = memo(JobOfferAccordionItemComponent);
