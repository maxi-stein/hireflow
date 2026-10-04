import { Controller, Delete, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { JobOfferSkillService } from './job-offer-skill.service';

@Controller('job-offer-skills')
export class JobOfferSkillController {
  constructor(private readonly jobOfferSkillService: JobOfferSkillService) {}

  @Get('search')
  async search(@Query('query') query: string) {
    return await this.jobOfferSkillService.search(query);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.jobOfferSkillService.softDelete(id);
  }
}
