import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaginationDto,
  PaginatedResponse,
} from '../../shared/dto/pagination/pagination.dto';
import { CandidateApplicationService } from '../candidate-application/candidate-application.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './entities/interview.entity';
import { InterviewStatus } from './interfaces/interview-status.enum';
import { EmployeesService } from '../users/employee/employee.service';
import { FilterInterviewsDto } from './dto/filter-interviews.dto';
import { InterviewType } from './interfaces/interview-type.enum';
import { ApplicationStatus } from '../candidate-application/interfaces/application-status';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @Inject(EmployeesService)
    private readonly employeeService: EmployeesService,
    @Inject(CandidateApplicationService)
    private readonly candidateApplicationService: CandidateApplicationService,
  ) {}

  async create(createDto: CreateInterviewDto): Promise<Interview> {
    //If type === individual, then validate if the application_ids array's length is 1
    if (
      createDto.type === InterviewType.INDIVIDUAL &&
      createDto.application_ids.length > 1
    ) {
      throw new BadRequestException(
        'Cannot create an individual interview with more than one candidate_application_id',
      );
    }
    // Verify all applications for this interviw exists
    const applications = await Promise.all(
      createDto.application_ids.map((id) =>
        this.candidateApplicationService.findOne(id),
      ),
    );

    const notFoundApplications = createDto.application_ids.filter(
      (id, index) => !applications[index],
    );

    if (notFoundApplications.length > 0) {
      throw new NotFoundException(
        `Candidate applications with IDs ${notFoundApplications.join(', ')} not found`,
      );
    }

    // Verify interviewers exists
    const interviewers = await Promise.all(
      createDto.interviewer_ids.map((id) => this.employeeService.findOne(id)),
    );

    const notFoundInterviewers = createDto.interviewer_ids.filter(
      (id, index) => !interviewers[index],
    );

    if (notFoundInterviewers.length > 0) {
      throw new NotFoundException(
        `Interviewers with IDs ${notFoundInterviewers.join(', ')} not found`,
      );
    }
    // Update application status to IN_PROGRESS if currently APPLIED
    for (const app of applications) {
      if (app.status === 'APPLIED') {
        await this.candidateApplicationService.update(app.id, { status: ApplicationStatus.IN_PROGRESS });
      }
    }

    // Creating the interview
    const interview = this.interviewRepository.create({
      type: createDto.type,
      scheduled_time: createDto.scheduled_time,
      meeting_link: createDto.meeting_link,
      status: createDto.status || InterviewStatus.SCHEDULED,
      applications,
      interviewers,
    });

    return await this.interviewRepository.save(interview);
  }

  async findAll(
    filterInterviewDto: FilterInterviewsDto,
  ): Promise<PaginatedResponse<Interview>> {
    const {
      page,
      limit,
      applicationId,
      employeeId,
      candidate_application_id,
      start_date,
      end_date,
      status,
    } = filterInterviewDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.interviewRepository
      .createQueryBuilder('interview')
      .leftJoinAndSelect('interview.applications', 'application')
      .leftJoinAndSelect('interview.interviewers', 'interviewer')
      .leftJoinAndSelect('application.candidate', 'candidate')
      .leftJoinAndSelect('candidate.user', 'user');

    if (status) {
      queryBuilder.andWhere('interview.status = :status', { status });
    }

    const applicationFilter = applicationId || candidate_application_id;
    if (applicationFilter) {
      queryBuilder.andWhere('application.id = :applicationId', {
        applicationId: applicationFilter,
      });
    }

    if (employeeId) {
      queryBuilder.andWhere('interviewer.id = :employeeId', { employeeId });
    }

    if (start_date && end_date) {
      queryBuilder.andWhere(
        'interview.scheduled_time BETWEEN :start_date AND :end_date',
        {
          start_date,
          end_date,
        },
      );
    } else if (start_date) {
      queryBuilder.andWhere('interview.scheduled_time >= :start_date', {
        start_date,
      });
    } else if (end_date) {
      queryBuilder.andWhere('interview.scheduled_time <= :end_date', {
        end_date,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('interview.scheduled_time', 'ASC')
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

  async findOne(id: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      relations: ['applications', 'applications.candidate', 'interviewers'],
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    return interview;
  }

  async update(id: string, updateDto: UpdateInterviewDto): Promise<Interview> {
    const interview = await this.findOne(id);

    if (updateDto.application_ids) {
      const applications = await Promise.all(
        updateDto.application_ids.map((id) =>
          this.candidateApplicationService.findOne(id),
        ),
      );

      const notFoundApplications = updateDto.application_ids.filter(
        (id, index) => !applications[index],
      );

      if (notFoundApplications.length > 0) {
        throw new NotFoundException(
          `Candidate applications with IDs ${notFoundApplications.join(', ')} not found`,
        );
      }

      interview.applications = applications;
    }

    if (updateDto.interviewer_ids) {
      const interviewers = await Promise.all(
        updateDto.interviewer_ids.map((id) => this.employeeService.findOne(id)),
      );

      const notFoundInterviewers = updateDto.interviewer_ids.filter(
        (id, index) => !interviewers[index],
      );

      if (notFoundInterviewers.length > 0) {
        throw new NotFoundException(
          `Interviewers with IDs ${notFoundInterviewers.join(', ')} not found`,
        );
      }

      interview.interviewers = interviewers;
    }

    if (updateDto.type) interview.type = updateDto.type;
    if (updateDto.scheduled_time)
      interview.scheduled_time = updateDto.scheduled_time;
    if (updateDto.meeting_link) interview.meeting_link = updateDto.meeting_link;
    if (updateDto.status) interview.status = updateDto.status;

    return await this.interviewRepository.save(interview);
  }

  async remove(id: string): Promise<void> {
    const interview = await this.findOne(id);
    await this.interviewRepository.remove(interview);
  }

  async findByApplication(
    applicationId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Interview>> {
    return this.findAll({
      ...paginationDto,
      candidate_application_id: applicationId,
    });
  }

  async findByInterviewer(
    employeeId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Interview>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.interviewRepository
      .createQueryBuilder('interview')
      .innerJoinAndSelect('interview.interviewers', 'interviewer')
      .innerJoinAndSelect('interview.applications', 'application')
      .where('interviewer.id = :employeeId', { employeeId })
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

  async findByCandidate(
    candidateId: string,
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<Interview>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.interviewRepository
      .createQueryBuilder('interview')
      .innerJoinAndSelect('interview.applications', 'application')
      .innerJoinAndSelect('application.candidate', 'candidate')
      .innerJoinAndSelect('application.job_offer', 'job_offer')
      .innerJoinAndSelect('interview.interviewers', 'interviewer')
      .innerJoinAndSelect('interviewer.user', 'user')
      .where('candidate.id = :candidateId', { candidateId })
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
}
