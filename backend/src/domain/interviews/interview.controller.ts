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
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.interviewService.findOne(id);
  }

  @RequireUserType(UserType.EMPLOYEE) //Sets the required user types
  @UseGuards(UserTypeGuard) //Checks if the user is that same user_type
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
