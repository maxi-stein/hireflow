import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './entities/job-offer.entity';
import {
  PaginationDto,
  PaginatedResponse,
} from '../../shared/dto/pagination/pagination.dto';
import {
  CreateJobOfferDto,
  JobOfferResponseDto,
  UpdateJobOfferDto,
} from './dto';
import { FilterJobOfferDto } from './dto/filter-job-offer-dto';
import { JobOfferStatus } from './interfaces';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async create(
    createJobOfferDto: CreateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    const jobOffer = this.jobOfferRepository.create({
      ...createJobOfferDto,
      status: JobOfferStatus.OPEN,
      deleted: false,
    });
    return await this.jobOfferRepository.save(jobOffer);
  }

  async findAll(
    filterDto: FilterJobOfferDto,
  ): Promise<PaginatedResponse<JobOfferResponseDto>> {
    const { page, limit, status, positions, start_date, end_date } = filterDto;

    const query = this.jobOfferRepository.createQueryBuilder('jobOffer');

    if (status) {
      query.andWhere('jobOffer.status = :status', { status });
    }

    if (positions && positions.length > 0) {
      query.andWhere('jobOffer.position IN (:...positions)', { positions });
    }

    if (start_date) {
      query.andWhere('jobOffer.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('jobOffer.created_at <= :end_date', { end_date });
    }

    query.skip((page - 1) * limit).take(limit);

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

  async findOne(id: string): Promise<JobOfferResponseDto> {
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id },
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }

    return jobOffer;
  }

  async update(
    id: string,
    updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id },
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }

    await this.jobOfferRepository.update(id, updateJobOfferDto);

    const updatedJobOffer = await this.jobOfferRepository.findOne({
      where: { id },
    });

    return updatedJobOffer;
  }

  async softDelete(id: string): Promise<void> {
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id },
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }

    await this.jobOfferRepository.update(id, {
      deleted: true,
      deleted_at: new Date(),
    });
  }
}
