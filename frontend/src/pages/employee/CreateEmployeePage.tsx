import { Container, Title, TextInput, MultiSelect, Button, Paper, Stack, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employee.service';
import { validateWithJoi } from '../../utils/form-validation';
import { createEmployeeSchema } from '../../schemas/employee.schema';

export const CreateEmployeePage = () => {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();

  const EMPLOYEE_ROLES = [
    { value: 'hr', label: t('employee.rolesList.hr') },
    { value: 'admin', label: t('employee.rolesList.admin') },
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
    } catch (error) {
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
      <Title order={2} mb="lg">{t('employee.create.title')}</Title>
      <Paper withBorder p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Stack>
            <Group grow>
              <TextInput
                label={t('employee.create.firstName')}
                placeholder={t('employee.create.firstNamePlaceholder')}
                withAsterisk
                autoComplete="off"
                {...form.getInputProps('first_name')}
              />
              <TextInput
                label={t('employee.create.lastName')}
                placeholder={t('employee.create.lastNamePlaceholder')}
                withAsterisk
                autoComplete="off"
                {...form.getInputProps('last_name')}
              />
            </Group>

            <TextInput
              label={t('employee.create.email')}
              placeholder={t('employee.create.emailPlaceholder')}
              withAsterisk
              autoComplete="off"
              {...form.getInputProps('email')}
            />

            <TextInput
              label={t('employee.create.defaultPassword')}
              value="Consultoria-Global-Reset-Password"
              disabled
              description={t('employee.create.defaultPasswordDescription')}
            />

            <TextInput
              label={t('employee.create.position')}
              placeholder={t('employee.create.positionPlaceholder')}
              withAsterisk
              autoComplete="off"
              {...form.getInputProps('position')}
            />

            <MultiSelect
              label={t('employee.create.roles')}
              placeholder={t('employee.create.rolesPlaceholder')}
              data={EMPLOYEE_ROLES}
              withAsterisk
              {...form.getInputProps('roles')}
            />

            <Button type="submit" mt="md" loading={false}>
              {t('employee.create.submit')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
