import { Container, Title, TextInput, MultiSelect, Button, Paper, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employee.service';
import { validateWithJoi } from '../../utils/form-validation';
import { createEmployeeSchema } from '../../schemas/employee.schema';

const EMPLOYEE_ROLES = [
  { value: 'hr', label: 'HR Admin' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'manager', label: 'Hiring Manager' },
];

export const CreateEmployeePage = () => {
  const navigate = useNavigate();
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
        title: 'Success',
        message: 'Employee created successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create employee',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg">Register New Employee</Title>
      <Paper withBorder p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Stack>
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                withAsterisk
                autoComplete="off"
                {...form.getInputProps('first_name')}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                withAsterisk
                autoComplete="off"
                {...form.getInputProps('last_name')}
              />
            </Group>

            <TextInput
              label="Email"
              placeholder="john.doe@company.com"
              withAsterisk
              autoComplete="off"
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Default Password"
              value="Consultoria-Global-Reset-Password"
              disabled
              description="Default Password. It is mandatory to change it after first login."
            />

            <TextInput
              label="Position"
              placeholder="Senior Recruiter"
              withAsterisk
              autoComplete="off"
              {...form.getInputProps('position')}
            />

            <MultiSelect
              label="Roles"
              placeholder="Select roles"
              data={EMPLOYEE_ROLES}
              withAsterisk
              {...form.getInputProps('roles')}
            />

            <Button type="submit" mt="md" loading={false}>
              Create Employee
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
