import { TagsInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { normalizeText } from '../../../utils/string';
import type { JobOfferSkill } from '../../../services/job-offer.service';

interface JobRequirementsFieldsProps {
  form: UseFormReturnType<any>;
  skillSuggestions: JobOfferSkill[];
  searchValue: string;
  onSearchChange: (val: string) => void;
}

export function JobRequirementsFields({
  form,
  skillSuggestions,
  searchValue,
  onSearchChange,
}: JobRequirementsFieldsProps) {
  const { t } = useTranslation(['jobs']);

  return (
    <TagsInput
      label={t('create.form.skills')}
      required
      placeholder={t('create.form.skillsPlaceholder')}
      description={t('create.form.skillsDescription')}
      maxTags={50}
      clearable
      data={skillSuggestions.map((s) => s.skill_name)}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      value={form.values.skills}
      onChange={(value) => form.setFieldValue('skills', normalizeText(value))}
      error={form.errors.skills}
    />
  );
}
