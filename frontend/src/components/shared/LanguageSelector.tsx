import { Menu, UnstyledButton, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconChevronDown } from '@tabler/icons-react';
import { USFlag, SpainFlag } from './Flags';

const languageConfig = {
  en: { flag: <USFlag size={18} />, code: 'EN', label: 'English' },
  es: { flag: <SpainFlag size={18} />, code: 'ES', label: 'Español' },
};

interface LanguageSelectorProps {
  color?: string;
}

export function LanguageSelector({ color }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'es';
  const currentConfig = languageConfig[currentLang] || languageConfig.en;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isLightText = color === 'white';

  return (
    <Menu shadow="md" width={160} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
      <Menu.Target>
        <UnstyledButton
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: '8px',
            border: `1px solid ${isLightText ? 'rgba(255, 255, 255, 0.22)' : 'light-dark(#cbd5e1, #475569)'}`,
            backgroundColor: isLightText ? 'rgba(255, 255, 255, 0.08)' : 'light-dark(rgba(0, 0, 0, 0.03), rgba(255, 255, 255, 0.06))',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Group gap={6} wrap="nowrap" align="center">
            {currentConfig.flag}
            <Text
              size="xs"
              fw={700}
              c={color || 'light-dark(#0f172a, #f8fafc)'}
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {currentConfig.code}
            </Text>
            <IconChevronDown size={13} style={{ opacity: 0.7, color: isLightText ? '#ffffff' : 'inherit' }} />
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
