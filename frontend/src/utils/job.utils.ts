import { WorkMode } from '../services/job-offer.service';

export const getLocationDisplayInfo = (
  workMode: WorkMode | string,
  location: string,
): { workMode: WorkMode | string; location: string | null } => {
  if (!location) return { workMode, location: null };

  const normalizedLocation = location.toLowerCase().trim();
  // Don't show location if it's redundant with remote work mode
  if (
    workMode === WorkMode.REMOTE &&
    (normalizedLocation === 'remote' || normalizedLocation === 'remoto')
  ) {
    return { workMode, location: null };
  }

  return { workMode, location };
};
