import { Container, Text, Group, Anchor } from '@mantine/core';

export function Footer() {
  return (
    <div style={{ borderTop: '1px solid var(--mantine-color-default-border)', marginTop: 'auto' }}>
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            © 2025 HireFlow. All rights reserved.
          </Text>
          <Group gap="xs">
            <Anchor href="#" size="sm" c="dimmed">
              Terms
            </Anchor>
            <Anchor href="#" size="sm" c="dimmed">
              Privacy
            </Anchor>
          </Group>
        </Group>
      </Container>
    </div>
  );
}
