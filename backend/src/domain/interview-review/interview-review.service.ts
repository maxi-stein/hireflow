import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateApplicationService } from '../candidate-application/candidate-application.service';
import { InterviewService } from '../interviews/interview.service';
import { CreateInterviewReviewDto } from './dto/create-interview-review.dto';
import { InterviewReview } from './entity/interview-review.entity';
import { EmployeesService } from '../users/employee/employee.service';
import { UpdateInterviewReviewDto } from './dto/update-interview-review.dto';
import { Interview } from '../interviews/entities/interview.entity';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../shared/dto/pagination/pagination.dto';

@Injectable()
export class InterviewReviewService {
  constructor(
    @InjectRepository(InterviewReview)
    private readonly reviewRepository: Repository<InterviewReview>,
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @Inject(EmployeesService)
    private readonly employeeService: EmployeesService,
    @Inject(InterviewService)
    private readonly interviewService: InterviewService,
    @Inject(CandidateApplicationService)
    private readonly applicationService: CandidateApplicationService,
  ) {}

  async create(createDto: CreateInterviewReviewDto): Promise<InterviewReview> {
    const { employee_id: employeeId } = createDto;

    const employee = await this.employeeService.findOne(employeeId);

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const interview = await this.interviewService.findOne(
      createDto.interview_id,
    );
    if (!interview) {
      throw new NotFoundException(
        `Interview with ID ${createDto.interview_id} not found`,
      );
    }

    const application = await this.applicationService.findOne(
      createDto.candidate_application_id,
    );
    if (!application) {
      throw new NotFoundException(
        `Candidate application with ID ${createDto.candidate_application_id} not found`,
      );
    }

    const isInterviewer = interview.interviewers.some(
      (interviewer) => interviewer.id === employeeId,
    );
    if (!isInterviewer) {
      throw new ConflictException(
        `Employee ${employeeId} is not an interviewer for interview ${createDto.interview_id}`,
      );
    }

    const isApplicationInInterview = interview.applications.some(
      (app) => app.id === createDto.candidate_application_id,
    );
    if (!isApplicationInInterview) {
      throw new ConflictException(
        `Candidate application ${createDto.candidate_application_id} is not part of interview ${createDto.interview_id}`,
      );
    }

    // Verify that the reviewer hasn't made a review before for this same interview
    const existingReview = await this.reviewRepository.findOne({
      where: {
        interview_id: createDto.interview_id,
        employee_id: employeeId,
        candidate_application_id: createDto.candidate_application_id,
      },
    });

    if (existingReview) {
      throw new ConflictException(
        'A review already exists for this interviewer and candidate in this interview',
      );
    }

    const review = this.reviewRepository.create({
      ...createDto,
      employee_id: employeeId,
    });

    return await this.reviewRepository.save(review);
  }

  async findByInterview(interviewId: string) {
    const interview = await this.interviewService.findOne(interviewId);

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${interviewId} not found`);
    }

    return await this.reviewRepository.find({
      where: { interview_id: interviewId },
      relations: ['employee', 'candidate_application'],
    });
  }

  async findByEmployeeAndInterview(employeeId: string, interviewId: string) {
    const [employee, interview] = await Promise.all([
      this.employeeService.findOne(employeeId),
      this.interviewService.findOne(interviewId),
    ]);

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${interviewId} not found`);
    }

    const isInterviewer = interview.interviewers.some(
      (interviewer) => interviewer.id === employeeId,
    );

    if (!isInterviewer) {
      throw new BadRequestException(
        `Employee ${employeeId} is not an interviewer for interview ${interviewId}`,
      );
    }

    return await this.reviewRepository.find({
      where: {
        employee_id: employeeId,
        interview_id: interviewId,
      },
      relations: [
        'candidate_application',
        'candidate_application.candidate',
        'candidate_application.candidate.user',
      ],
    });
  }

  async findByCandidateApplication(applicationId: string) {
    const application = this.applicationService.findOne(applicationId);

    if (!application) {
      throw new BadRequestException(
        `Candidate Application with ID ${applicationId} not found`,
      );
    }
    return await this.reviewRepository.find({
      where: { candidate_application_id: applicationId },
      relations: ['employee', 'interview'],
    });
  }

  async findInterviewsPendingReview(
    employeeId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Interview>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.interviewRepository
      .createQueryBuilder('interview')
      .innerJoinAndSelect('interview.interviewers', 'interviewer')
      .innerJoinAndSelect('interview.applications', 'application')
      .innerJoinAndSelect('application.candidate', 'candidate')
      .innerJoinAndSelect('candidate.user', 'user')
      .innerJoinAndSelect('application.job_offer', 'job_offer')
      .leftJoin('interview.reviews', 'review', 'review.employee_id = :employeeId', { employeeId })
      .where('interviewer.id = :employeeId', { employeeId })
      .andWhere('interview.scheduled_time <= :now', { now: new Date() })
      .andWhere('review.id IS NULL')
      .orderBy('interview.scheduled_time', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMyCompletedReviews(
    employeeId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<InterviewReview>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.reviewRepository.findAndCount({
      where: { employee_id: employeeId },
      relations: [
        'interview',
        'candidate_application',
        'candidate_application.candidate',
        'candidate_application.candidate.user',
        'candidate_application.job_offer',
      ],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateDto: UpdateInterviewReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    Object.assign(review, updateDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewRepository.remove(review);
  }
}
