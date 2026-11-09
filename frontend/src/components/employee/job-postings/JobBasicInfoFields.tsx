import { Group, TextInput, Select, Textarea } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { WorkMode, JobOfferStatus } from '../../../services/job-offer.service';

interface JobBasicInfoFieldsProps {
  form: UseFormReturnType<any>;
  isEditMode: boolean;
}

export function JobBasicInfoFields({ form, isEditMode }: JobBasicInfoFieldsProps) {
  const { t } = useTranslation(['jobs']);

  return (
    <>
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
    </>
  );
}

