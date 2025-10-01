import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateInterviewReviewDto } from './dto/create-interview-review.dto';
import { UpdateInterviewReviewDto } from './dto/update-interview-review.dto';
import { InterviewReviewService } from './interview-review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../shared/dto/pagination/pagination.dto';
import { UuidValidationPipe } from '../../shared/pipes';
import { RequireUserType } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/interfaces/user.enum';

@Controller('interview-reviews')
@RequireUserType(UserType.EMPLOYEE)
@UseGuards(JwtAuthGuard)
export class InterviewReviewController {
  constructor(private readonly reviewService: InterviewReviewService) {}

  @Post()
  create(@Body() createDto: CreateInterviewReviewDto) {
    return this.reviewService.create(createDto);
  }

  @Get('interview/:interviewId')
  findByInterview(
    @Param('interviewId', UuidValidationPipe) interviewId: string,
  ) {
    return this.reviewService.findByInterview(interviewId);
  }

  @Get('employee/:employeeId/interview/:interviewId')
  findByEmployeeAndInterview(
    @Param('employeeId', UuidValidationPipe) employeeId: string,
    @Param('interviewId', UuidValidationPipe) interviewId: string,
  ) {
    return this.reviewService.findByEmployeeAndInterview(
      employeeId,
      interviewId,
    );
  }

  @Get('my-pending-reviews')
  findMyPendingReviews(@Req() req, @Query() paginationDto: PaginationDto) {
    const employeeId = req.user.employeeId;
    return this.reviewService.findPendingReviews(employeeId, paginationDto);
  }

  @Get('application/:applicationId')
  findByCandidateApplication(
    @Param('applicationId', UuidValidationPipe) applicationId: string,
  ) {
    return this.reviewService.findByCandidateApplication(applicationId);
  }

  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateDto: UpdateInterviewReviewDto,
  ) {
    return this.reviewService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.reviewService.remove(id);
  }
}
