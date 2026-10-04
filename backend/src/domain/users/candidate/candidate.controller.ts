import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  Query,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from '../dto/candidate/update-candidate.dto';
import { RegisterCandidateDto } from '../dto/user/create-user.dto';
import { CandidateFilterDto } from '../dto/candidate/candidate-filter.dto';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../../auth/guards/roles.guard';
import { CanAccessUser } from '../../auth/guards/can-access.guard';
import { RequireUserType } from '../../auth/decorators/roles.decorator';
import { UserType } from '../interfaces/user.enum';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) { }

  // Public endpoint for candidate registration
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerCandidateDto: RegisterCandidateDto) {
    return this.candidateService.create(registerCandidateDto);
  }

  // Only employees can list all candidates
  @Get()
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  findAll(@Query() filterDto: CandidateFilterDto) {
    return this.candidateService.findAll(filterDto);
  }

  // Employees can view any candidate; candidates can only view their own profile
  @Get(':id')
  @UseGuards(JwtAuthGuard, CanAccessUser)
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.candidateService.findOne(id);
  }

  // Candidates can only update their own profile
  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserTypeGuard, CanAccessUser)
  @RequireUserType(UserType.CANDIDATE)
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidateService.update(id, updateCandidateDto);
  }

  // Only employees can delete candidates
  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.candidateService.remove(id);
  }
}
