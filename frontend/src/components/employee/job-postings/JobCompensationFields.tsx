import { Group, Select, NumberInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';

interface JobCompensationFieldsProps {
  form: UseFormReturnType<any>;
}

export function JobCompensationFields({ form }: JobCompensationFieldsProps) {
  const { t } = useTranslation(['jobs']);

  return (
    <>
      <Group align="flex-start" justify="space-between">
        <Group align="flex-start" gap="sm">
          <Select
            w={100}
            label={t('create.form.currency')}
            data={[
              { value: 'ARS', label: 'ARS' },
              { value: 'USD', label: 'USD' },
            ]}
            {...form.getInputProps('salaryCurrency')}
          />
          <NumberInput
            w={140}
            label={t('create.form.salaryMin')}
            placeholder="100000"
            min={0}
            hideControls
            thousandSeparator="."
            decimalSeparator=","
            {...form.getInputProps('salaryMin')}
          />
          <NumberInput
            w={140}
            label={t('create.form.salaryMax')}
            placeholder="200000"
            min={0}
            hideControls
            thousandSeparator="."
            decimalSeparator=","
            {...form.getInputProps('salaryMax')}
          />
        </Group>
        <DateInput
          w={200}
          label={t('create.form.deadline')}
          placeholder={t('create.form.deadlinePlaceholder')}
          minDate={new Date()}
          clearable
          {...form.getInputProps('deadline')}
          style={{ marginRight: '200px' }}
        />
      </Group>

      <Textarea
        label={t('create.form.benefits')}
        placeholder={t('create.form.benefitsPlaceholder')}
        minRows={3}
        autosize
        {...form.getInputProps('benefits')}
      />
    </>
  );
}

