import { Progress } from '@mantine/core';

export function TopSkillProgressBar() {
  // Divide total value in 3 parts to create a gradient effect
  const part1 = 46;
  const part2 = 5;
  const part3 = 100 - part1 - part2;

  return (
    <Progress.Root size="sm">

      <Progress.Section
        value={part1}
        color="yellow.6"
      />

      <Progress.Section
        value={part2}
        style={{
          backgroundImage: `linear-gradient(to right, var(--mantine-color-yellow-6), var(--mantine-color-yellow-9))`
        }}
      />

      <Progress.Section
        value={part3}
        style={{ backgroundColor: 'var(--mantine-color-yellow-9)' }}
      />

    </Progress.Root>
  );
}
