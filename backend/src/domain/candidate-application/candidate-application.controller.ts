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
import { NotEmptyDtoPipe } from '../../shared/pipes';
import { FilterApplicationsDto } from './dto/filter-applications.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/interfaces/user.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('candidate-applications')
@UseGuards(JwtAuthGuard)
export class CandidateApplicationController {
  constructor(
    private readonly applicationService: CandidateApplicationService,
  ) {}

  @Post()
  create(@Body() createDto: CreateCandidateApplicationDto) {
    return this.applicationService.create(createDto);
  }

  @Get()
  findAll(@Query() filterApplicationsDto: FilterApplicationsDto) {
    return this.applicationService.findAll(filterApplicationsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  //Only employees can edit a candidate application
  @UseGuards(RolesGuard)
  @Roles(UserType.EMPLOYEE)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(NotEmptyDtoPipe) updateDto: UpdateCandidateApplicationDto,
  ) {
    return this.applicationService.update(id, updateDto);
  }
}
