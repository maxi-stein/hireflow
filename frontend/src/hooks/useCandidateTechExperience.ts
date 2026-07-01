import { useMemo } from 'react';
import type { CandidateApplication } from '../services/candidate-application.service';

export interface TechExperienceStats {
  maxYearsBySkill: Record<string, number>;
  isTopCandidateForSkill: (skillName: string, years: number) => boolean;
}

export function useCandidateTechExperience(allApplications: CandidateApplication[]): TechExperienceStats {
  const maxYearsBySkill = useMemo(() => {
    const maxYears: Record<string, number> = {};

    allApplications.forEach(app => {
      if (app.skill_answers) {
        app.skill_answers.forEach(answer => {
          const skillName = answer.job_offer_skill.skill_name;
          const years = answer.years_of_experience;
          
          if (!maxYears[skillName] || years > maxYears[skillName]) {
            maxYears[skillName] = years;
          }
        });
      }
    });

    return maxYears;
  }, [allApplications]);

  const isTopCandidateForSkill = (skillName: string, years: number) => {
    return years >= (maxYearsBySkill[skillName] || 0) && years > 0;
  };

  return {
    maxYearsBySkill,
    isTopCandidateForSkill
  };
}
