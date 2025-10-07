export class WorkExperienceResponseDto {
  id: string;
  company_name: string;
  position: string;
  start_date: Date;
  end_date?: Date | null;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
