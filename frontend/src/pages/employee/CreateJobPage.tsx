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
import { useTranslation } from 'react-i18next';
import { normalizeText } from '../../utils/string';

export function CreateJobPage() {
  const { t } = useTranslation(['jobs', 'common']);
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
      const normalizedSkills = normalizeText(values.skills);
      const payload = {
        ...values,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
        skills: normalizedSkills.map(skill => ({ skill_name: skill })), // Map skills to objects with skill_name property
      };

      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: payload });
        notifications.show({
          title: t('create.notifications.successUpdateTitle'),
          message: t('create.notifications.successUpdateMessage'),
          color: 'green',
        });
      } else {
        // Remove status for new creations as it's handled by the backend
        const { status, ...createPayload } = payload;
        await createMutation.mutateAsync(createPayload as any);
        notifications.show({
          title: t('create.notifications.successCreateTitle'),
          message: t('create.notifications.successCreateMessage'),
          color: 'green',
        });
      }

      navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].path);
    } catch (error) {
      notifications.show({
        title: t('create.notifications.errorTitle'),
        message: isEditMode ? t('create.notifications.errorMessageUpdate') : t('create.notifications.errorMessageCreate'),
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
        <Title order={2}>{isEditMode ? t('create.titleEdit') : t('create.titleNew')}</Title>
        <Text c="dimmed" size="sm">
          {isEditMode ? t('create.subtitleEdit') : t('create.subtitleNew')}
        </Text>
      </Box>

      <Paper p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="lg">
            <Group grow align="flex-start">
              <TextInput
                label={t('create.form.position')}
                placeholder={t('create.form.positionPlaceholder')}
                required
                {...form.getInputProps('position')}
              />
              <Select
                label={t('create.form.workMode')}
                placeholder={t('create.form.workModePlaceholder')}
                required
                data={[
                  { value: WorkMode.HYBRID, label: t('workMode.hybrid') },
                  { value: WorkMode.REMOTE, label: t('workMode.remote') },
                  { value: WorkMode.OFFICE, label: t('workMode.office') },
                ]}
                {...form.getInputProps('work_mode')}
              />
            </Group>

            <Group grow align="flex-start">
              <TextInput
                label={t('create.form.location')}
                placeholder={t('create.form.locationPlaceholder')}
                required
                {...form.getInputProps('location')}
              />
              {isEditMode && (
                <Select
                  label={t('create.form.status')}
                  placeholder={t('create.form.statusPlaceholder')}
                  required
                  data={[
                    { value: JobOfferStatus.OPEN, label: t('status.open') },
                    { value: JobOfferStatus.CLOSED, label: t('status.closed') },
                  ]}
                  {...form.getInputProps('status')}
                />
              )}
            </Group>

            <Textarea
              label={t('create.form.description')}
              placeholder={t('create.form.descriptionPlaceholder')}
              minRows={6}
              autosize
              required
              {...form.getInputProps('description')}
            />

            <TagsInput
              label={t('create.form.skills')}
              required
              placeholder={t('create.form.skillsPlaceholder')}
              description={t('create.form.skillsDescription')}
              maxTags={50}
              clearable
              data={skillSuggestions.map(s => s.skill_name)}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              value={form.values.skills}
              onChange={(value) => form.setFieldValue('skills', normalizeText(value))}
              error={form.errors.skills}
            />

            <Group grow align="flex-start">
              <TextInput
                label={t('create.form.salary')}
                placeholder={t('create.form.salaryPlaceholder')}
                {...form.getInputProps('salary')}
              />
              <DateInput
                label={t('create.form.deadline')}
                placeholder={t('create.form.deadlinePlaceholder')}
                minDate={new Date()}
                clearable
                {...form.getInputProps('deadline')}
              />
            </Group>

            <Textarea
              label={t('create.form.benefits')}
              placeholder={t('create.form.benefitsPlaceholder')}
              minRows={3}
              autosize
              {...form.getInputProps('benefits')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                onClick={() => navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].path)}
              >
                {t('common:actions.cancel')}
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={20} />}
                loading={isLoading}
              >
                {isEditMode ? t('create.submitEdit') : t('create.submitNew')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
