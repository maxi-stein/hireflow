import { Container, Title, Paper, Button, Group, LoadingOverlay, Text, Stack, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { ROUTES } from '../../router/routes.config';
import { useTranslation } from 'react-i18next';
import { useJobOfferForm } from '../../hooks/domain/useJobOfferForm';
import { JobBasicInfoFields } from '../../components/employee/job-postings/JobBasicInfoFields';
import { JobCompensationFields } from '../../components/employee/job-postings/JobCompensationFields';
import { JobRequirementsFields } from '../../components/employee/job-postings/JobRequirementsFields';

export function CreateJobPage() {
  const { t } = useTranslation(['jobs', 'common']);
  const navigate = useNavigate();

  const {
    form,
    isEditMode,
    isLoading,
    skillSuggestions,
    searchValue,
    setSearchValue,
    handleSubmit,
  } = useJobOfferForm();

  return (
    <Container size="md" py="xl">
      <Box mb="lg">
        <Title order={2}>{isEditMode ? t('create.titleEdit') : t('create.titleNew')}</Title>
        <Text c="dimmed" size="sm">
          {isEditMode ? t('create.subtitleEdit') : t('create.subtitleNew')}
        </Text>
      </Box>

      <Paper p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="lg">
            <JobBasicInfoFields form={form} isEditMode={isEditMode} />

            <JobRequirementsFields
              form={form}
              skillSuggestions={skillSuggestions}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />

            <JobCompensationFields form={form} />

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
