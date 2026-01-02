import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
import { UpdateCandidateApplicationDto } from './dto/update-candidate-application';
import { PaginatedResponse } from '../../shared/dto/pagination/pagination.dto';
import { CandidateApplication } from './entities/candidate-application.entity';
import { ApplicationStatus } from './interfaces/application-status';
import { FilterApplicationsDto } from './dto/filter-applications.dto';
import { JobOfferSkillService } from '../job-offer/job-offer-skills/job-offer-skill.service';
import { CandidateSkillAnswerService } from '../job-offer/job-offer-skills/candidate-skill-answer.service';
import { JobOfferService } from '../job-offer/job-offer/job-offer.service';
import { CreateCandidateSkillAnswerDto } from '../job-offer/job-offer-skills/dto/create-candidate-skill-answer.dto';

@Injectable()
export class CandidateApplicationService {
  constructor(
    @InjectRepository(CandidateApplication)
    private readonly applicationRepository: Repository<CandidateApplication>,
    @Inject(CandidateSkillAnswerService)
    private readonly candidateSkillAnswerService: CandidateSkillAnswerService,
    @Inject(JobOfferService)
    private readonly jobOfferService: JobOfferService,
    @Inject(JobOfferSkillService)
    private readonly jobOfferSkillService: JobOfferSkillService,
  ) { }

  async create(
    createDto: CreateCandidateApplicationDto,
  ): Promise<CandidateApplication> {
    const { candidate_id, job_offer_id, skill_answers } = createDto;

    return this.applicationRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // Validate if the application already exists
        const existing = await transactionalEntityManager.findOne(
          CandidateApplication,
          {
            where: { candidate_id, job_offer_id },
          },
        );

        if (existing) {
          throw new BadRequestException(
            'This candidate has already applied to the selected job offer.',
          );
        }

        // Validate if the job offer exists
        const jobOffer = await this.jobOfferService.findOne(job_offer_id);
        if (!jobOffer) {
          throw new NotFoundException(
            `Job offer with ID ${job_offer_id} not found`,
          );
        }

        // Validate if job offer is open
        if (jobOffer.status !== 'OPEN') {
          throw new BadRequestException('Cannot apply to a closed job offer');
        }

        // Create the application
        const application = transactionalEntityManager.create(
          CandidateApplication,
          {
            candidate_id,
            job_offer_id,
            status: ApplicationStatus.APPLIED,
          },
        );

        const savedApplication =
          await transactionalEntityManager.save(application);

        // Create skill answers if provided
        if (skill_answers && skill_answers.length > 0) {
          // First validate if all skill answers belong to the job offer
          await this.validateSkillAnswers(job_offer_id, skill_answers);

          await this.candidateSkillAnswerService.createForApplication(
            savedApplication.id,
            skill_answers,
            transactionalEntityManager,
          );
        }

        return await transactionalEntityManager.findOne(CandidateApplication, {
          where: { id: savedApplication.id },
          relations: ['skill_answers', 'skill_answers.job_offer_skill'],
        });
      },
    );
  }

  private async validateSkillAnswers(
    jobOfferId: string,
    skillAnswers: CreateCandidateSkillAnswerDto[],
  ): Promise<void> {
    // Obtain all skills from job offer.
    const jobOfferSkills =
      await this.jobOfferSkillService.findByJobOffer(jobOfferId);
    const jobOfferSkillIds = jobOfferSkills.map((skill) => skill.id);

    // Validate if all answered skills belong to the job offer.
    const invalidSkillIds = skillAnswers
      .map((answer) => answer.job_offer_skill_id)
      .filter((skillId) => !jobOfferSkillIds.includes(skillId));

    if (invalidSkillIds.length > 0) {
      throw new BadRequestException(
        `The following skills do not belong to this job offer: ${invalidSkillIds.join(', ')}`,
      );
    }

    // Do not allow duplicated answers
    const answeredSkillIds = skillAnswers.map(
      (answer) => answer.job_offer_skill_id,
    );
    const uniqueSkillIds = [...new Set(answeredSkillIds)];

    if (uniqueSkillIds.length !== answeredSkillIds.length) {
      throw new BadRequestException('Duplicate skill answers found');
    }
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
      search,
      exclude_status,
      page = 1,
      limit = 10,
    } = filterDto;

    const skip = (page - 1) * limit;

    const query = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.candidate', 'candidate')
      .leftJoinAndSelect('candidate.user', 'user')
      .leftJoinAndSelect('application.job_offer', 'job_offer')
      .leftJoinAndSelect('application.skill_answers', 'skill_answers')
      .leftJoinAndSelect('skill_answers.job_offer_skill', 'job_offer_skill')
      .orderBy('application.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere(
        '(user.first_name ILIKE :search OR user.last_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('application.status = :status', { status });
    }

    if (exclude_status) {
      query.andWhere('application.status != :exclude_status', { exclude_status });
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
      relations: [
        'skill_answers',
        'skill_answers.job_offer_skill',
        'candidate',
        'candidate.user',
        'job_offer',
      ],
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

  async updateTimestamp(id: string): Promise<void> {
    await this.applicationRepository.update(id, { updated_at: new Date() });
  }
}
