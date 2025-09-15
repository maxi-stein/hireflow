// controllers/interview.controller.ts
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
import { PaginationDto } from '../../shared/dto/pagination/pagination.dto';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewService } from './interview.service';
import { FilterInterviewsDto } from './dto/filter-interviews.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserType } from '../users/interfaces/user.enum';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  create(@Body() createDto: CreateInterviewDto) {
    return this.interviewService.create(createDto);
  }

  @Get()
  findAll(@Query() filterInterviewDto: FilterInterviewsDto) {
    return this.interviewService.findAll(filterInterviewDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateInterviewDto) {
    return this.interviewService.update(id, updateDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.EMPLOYEE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(id);
  }
}
