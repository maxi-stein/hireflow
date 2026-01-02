import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) { }

  async create(
    createJobOfferDto: CreateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    const { skills, ...jobOfferData } = createJobOfferDto;

    // Create job offer instance
    const newJobOffer = this.jobOfferRepository.create({
      ...jobOfferData,
      status: JobOfferStatus.OPEN,
    });

    // Handle skills if provided
    if (skills && skills.length > 0) {
      const skillEntities = await this.jobOfferSkillService.findOrCreateByName(
        skills.map((s) => s.skill_name),
      );
      newJobOffer.skills = skillEntities;
    }

    // Save job offer
    const savedJobOffer = await this.jobOfferRepository.save(newJobOffer);

    return { ...savedJobOffer, applicants_count: 0 } as any;
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

    if (filterDto.deadline_from) {
      query.andWhere('jobOffer.deadline >= :deadline_from', {
        deadline_from: filterDto.deadline_from,
      });
    }

    if (filterDto.deadline_to) {
      query.andWhere('jobOffer.deadline <= :deadline_to', {
        deadline_to: filterDto.deadline_to,
      });
    }

    query.loadRelationCountAndMap('jobOffer.applicants_count', 'jobOffer.applications'); // Count applicants for each job offer
    query.leftJoinAndSelect('jobOffer.skills', 'skills');

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
      .leftJoinAndSelect('jobOffer.skills', 'jobOfferSkill')
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
      relations: ['skills'],
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }

    const { skills, ...jobOfferData } = updateJobOfferDto;

    Object.assign(jobOffer, jobOfferData);

    // Handle skills update if provided
    if (skills !== undefined) {
      const skillEntities = await this.jobOfferSkillService.findOrCreateByName(
        skills.map((s) => s.skill_name),
      );
      jobOffer.skills = skillEntities;
    }

    await this.jobOfferRepository.save(jobOffer);

    return this.findOne(id);
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
