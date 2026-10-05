import { Controller, Delete, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { JobOfferSkillService } from './job-offer-skill.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../auth/guards/roles.guard';
import { RequireUserType } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/interfaces/user.enum';

@Controller('job-offer-skills')
export class JobOfferSkillController {
  constructor(private readonly jobOfferSkillService: JobOfferSkillService) {}

  @Get('search')
  async search(@Query('query') query: string) {
    return await this.jobOfferSkillService.search(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.jobOfferSkillService.softDelete(id);
  }
}
