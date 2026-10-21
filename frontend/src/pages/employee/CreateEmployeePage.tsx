import { Container, Title, TextInput, MultiSelect, Button, Box, Stack, Group, Text, useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconUserPlus, IconMail, IconId, IconBriefcase, IconShield } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employee.service';
import { validateWithJoi } from '../../utils/form-validation';
import { createEmployeeSchema } from '../../schemas/employee.schema';

export const CreateEmployeePage = () => {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const EMPLOYEE_ROLES = [
    { value: 'hr', label: t('employee.rolesList.hr') },
    { value: 'technical_leader', label: t('employee.rolesList.technical_leader') },
    { value: 'manager', label: t('employee.rolesList.manager') },
  ];

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      position: '',
      roles: [] as string[],
    },
    validate: validateWithJoi(createEmployeeSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await employeeService.create({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: 'Consultoria-Global-Reset-Password',
        employeeData: {
          position: values.position,
          roles: values.roles,
        },
      });

      notifications.show({
        title: t('employee.create.notifications.successTitle'),
        message: t('employee.create.notifications.successMessage'),
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/manage/dashboard');
    } catch {
      notifications.show({
        title: t('employee.create.notifications.errorTitle'),
        message: t('employee.create.notifications.errorMessage'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      {/* Page heading */}
      <Box mb="xl">
        <Group gap="sm" align="center" mb={6}>
          <Box
            p={10}
            style={{
              borderRadius: 12,
              background: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff',
              display: 'flex',
            }}
          >
            <IconUserPlus size={22} color="#2563eb" />
          </Box>
          <Title order={2} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            {t('employee.create.title')}
          </Title>
        </Group>
        <Text size="sm" c="dimmed" ml={50}>
          {t('employee.create.subtitle')}
        </Text>
      </Box>

      {/* Form card */}
      <Box
        style={{
          borderRadius: 20,
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          background: isDark ? '#1e293b' : '#ffffff',
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(15,23,42,0.06)',
          overflow: 'hidden',
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Stack gap={0}>
            {/* Name section */}
            <Box
              px="xl"
              pt="xl"
              pb="lg"
              style={{ borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}
            >
              <Group gap="xs" mb="md">
                <IconId size={15} color={isDark ? '#64748b' : '#94a3b8'} />
                <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em' }}>
                  {t('employee.create.sectionIdentity')}
                </Text>
              </Group>
              <Group grow>
                <TextInput
                  label={t('employee.create.firstName')}
                  placeholder={t('employee.create.firstNamePlaceholder')}
                  withAsterisk
                  autoComplete="off"
                  radius="md"
                  {...form.getInputProps('first_name')}
                />
                <TextInput
                  label={t('employee.create.lastName')}
                  placeholder={t('employee.create.lastNamePlaceholder')}
                  withAsterisk
                  autoComplete="off"
                  radius="md"
                  {...form.getInputProps('last_name')}
                />
              </Group>
            </Box>

            {/* Contact section */}
            <Box
              px="xl"
              py="lg"
              style={{ borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}
            >
              <Group gap="xs" mb="md">
                <IconMail size={15} color={isDark ? '#64748b' : '#94a3b8'} />
                <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em' }}>
                  {t('employee.create.sectionContact')}
                </Text>
              </Group>
              <TextInput
                label={t('employee.create.email')}
                placeholder={t('employee.create.emailPlaceholder')}
                withAsterisk
                autoComplete="off"
                radius="md"
                {...form.getInputProps('email')}
              />
            </Box>

            {/* Role section */}
            <Box
              px="xl"
              py="lg"
              style={{ borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}
            >
              <Group gap="xs" mb="md">
                <IconBriefcase size={15} color={isDark ? '#64748b' : '#94a3b8'} />
                <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em' }}>
                  {t('employee.create.sectionRole')}
                </Text>
              </Group>
              <Stack gap="md">
                <TextInput
                  label={t('employee.create.position')}
                  placeholder={t('employee.create.positionPlaceholder')}
                  withAsterisk
                  autoComplete="off"
                  radius="md"
                  {...form.getInputProps('position')}
                />
                <MultiSelect
                  label={t('employee.create.roles')}
                  placeholder={t('employee.create.rolesPlaceholder')}
                  data={EMPLOYEE_ROLES}
                  withAsterisk
                  radius="md"
                  {...form.getInputProps('roles')}
                />
              </Stack>
            </Box>

            {/* Password info */}
            <Box
              px="xl"
              py="lg"
              style={{
                background: isDark ? '#0f172a' : '#f8fafc',
                borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
              }}
            >
              <Group gap="xs" mb="sm">
                <IconShield size={15} color={isDark ? '#64748b' : '#94a3b8'} />
                <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em' }}>
                  {t('employee.create.sectionSecurity')}
                </Text>
              </Group>
              <TextInput
                label={t('employee.create.defaultPassword')}
                value="Consultoria-Global-Reset-Password"
                disabled
                description={t('employee.create.defaultPasswordDescription')}
                radius="md"
              />
            </Box>

            {/* Submit */}
            <Box px="xl" py="lg">
              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                leftSection={<IconUserPlus size={17} />}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  fontWeight: 700,
                }}
              >
                {t('employee.create.submit')}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};
