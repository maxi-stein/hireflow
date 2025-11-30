import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewService } from './interview.service';
import { FilterInterviewsDto } from './dto/filter-interviews.dto';
import { RequireUserType } from '../auth/decorators/roles.decorator';
import { UserTypeGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserType } from '../users/interfaces/user.enum';
import { UuidValidationPipe } from '../../shared/pipes';
import { CanAccessUser } from '../auth/guards/can-access.guard';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  @RequireUserType(UserType.EMPLOYEE)
  @UseGuards(UserTypeGuard) 
  create(@Body() createDto: CreateInterviewDto) {
    return this.interviewService.create(createDto);
  }

  @Get()
  @RequireUserType(UserType.EMPLOYEE)
  @UseGuards(UserTypeGuard) 
  findAll(@Query() filterInterviewDto: FilterInterviewsDto) {
    return this.interviewService.findAll(filterInterviewDto);
  }

  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.interviewService.findOne(id);
  }

  @Get('candidate/:candidateId')
  @UseGuards(CanAccessUser)
  findByCandidate(@Param('candidateId', UuidValidationPipe) candidateId: string) {
    return this.interviewService.findByCandidate(candidateId);
  }

  @RequireUserType(UserType.EMPLOYEE)
  @UseGuards(UserTypeGuard)
  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateDto: UpdateInterviewDto,
  ) {
    return this.interviewService.update(id, updateDto);
  }

  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.interviewService.remove(id);
  }
}
