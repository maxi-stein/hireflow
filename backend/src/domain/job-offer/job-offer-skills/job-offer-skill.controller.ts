import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { JobOfferSkillService } from './job-offer-skill.service';

@Controller('job-offer-skills')
export class JobOfferSkillController {
  constructor(private readonly jobOfferSkillService: JobOfferSkillService) {}

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.jobOfferSkillService.softDelete(id);
  }
}
