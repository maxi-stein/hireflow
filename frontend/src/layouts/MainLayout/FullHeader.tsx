import { Group, Burger, Title, Avatar, Menu, UnstyledButton, Text, Indicator, ActionIcon } from '@mantine/core';

interface FullHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function FullHeader({ opened, toggle }: FullHeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title order={3}>HireFlow</Title>
      </Group>

      <Group>
        {/* Stats or Quick Actions could go here */}
        
        <Group gap="xs">
           <Indicator color="red" size={8} offset={4}>
             <ActionIcon variant="subtle" size="lg">
               🔔 {/* Placeholder for Bell Icon */}
             </ActionIcon>
           </Indicator>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Group gap={7}>
                  <Avatar src={null} alt="User" radius="xl" size={30} color="blue">MK</Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>Maxi</Text>
                    <Text c="dimmed" size="xs">Candidate</Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item>Settings</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Group>
  );
}
