import { Menu, UnstyledButton, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { USFlag, SpainFlag } from './Flags';

const languageConfig = {
  en: { flag: <USFlag size={18} />, code: 'EN', label: 'English' },
  es: { flag: <SpainFlag size={18} />, code: 'ES', label: 'Español' },
};

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'es';
  const currentConfig = languageConfig[currentLang] || languageConfig.en;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu shadow="md" width={150} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            {currentConfig.flag}
            <Text size="xs" fw={700} c="white" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentConfig.code}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => changeLanguage('en')}
          leftSection={<USFlag size={18} />}
        >
          <Group gap="xs">
            <Text size="sm">English</Text>
            <Text size="xs" c="dimmed" fw={500}>EN</Text>
          </Group>
        </Menu.Item>
        <Menu.Item
          onClick={() => changeLanguage('es')}
          leftSection={<SpainFlag size={18} />}
        >
          <Group gap="xs">
            <Text size="sm">Español</Text>
            <Text size="xs" c="dimmed" fw={500}>ES</Text>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
