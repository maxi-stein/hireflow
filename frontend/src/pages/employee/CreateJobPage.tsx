import {
  Container,
  Title,
  Paper,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  TagsInput,
  LoadingOverlay,
  Text,
  Stack,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { useCreateJobOfferMutation } from '../../hooks/api/useJobOffers';
import { WorkMode } from '../../services/job-offer.service';
import { ROUTES } from '../../router/routes.config';
import { notifications } from '@mantine/notifications';
import { createJobOfferSchema } from '../../schemas/job-offer.schema';
import { validateWithJoi } from '../../utils/form-validation';

export function CreateJobPage() {
  const navigate = useNavigate();
  const createMutation = useCreateJobOfferMutation();

  const form = useForm({
    initialValues: {
      position: '',
      location: '',
      work_mode: WorkMode.HYBRID,
      description: '',
      salary: '',
      benefits: '',
      skills: [] as string[],
    },
    validate: validateWithJoi(createJobOfferSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        skills: values.skills.map(skill => ({ skill_name: skill })),
      });
      
      notifications.show({
        title: 'Success',
        message: 'Job posting created successfully',
        color: 'green',
      });
      
      navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children![0].path);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create job posting. Please try again.',
        color: 'red',
      });
      console.error(error);
    }
  };

  return (
    <Container size="md" py="xl">
      <Box mb="lg">
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />} 
          onClick={() => navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children![0].path)}
          mb="md"
          pl={0}
        >
          Back to Job Postings
        </Button>
        <Title order={2}>Create New Job Posting</Title>
        <Text c="dimmed" size="sm">Fill in the details to publish a new job offer.</Text>
      </Box>

      <Paper p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={createMutation.isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Group grow align="flex-start">
              <TextInput
                label="Position Title"
                placeholder="e.g. Senior Frontend Engineer"
                required
                {...form.getInputProps('position')}
              />
              <Select
                label="Work Mode"
                placeholder="Select work mode"
                required
                data={[
                  { value: WorkMode.HYBRID, label: 'Hybrid' },
                  { value: WorkMode.FULL_REMOTE, label: 'Full Remote' },
                  { value: WorkMode.OFFICE, label: 'On-site' },
                ]}
                {...form.getInputProps('work_mode')}
              />
            </Group>

            <TextInput
              label="Location"
              placeholder="e.g. Buenos Aires, Argentina"
              required
              {...form.getInputProps('location')}
            />

            <Textarea
              label="Job Description"
              placeholder="Describe the role, responsibilities, and requirements..."
              minRows={6}
              autosize
              required
              {...form.getInputProps('description')}
            />

            <TagsInput
              label="Required Skills"
              placeholder="Type and press Enter to add skills (e.g. React, TypeScript)"
              description="Add up to 10 key skills for this position"
              maxTags={10}
              clearable
              {...form.getInputProps('skills')}
            />

            <Group grow align="flex-start">
              <TextInput
                label="Salary Range (Optional)"
                placeholder="e.g. $3000 - $5000 USD"
                {...form.getInputProps('salary')}
              />
            </Group>

            <Textarea
              label="Benefits (Optional)"
              placeholder="List the benefits offered..."
              minRows={3}
              autosize
              {...form.getInputProps('benefits')}
            />

            <Group justify="flex-end" mt="md">
              <Button 
                variant="default" 
                onClick={() => navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children![0].path)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                leftSection={<IconDeviceFloppy size={20} />}
                loading={createMutation.isPending}
              >
                Create Job Posting
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
