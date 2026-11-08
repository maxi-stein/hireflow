import { Modal, Button, TextInput, Select, MultiSelect, Stack, Group, Text, Box } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { InterviewType } from '../../../services/interview.service';
import type { Interview } from '../../../services/interview.service';
import type { Employee } from '../../../services/employee.service';
import { StyledSelect } from './styled';
import { useScheduleInterviewForm } from '../../../hooks/domain/useScheduleInterviewForm';

interface ScheduleInterviewModalProps {
  opened: boolean;
  onClose: () => void;
  initialApplicationId?: string;
  interviewToEdit?: Interview | null;
  onSuccess?: () => void;
}

export function ScheduleInterviewModal({
  opened,
  onClose,
  initialApplicationId,
  interviewToEdit,
  onSuccess,
}: ScheduleInterviewModalProps) {
  const { t } = useTranslation(['calendar']);

  const {
    form,
    selectedJobOfferId,
    setSelectedJobOfferId,
    jobOffersOptions,
    filteredApplications,
    employees,
    isSubmitting,
    isCompleted,
    handleSubmit,
  } = useScheduleInterviewForm({
    opened,
    onClose,
    initialApplicationId,
    interviewToEdit,
    onSuccess,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      radius="lg"
      size="lg"
      title={
        <Group gap="xs">
          <Box p={6} bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))" style={{ borderRadius: 8, color: '#2563eb' }}>
            <IconCalendar size={18} />
          </Box>
          <Text fw={700} size="md">
            {interviewToEdit ? t('modal.rescheduleTitle') : t('modal.scheduleTitle')}
          </Text>
        </Group>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label={t('modal.labels.title', 'Título')}
            placeholder={t('modal.labels.titlePlaceholder', 'Ej: Entrevista Inicial con RRHH')}
            withAsterisk
            {...form.getInputProps('title')}
          />

          <StyledSelect
            label={t('modal.labels.jobOffer')}
            placeholder={t('modal.labels.jobOfferPlaceholder')}
            data={jobOffersOptions}
            value={selectedJobOfferId}
            onChange={(val) => {
              setSelectedJobOfferId(val);
              form.setFieldValue('applicationIds', []);
            }}
            searchable
            clearable
            withAsterisk
            disabled={!!initialApplicationId || !!interviewToEdit}
          />

          <Select
            label={t('modal.labels.type')}
            data={[
              { value: InterviewType.INDIVIDUAL, label: t('modal.types.individual') },
              { value: InterviewType.GROUP, label: t('modal.types.group') },
            ]}
            withAsterisk
            {...form.getInputProps('type')}
          />

          {form.values.type === InterviewType.GROUP ? (
            <MultiSelect
              label={t('modal.labels.candidates')}
              placeholder={selectedJobOfferId ? t('modal.labels.candidatePlaceholder') : t('modal.labels.jobOfferPlaceholder')}
              data={filteredApplications.map((app) => ({
                value: app.id,
                label: `${app.candidate.user.first_name} ${app.candidate.user.last_name}`,
              }))}
              searchable
              withAsterisk
              {...form.getInputProps('applicationIds')}
              disabled={!selectedJobOfferId}
            />
          ) : (
            <Select
              label={t('modal.labels.candidate')}
              placeholder={selectedJobOfferId ? t('modal.labels.candidatePlaceholder') : t('modal.labels.jobOfferPlaceholder')}
              data={filteredApplications.map((app) => ({
                value: app.id,
                label: `${app.candidate.user.first_name} ${app.candidate.user.last_name}`,
              }))}
              searchable
              withAsterisk
              value={form.values.applicationIds[0] || ''}
              onChange={(val) => form.setFieldValue('applicationIds', val ? [val] : [])}
              error={form.errors.applicationIds}
              disabled={!selectedJobOfferId}
            />
          )}

          <MultiSelect
            label={t('modal.labels.interviewer')}
            placeholder={t('modal.labels.interviewerPlaceholder')}
            data={
              employees?.data.map((emp: Employee) => ({
                value: emp.id,
                label: `${emp.user.first_name} ${emp.user.last_name}`,
              })) || []
            }
            searchable
            withAsterisk
            {...form.getInputProps('interviewerIds')}
          />

          <DateTimePicker
            label={t('modal.labels.dateTime')}
            placeholder={t('modal.labels.dateTimePlaceholder')}
            minDate={new Date()}
            withAsterisk
            {...form.getInputProps('scheduledTime')}
          />

          <TextInput
            label={t('modal.labels.meetingLink')}
            placeholder={t('modal.labels.meetingLinkPlaceholder')}
            withAsterisk
            {...form.getInputProps('meetingLink')}
          />

          {isCompleted && (
            <Text c="red" size="sm">{t('modal.labels.completedNote')}</Text>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>{t('modal.buttons.cancel')}</Button>
            <Button type="submit" loading={isSubmitting} disabled={isCompleted}>
              {interviewToEdit ? t('modal.buttons.update') : t('modal.buttons.schedule')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
