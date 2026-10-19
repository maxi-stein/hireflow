import { Stack, Title, Text, TextInput, Button, Group, Box, Badge, Paper } from '@mantine/core';
import { IconSearch, IconArrowRight, IconSparkles } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LandingSection } from './LandingSection';

export const LandingHero = () => {
  const { t } = useTranslation(['jobs', 'common']);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleQuickTag = (tag: string) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <LandingSection
      noContainer
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)',
        marginTop: 'calc(-1 * var(--mantine-spacing-md))',
        paddingTop: '4rem',
        paddingBottom: '5rem',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Decorative ambient background accents */}
      <Box
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          maxWidth: '1000px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.12) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Stack gap="xl" align="center" ta="center" maw={1100} mx="auto" px="md" style={{ position: 'relative', zIndex: 1 }}>
        {/* Announcement Pill - Perfectly aligned and not clipped */}
        <Box
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: '9999px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.4,
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.1)',
          }}
        >
          <IconSparkles size={16} />
          <span>{t('jobs:landing.heroBadge', 'Portal de Empleo · Consultoría Global')}</span>
        </Box>

        {/* Hero Title */}
        <Title
          order={1}
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: '#0f172a',
            maxWidth: 960,
          }}
        >
          {t('jobs:landing.heroTitlePre', 'Sumate a nuestro equipo en')}{' '}
          <Text
            component="span"
            inherit
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('jobs:landing.heroTitleHighlight', 'Consultoría Global')}
          </Text>
        </Title>

        {/* Hero Subtitle */}
        <Text
          size="xl"
          maw={760}
          style={{
            color: '#475569',
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {t('jobs:landing.heroSubtitle', 'Postulate a nuestras búsquedas activas de forma transparente, demostrá tus habilidades clave y formá parte de nuestros proyectos.')}
        </Text>

        {/* Interactive Search Bar Box */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          shadow="lg"
          radius="xl"
          p="sm"
          maw={680}
          w="100%"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <Group gap="xs" wrap="nowrap">
            <TextInput
              placeholder={t('jobs:landing.searchPlaceholder', 'Buscar por puesto o tecnología (ej. React, Node, DevOps)...')}
              leftSection={<IconSearch size={20} color="#64748b" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              variant="unstyled"
              size="md"
              style={{ flex: 1, paddingLeft: 8 }}
            />
            <Button
              type="submit"
              size="md"
              radius="xl"
              color="blue"
              rightSection={<IconArrowRight size={18} />}
              style={{ fontWeight: 600, paddingLeft: 22, paddingRight: 22 }}
            >
              {t('jobs:landing.searchButton', 'Explorar')}
            </Button>
          </Group>
        </Paper>

        {/* Quick Filter Tags */}
        <Group justify="center" gap="xs">
          <Text size="sm" c="dimmed" fw={500}>{t('jobs:landing.popularSearches', 'Búsquedas populares:')}</Text>
          {[
            { label: t('workMode.remote', 'Remoto'), query: 'Remoto' },
            { label: 'Frontend', query: 'Frontend' },
            { label: 'Backend', query: 'Backend' },
            { label: 'Fullstack', query: 'Fullstack' },
            { label: 'DevOps', query: 'DevOps' },
            { label: 'Data', query: 'Data' },
          ].map((tag) => (
            <Badge
              key={tag.query}
              size="md"
              radius="xl"
              variant="default"
              style={{
                cursor: 'pointer',
                borderColor: '#cbd5e1',
                color: '#334155',
                transition: 'all 0.15s ease',
              }}
              onClick={() => handleQuickTag(tag.query)}
            >
              {tag.label}
            </Badge>
          ))}
        </Group>
      </Stack>
    </LandingSection>
  );
};
