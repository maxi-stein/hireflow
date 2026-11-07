import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { User, Candidate } from '../../types/models/user.types';

export interface CompletenessCheck {
  label: string;
  done: boolean;
  weight: string;
}

export interface CandidateProfileCompleteness {
  score: number;
  checks: CompletenessCheck[];
}

export interface UseCandidateProfileCompletenessParams {
  user?: User | null;
  candidate?: Candidate | null;
  hasCV: boolean;
  hasPhoto: boolean;
}

export function useCandidateProfileCompleteness({
  user,
  candidate,
  hasCV,
  hasPhoto,
}: UseCandidateProfileCompletenessParams): CandidateProfileCompleteness {
  const { t } = useTranslation('profile');

  return useMemo(() => {
    let score = 0;
    const hasPersonal = Boolean(
      user?.first_name &&
      user?.last_name &&
      candidate?.phone &&
      candidate?.headline &&
      (candidate?.city || candidate?.country)
    );

    if (hasCV) score += 34;
    if (hasPhoto) score += 33;
    if (hasPersonal) score += 33;
    if (hasCV && hasPhoto && hasPersonal) score = 100;

    const checks: CompletenessCheck[] = [
      { label: t('candidate.completenessCV', 'CV en formato PDF'), done: hasCV, weight: '34%' },
      { label: t('candidate.completenessPhoto', 'Foto de perfil'), done: hasPhoto, weight: '33%' },
      { label: t('candidate.completenessPersonal', 'Datos personales y contacto'), done: hasPersonal, weight: '33%' },
    ];

    return { score: Math.min(score, 100), checks };
  }, [user, candidate, hasCV, hasPhoto, t]);
}
