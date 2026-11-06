import { Box, Group, Text, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  value: string;
  accordionValue: string[];
  onToggle: () => void;
  isDark?: boolean;
  children: ReactNode;
  badge?: ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  value,
  accordionValue,
  onToggle,
  isDark: propIsDark,
  children,
  badge,
}: CollapsibleSectionProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = propIsDark !== undefined ? propIsDark : colorScheme === 'dark';
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
          {badge}
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

