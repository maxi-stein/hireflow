import { Container, Text, Group, Anchor } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <div style={{ borderTop: '1px solid var(--mantine-color-default-border)', marginTop: 'auto' }}>
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {t('footer.copyright', { year: new Date().getFullYear(), defaultValue: `© ${new Date().getFullYear()} Consultoría Global. Todos los derechos reservados.` })}
          </Text>
          <Group gap="xs">
            <Anchor href="#" size="sm" c="dimmed">
              {t('footer.terms', 'Términos y condiciones')}
            </Anchor>
            <Anchor href="#" size="sm" c="dimmed">
              {t('footer.privacy', 'Política de privacidad')}
            </Anchor>
          </Group>
        </Group>
      </Container>
    </div>
  );
}
