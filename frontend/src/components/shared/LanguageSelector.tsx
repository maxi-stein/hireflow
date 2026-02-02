import { Menu, UnstyledButton, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconWorld } from '@tabler/icons-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu shadow="md" width={150} position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <IconWorld size={20} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => changeLanguage('en')}
          leftSection={<Text size="lg">🇺🇸</Text>}
        >
          English
        </Menu.Item>
        <Menu.Item
          onClick={() => changeLanguage('es')}
          leftSection={<Text size="lg">🇪🇸</Text>}
        >
          Español
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
