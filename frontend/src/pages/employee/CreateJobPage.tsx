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
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useCreateJobOfferMutation, useUpdateJobOfferMutation, useJobOfferQuery, useSearchSkillsQuery } from '../../hooks/api/useJobOffers';
import { WorkMode, JobOfferStatus } from '../../services/job-offer.service';
import { ROUTES } from '../../router/routes.config';
import { notifications } from '@mantine/notifications';
import { createJobOfferSchema } from '../../schemas/job-offer.schema';
import { validateWithJoi } from '../../utils/form-validation';
import { useEffect, useState } from 'react';

export function CreateJobPage() {
  const navigate = useNavigate();

  // Get job offer id from url params (only when editing)
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Search value for skill autocomplete (with debounce)
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const createMutation = useCreateJobOfferMutation();
  const updateMutation = useUpdateJobOfferMutation();

  // Query for job offer data (only when editing)
  const { data: jobOffer, isLoading: isLoadingJobOffer } = useJobOfferQuery(id || '');

  // Query for skill autocomplete
  const { data: skillSuggestions = [] } = useSearchSkillsQuery(debouncedSearch);

  const form = useForm({
    initialValues: {
      position: '',
      location: '',
      work_mode: WorkMode.HYBRID,
      description: '',
      salary: '',
      benefits: '',
      deadline: null as Date | null,
      skills: [] as string[],
      status: JobOfferStatus.OPEN as JobOfferStatus,
    },
    validate: validateWithJoi(createJobOfferSchema),
  });

  // Load job offer data if editing
  useEffect(() => {
    if (isEditMode && jobOffer) {
      form.setValues({
        position: jobOffer.position,
        location: jobOffer.location,
        work_mode: jobOffer.work_mode as any,
        description: jobOffer.description,
        salary: jobOffer.salary || '',
        benefits: jobOffer.benefits || '',
        deadline: jobOffer.deadline ? new Date(jobOffer.deadline) : null,
        skills: jobOffer.skills.map(s => s.skill_name),
        status: jobOffer.status,
      });
    }
  }, [jobOffer, isEditMode]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const payload = {
        ...values,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
        skills: values.skills.map(skill => ({ skill_name: skill })), // Map skills to objects with skill_name property
      };

      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: payload });
        notifications.show({
          title: 'Success',
          message: 'Job posting updated successfully',
          color: 'green',
        });
      } else {
        // Remove status for new creations as it's handled by the backend
        const { status, ...createPayload } = payload;
        await createMutation.mutateAsync(createPayload as any);
        notifications.show({
          title: 'Success',
          message: 'Job posting created successfully',
          color: 'green',
        });
      }

      navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].path);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditMode ? 'update' : 'create'} job posting. Please try again.`,
        color: 'red',
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || (isEditMode && isLoadingJobOffer);

  return (
    <Container size="md" py="xl">
      <Box mb="lg">
        <Title order={2}>{isEditMode ? 'Update Job Posting' : 'Create New Job Posting'}</Title>
        <Text c="dimmed" size="sm">
          {isEditMode ? 'Update the job posting details.' : 'Fill in the details to publish a new job offer.'}
        </Text>
      </Box>

      <Paper p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
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

            <Group grow align="flex-start">
              <TextInput
                label="Location"
                placeholder="e.g. Buenos Aires, Argentina"
                required
                {...form.getInputProps('location')}
              />
              {isEditMode && (
                <Select
                  label="Status"
                  placeholder="Select status"
                  required
                  data={[
                    { value: JobOfferStatus.OPEN, label: 'Open' },
                    { value: JobOfferStatus.CLOSED, label: 'Closed' },
                  ]}
                  {...form.getInputProps('status')}
                />
              )}
            </Group>

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
              required
              placeholder="Type to search skills (e.g. React, TypeScript)"
              description="Add up to 10 key skills for this position"
              maxTags={10}
              clearable
              data={skillSuggestions.map(s => s.skill_name)}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              {...form.getInputProps('skills')}
            />

            <Group grow align="flex-start">
              <TextInput
                label="Salary Range"
                placeholder="e.g. $3000 - $5000 USD"
                {...form.getInputProps('salary')}
              />
              <DateInput
                label="Application Deadline"
                placeholder="Select deadline"
                minDate={new Date()}
                clearable
                {...form.getInputProps('deadline')}
              />
            </Group>

            <Textarea
              label="Benefits"
              placeholder="List the benefits offered..."
              minRows={3}
              autosize
              {...form.getInputProps('benefits')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                onClick={() => navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].path)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={20} />}
                loading={isLoading}
              >
                {isEditMode ? 'Update Job Posting' : 'Create Job Posting'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
