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

        return { ...fullJobOffer, applicants_count: 0 };
      },
    );
  }

  async findAll(
    filterDto: FilterJobOfferDto,
  ): Promise<PaginatedResponse<JobOfferResponseDto>> {
    const { page, limit, status, position, start_date, end_date } = filterDto;

    const query = this.jobOfferRepository.createQueryBuilder('jobOffer');

    if (status) {
      query.andWhere('jobOffer.status = :status', { status });
    }

    if (position) {
      const normalizedPosition = position.toLowerCase();
      query.andWhere('LOWER(jobOffer.position) LIKE :position', {
        position: `%${normalizedPosition}%`,
      });
    }

    if (start_date) {
      query.andWhere('jobOffer.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('jobOffer.created_at <= :end_date', { end_date });
    }

    query.loadRelationCountAndMap('jobOffer.applicants_count', 'jobOffer.applications'); // Count applicants for each job offer

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data: data as any,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<JobOfferResponseDto> {
    const jobOffer = await this.jobOfferRepository.createQueryBuilder('jobOffer')
      .where('jobOffer.id = :id', { id })
      .loadRelationCountAndMap('jobOffer.applicants_count', 'jobOffer.applications')
      .getOne();

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }

    return jobOffer as any;
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

    const updatedJobOffer = await this.jobOfferRepository.createQueryBuilder('jobOffer')
      .where('jobOffer.id = :id', { id })
      .loadRelationCountAndMap('jobOffer.applicants_count', 'jobOffer.applications')
      .getOne();

    return updatedJobOffer as any;
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
