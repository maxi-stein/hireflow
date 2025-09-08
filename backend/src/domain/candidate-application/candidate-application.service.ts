import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
import { UpdateCandidateApplicationDto } from './dto/update-candidate-application';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../shared/dto/pagination/pagination.dto';
import { CandidateApplication } from './entities/candidate-application.entity';
import { ApplicationStatus } from './interfaces/application-status';
import { FilterApplicationsDto } from './dto/filter-applications.dto';

@Injectable()
export class CandidateApplicationService {
  constructor(
    @InjectRepository(CandidateApplication)
    private readonly applicationRepository: Repository<CandidateApplication>,
  ) {}

  async create(
    createDto: CreateCandidateApplicationDto,
  ): Promise<CandidateApplication> {
    const { candidate_id, job_offer_id } = createDto;

    // Check if the combination already exists
    const existing = await this.applicationRepository.findOne({
      where: { candidate_id, job_offer_id },
    });

    if (existing) {
      throw new BadRequestException(
        'This candidate has already applied to the selected job offer.',
      );
    }

    const application = this.applicationRepository.create({
      ...createDto,
      status: ApplicationStatus.IN_PROGRESS,
    });

    return await this.applicationRepository.save(application);
  }

  async findAll(
    filterDto: FilterApplicationsDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<CandidateApplication>> {
    const {
      status,
      start_date,
      end_date,
      candidate_id,
      job_offer_id,
      page = 1,
      limit = 10,
    } = filterDto;

    const skip = (page - 1) * limit;

    const query = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.candidate', 'candidate')
      .leftJoinAndSelect('application.job_offer', 'job_offer')
      .orderBy('application.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      query.andWhere('application.status = :status', { status });
    }

    if (start_date) {
      query.andWhere('application.created_at >= :start_date', {
        start_date: new Date(start_date),
      });
    }

    if (end_date) {
      query.andWhere('application.created_at <= :end_date', {
        end_date: new Date(end_date),
      });
    }

    if (candidate_id) {
      query.andWhere('application.candidate_id = :candidate_id', {
        candidate_id,
      });
    }

    if (job_offer_id) {
      query.andWhere('application.job_offer_id = :job_offer_id', {
        job_offer_id,
      });
    }

    const [data, total] = await query.getManyAndCount();

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

  async findOne(id: string): Promise<CandidateApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['candidate', 'job_offer'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async update(
    id: string,
    updateDto: UpdateCandidateApplicationDto,
  ): Promise<CandidateApplication> {
    const application = await this.findOne(id);
    const updated = this.applicationRepository.merge(application, updateDto);
    return await this.applicationRepository.save(updated);
  }
}
