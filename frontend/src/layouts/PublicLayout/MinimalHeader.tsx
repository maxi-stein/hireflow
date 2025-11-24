import { Group, Button, TextInput, useMantineColorScheme, Title } from '@mantine/core';

export function MinimalHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group justify="space-between" h="100%" px="md" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
      <Group>
        <Title order={3}>HireFlow</Title>
      </Group>

      <Group>
        <TextInput 
          placeholder="Find Job Postings..." 
          rightSectionWidth={42}
        />
      </Group>

      <Group>
        <Button
          variant="light"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? '🌙 Dark' : '☀️ Light'}
        </Button>
        <Button variant="subtle">Login</Button>
        <Button>Register</Button>
      </Group>
    </Group>
  );
}
