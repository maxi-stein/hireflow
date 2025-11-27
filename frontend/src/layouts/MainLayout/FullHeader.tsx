import { Group, Burger, Title, Indicator, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '../../components/shared/UserMenu';

interface FullHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function FullHeader({ opened, toggle }: FullHeaderProps) {
  const navigate = useNavigate();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title 
          order={3} 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          HireFlow
        </Title>
      </Group>

      <Group>
        {/* Stats or Quick Actions could go here */}
        
        <Group gap="xs">
           <Indicator color="red" size={8} offset={4}>
             <ActionIcon variant="subtle" size="lg">
               🔔 {/* Placeholder for Bell Icon */}
             </ActionIcon>
           </Indicator>

          <UserMenu />
        </Group>
      </Group>
    </Group>
  );
}
