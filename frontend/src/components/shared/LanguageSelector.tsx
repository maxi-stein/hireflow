import { Menu, UnstyledButton, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

// US Flag SVG Icon
const USFlag = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px' }}>
    <rect width="32" height="24" fill="#B22234" />
    <path d="M0 2.77h32M0 5.54h32M0 8.31h32M0 11.08h32M0 13.85h32M0 16.62h32M0 19.38h32M0 22.15h32" stroke="#fff" strokeWidth="1.85" />
    <rect width="12.8" height="13.85" fill="#3C3B6E" />
    <g fill="#fff">
      <circle cx="2" cy="2" r="0.6" />
      <circle cx="4.5" cy="2" r="0.6" />
      <circle cx="7" cy="2" r="0.6" />
      <circle cx="9.5" cy="2" r="0.6" />
      <circle cx="12" cy="2" r="0.6" />
      <circle cx="3.25" cy="3.5" r="0.6" />
      <circle cx="5.75" cy="3.5" r="0.6" />
      <circle cx="8.25" cy="3.5" r="0.6" />
      <circle cx="10.75" cy="3.5" r="0.6" />
      <circle cx="2" cy="5" r="0.6" />
      <circle cx="4.5" cy="5" r="0.6" />
      <circle cx="7" cy="5" r="0.6" />
      <circle cx="9.5" cy="5" r="0.6" />
      <circle cx="12" cy="5" r="0.6" />
      <circle cx="3.25" cy="6.5" r="0.6" />
      <circle cx="5.75" cy="6.5" r="0.6" />
      <circle cx="8.25" cy="6.5" r="0.6" />
      <circle cx="10.75" cy="6.5" r="0.6" />
      <circle cx="2" cy="8" r="0.6" />
      <circle cx="4.5" cy="8" r="0.6" />
      <circle cx="7" cy="8" r="0.6" />
      <circle cx="9.5" cy="8" r="0.6" />
      <circle cx="12" cy="8" r="0.6" />
      <circle cx="3.25" cy="9.5" r="0.6" />
      <circle cx="5.75" cy="9.5" r="0.6" />
      <circle cx="8.25" cy="9.5" r="0.6" />
      <circle cx="10.75" cy="9.5" r="0.6" />
      <circle cx="2" cy="11" r="0.6" />
      <circle cx="4.5" cy="11" r="0.6" />
      <circle cx="7" cy="11" r="0.6" />
      <circle cx="9.5" cy="11" r="0.6" />
      <circle cx="12" cy="11" r="0.6" />
    </g>
  </svg>
);

// Spain Flag SVG Icon
const SpainFlag = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px' }}>
    <rect width="32" height="24" fill="#AA151B" />
    <rect y="6" width="32" height="12" fill="#F1BF00" />
  </svg>
);

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
            <Text size="xs" fw={700} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
