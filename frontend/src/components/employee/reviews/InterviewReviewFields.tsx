import type { FormEvent } from 'react';
import { Paper, Stack, NumberInput, Textarea, TagsInput, Group, Button } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { normalizeText } from '../../../utils/string';
import type { InterviewReviewFormValues } from '../../../hooks/domain/useInterviewReviewForm';

export interface InterviewReviewFieldsProps {
  form: UseFormReturnType<InterviewReviewFormValues>;
  isReadOnly: boolean;
  isEditMode: boolean;
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

export const InterviewReviewFields = ({
  form,
  isReadOnly,
  isEditMode,
  onSubmit,
}: InterviewReviewFieldsProps) => {
  const { t } = useTranslation('reviews');

  return (
    <Paper
      withBorder
      p="xl"
      radius="lg"
      bg="light-dark(#ffffff, #1e293b)"
      style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
    >
      <form onSubmit={onSubmit}>
        <Stack gap="lg">
          <NumberInput
            label={t('form.labels.score')}
            description={t('form.labels.scoreDesc')}
            min={1}
            max={10}
            required
            radius="md"
            readOnly={isReadOnly}
            variant={isReadOnly ? 'filled' : 'default'}
            {...form.getInputProps('score')}
          />

          <Textarea
            label={t('form.labels.notes')}
            placeholder={t('form.labels.notesPlaceholder')}
            minRows={5}
            autosize
            radius="md"
            readOnly={isReadOnly}
            variant={isReadOnly ? 'filled' : 'default'}
            {...form.getInputProps('notes')}
          />

          <TagsInput
            label={t('form.labels.strengths')}
            placeholder={t('form.labels.strengthsPlaceholder')}
            radius="md"
            readOnly={isReadOnly}
            variant={isReadOnly ? 'filled' : 'default'}
            value={form.values.strengths}
            onChange={(value) => form.setFieldValue('strengths', normalizeText(value))}
            error={form.errors.strengths}
          />

          <TagsInput
            label={t('form.labels.weaknesses')}
            placeholder={t('form.labels.weaknessesPlaceholder')}
            radius="md"
            readOnly={isReadOnly}
            variant={isReadOnly ? 'filled' : 'default'}
            value={form.values.weaknesses}
            onChange={(value) => form.setFieldValue('weaknesses', normalizeText(value))}
            error={form.errors.weaknesses}
          />

          {!isReadOnly && (
            <Group justify="flex-end" mt="xl" gap="sm">
              {isEditMode && (
                <Button variant="default" radius="md" onClick={() => form.reset()}>
                  {t('form.buttons.reset')}
                </Button>
              )}
              <Button
                type="submit"
                color="blue"
                radius="md"
                leftSection={<IconDeviceFloppy size={16} />}
                style={{ fontWeight: 600 }}
              >
                {isEditMode ? t('form.buttons.update') : t('form.buttons.submit')}
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </Paper>
  );
};

