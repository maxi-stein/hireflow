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

export const getWorkModeColor = (workMode: string): string => {
  const normalizedMode = workMode.toLowerCase();
  if (normalizedMode === 'remote') return 'blue';
  if (normalizedMode === 'hybrid') return 'orange';
  if (normalizedMode === 'office') return 'green';
  return 'gray';
};
