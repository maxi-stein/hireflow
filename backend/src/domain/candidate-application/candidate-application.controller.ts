import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CandidateApplicationService } from './candidate-application.service';
import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
import { UpdateCandidateApplicationDto } from './dto/update-candidate-application';
import { NotEmptyDtoPipe, UuidValidationPipe } from '../../shared/pipes';
import { FilterApplicationsDto } from './dto/filter-applications.dto';
import { RequireUserType } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/interfaces/user.enum';
import { UserTypeGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HireCandidateApplicationDto } from './dto/hire-candidate-application.dto';

@Controller('candidate-applications')
@UseGuards(JwtAuthGuard)
export class CandidateApplicationController {
  constructor(
    private readonly applicationService: CandidateApplicationService,
  ) { }

  @Post()
  create(@Body() createDto: CreateCandidateApplicationDto) {
    return this.applicationService.create(createDto);
  }

  @Post('hire')
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  hire(@Body() hireDto: HireCandidateApplicationDto) {
    return this.applicationService.hire(hireDto.applicationId);
  }

  @Get()
  findAll(@Query() filterApplicationsDto: FilterApplicationsDto) {
    return this.applicationService.findAll(filterApplicationsDto);
  }

  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.applicationService.findOne(id);
  }

  //Only employees can edit a candidate application
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateDto: UpdateCandidateApplicationDto,
  ) {
    return this.applicationService.update(id, updateDto);
  }
}
