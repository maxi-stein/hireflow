import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JobOffer } from './entities/job-offer.entity';
import {
  CreateJobOfferDto,
  JobOfferResponseDto,
  UpdateJobOfferDto,
} from './dto';
import { FilterJobOfferDto } from './dto/filter-job-offer-dto';
import { JobOfferStatus } from './interfaces';
import { JobOfferSkillService } from '../job-offer-skills/job-offer-skill.service';
import { PaginatedResponse } from '../../../shared/dto/pagination/pagination.dto';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
    @Inject(JobOfferSkillService)
    private readonly jobOfferSkillService: JobOfferSkillService,
  ) {}

  async create(
    createJobOfferDto: CreateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    return this.jobOfferRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // 1. Create the JobOffer
        const jobOffer = transactionalEntityManager.create(JobOffer, {
          ...createJobOfferDto,
          status: JobOfferStatus.OPEN,
          deleted: false,
        });

        const savedJobOffer = await transactionalEntityManager.save(jobOffer);

        // 2. Create skills if provided
        if (createJobOfferDto.skills && createJobOfferDto.skills.length > 0) {
          await this.jobOfferSkillService.createForJobOffer(
            savedJobOffer.id,
            createJobOfferDto.skills,
            transactionalEntityManager,
          );
        }

        const fullJobOffer = await transactionalEntityManager.findOne(
          JobOffer,
          {
            where: { id: savedJobOffer.id },
            relations: ['skills'],
          },
        );

        return fullJobOffer;
      },
    );
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
