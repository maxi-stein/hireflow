import { Paper, Group, Box, Text, ActionIcon, NumberInput } from '@mantine/core';
import { IconCode, IconMinus, IconPlus } from '@tabler/icons-react';
import type { JobOfferSkill } from '../../services/candidate-application.service';

interface SkillExperienceInputRowProps {
  skill: JobOfferSkill;
  value: number;
  onChange: (val: number) => void;
  error?: string;
}

export function SkillExperienceInputRow({
  skill,
  value,
  onChange,
  error,
}: SkillExperienceInputRowProps) {
  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: 'light-dark(#ffffff, #1e293b)',
        borderColor: value > 0 ? '#bfdbfe' : 'light-dark(#e2e8f0, #334155)',
        transition: 'border-color 0.2s ease',
      }}
    >
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Box style={{ flex: 1, minWidth: 200 }}>
          <Group gap="xs">
            <IconCode size={18} color="#2563eb" />
            <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
              {skill.skill_name}
            </Text>
          </Group>
        </Box>

        {/* Stepper & input controls */}
        <Group gap="xs" align="center">
          <ActionIcon
            size="md"
            variant="default"
            radius="md"
            disabled={value <= 0}
            onClick={() => onChange(Math.max(0, value - 1))}
            aria-label="Decrease years"
          >
            <IconMinus size={14} />
          </ActionIcon>

          <NumberInput
            min={0}
            max={40}
            step={1}
            w={80}
            size="sm"
            styles={{ input: { textAlign: 'center', fontWeight: 700 } }}
            value={value}
            onChange={(val) => onChange(typeof val === 'number' ? val : 0)}
            error={!!error}
          />

          <ActionIcon
            size="md"
            variant="default"
            radius="md"
            onClick={() => onChange(value + 1)}
            aria-label="Increase years"
          >
            <IconPlus size={14} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}

