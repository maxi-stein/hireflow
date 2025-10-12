import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Candidate } from '../entities/candidate.entity';
import { User } from '../entities/user.entity';
import { Education } from '../entities/education.entity';
import { WorkExperience } from '../entities/work-experience.entity';
import { CreateCandidateDto } from '../dto/candidate/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/candidate/update-candidate.dto';
import { CandidateResponseDto } from '../dto/candidate/candidate-response.dto';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../shared/dto/pagination/pagination.dto';
import { EducationService } from '../education/education.service';
import { WorkExperienceService } from '../work-experience/work-experience.service';
import { UserType } from '../interfaces/user.enum';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly educationService: EducationService,
    private readonly workExperienceService: WorkExperienceService,
  ) {}

  async create(
    userId: string,
    createCandidateDto: CreateCandidateDto,
    entityManager?: EntityManager,
  ): Promise<CandidateResponseDto> {
    return this.candidateRepository.manager.transaction(async () => {
      const manager = entityManager || this.candidateRepository.manager;

      // Validate user exists and is candidate type
      const user = await manager.findOne(User, {
        where: { id: userId },
        select: ['id', 'user_type'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (user.user_type !== UserType.CANDIDATE) {
        throw new BadRequestException(
          `User with ID ${userId} is not a candidate`,
        );
      }

      // Check if candidate profile already exists
      const existingCandidate = await manager.exists(Candidate, {
        where: { user: { id: userId } },
      });

      if (existingCandidate) {
        throw new ConflictException(
          `Candidate profile already exists for user ${userId}`,
        );
      }

      // Create candidate entity
      const candidate = manager.create(Candidate, {
        age: createCandidateDto.age,
        phone: createCandidateDto.phone,
        resume_url: createCandidateDto.resume_url,
        portfolio_url: createCandidateDto.portfolio_url,
        github: createCandidateDto.github,
        linkedin: createCandidateDto.linkedin,
        user: { id: userId },
      });

      const savedCandidate = await manager.save(candidate);

      // Create education records if provided
      if (createCandidateDto.educations?.length > 0) {
        const educations = createCandidateDto.educations.map((edu) =>
          manager.create(Education, {
            ...edu,
            candidate: savedCandidate,
          }),
        );
        await manager.save(educations);
      }

      // Create work experience records if provided
      if (createCandidateDto.work_experiences?.length > 0) {
        const workExperiences = createCandidateDto.work_experiences.map((exp) =>
          manager.create(WorkExperience, {
            ...exp,
            candidate: savedCandidate,
          }),
        );
        await manager.save(workExperiences);
      }

      // Return full candidate with relations
      return this.mapToResponseDto(
        await this.findCandidateWithRelations(savedCandidate.id, manager),
      );
    });
  }

  async registerCandidate(userId: string, manager: EntityManager) {
    const candidate = manager.create(Candidate, {
      age: null,
      phone: null,
      resume_url: null,
      portfolio_url: null,
      github: null,
      linkedin: null,
      user: { id: userId },
    });

    await manager.save(candidate);
  }

  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<CandidateResponseDto>> {
    const [candidates, total] = await this.candidateRepository.findAndCount({
      relations: ['user', 'education', 'work_experiences'],
      select: this.getCandidateSelectFields(),
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });
    return {
      data: candidates.map(this.mapToResponseDto),
      pagination: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: string): Promise<CandidateResponseDto> {
    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: ['user', 'education', 'work_experiences'],
      select: this.getCandidateSelectFields(),
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    return this.mapToResponseDto(candidate);
  }

  async update(
    id: string,
    updateCandidateDto: UpdateCandidateDto,
  ): Promise<CandidateResponseDto> {
    return this.candidateRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const candidate = await transactionalEntityManager.findOne(Candidate, {
          where: { id },
          relations: ['education', 'work_experiences'],
        });

        if (!candidate) {
          throw new NotFoundException(`Candidate with ID ${id} not found`);
        }

        const { educations, work_experiences, ...candidateFields } =
          updateCandidateDto;

        // Update candidate fields
        const updatedCandidate = transactionalEntityManager.merge(
          Candidate,
          candidate,
          candidateFields,
        );

        await transactionalEntityManager.save(updatedCandidate);

        // Update candidate educations
        if (educations) {
          await this.educationService.updateEducations(
            candidate.id,
            educations,
            transactionalEntityManager,
          );
        }

        // Update candidate work experiences
        if (work_experiences) {
          await this.workExperienceService.updateWorkExperiences(
            candidate.id,
            work_experiences,
            transactionalEntityManager,
          );
        }

        const fullCandidate = await transactionalEntityManager.findOne(
          Candidate,
          {
            where: { id },
            relations: ['user', 'education', 'work_experiences'],
          },
        );

        return this.mapToResponseDto(fullCandidate);
      },
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
  }

  // ===== Helper Methods =====

  /**
   * Finds candidate with relations using EntityManager
   * @param id - Candidate ID
   * @param entityManager - Transactional entity manager
   * @returns Candidate with relations
   */
  private async findCandidateWithRelations(
    id: string,
    entityManager = this.candidateRepository.manager,
  ): Promise<Candidate> {
    return entityManager.findOne(Candidate, {
      where: { id },
      relations: ['user', 'education', 'work_experiences'],
      select: this.getCandidateSelectFields(),
    });
  }

  /**
   * Defines fields to select for candidate queries
   * @returns Selection fields configuration
   */
  private getCandidateSelectFields(): Record<string, any> {
    return {
      id: true,
      age: true,
      phone: true,
      resume_url: true,
      portfolio_url: true,
      github: true,
      linkedin: true,
      profile_created_at: true,
      profile_updated_at: true,
      user: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
      education: {
        id: true,
        institution: true,
        degree_type: true,
        field_of_study: true,
        start_date: true,
        end_date: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
      work_experiences: {
        id: true,
        company_name: true,
        position: true,
        start_date: true,
        end_date: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    };
  }

  private mapToResponseDto(candidate: Candidate): CandidateResponseDto {
    return {
      id: candidate.id,
      age: candidate.age,
      phone: candidate.phone,
      resume_url: candidate.resume_url,
      portfolio_url: candidate.portfolio_url,
      github: candidate.github,
      linkedin: candidate.linkedin,
      user: {
        id: candidate.user.id,
        first_name: candidate.user.first_name,
        last_name: candidate.user.last_name,
        email: candidate.user.email,
        created_at: candidate.user.created_at,
        updated_at: candidate.user.updated_at,
      },
      educations: candidate.educations?.map((edu) => ({
        candidate_id: candidate.id,
        id: edu.id,
        institution: edu.institution,
        degree_type: edu.degree_type,
        created_at: edu.created_at,
        updated_at: edu.updated_at,
        field_of_study: edu.field_of_study,
        start_date: edu.start_date,
        end_date: edu.end_date,
        description: edu.description,
      })),
      work_experiences: candidate.work_experiences?.map((exp) => ({
        candidate_id: candidate.id,
        id: exp.id,
        company_name: exp.company_name,
        position: exp.position,
        start_date: exp.start_date,
        end_date: exp.end_date,
        description: exp.description,
        created_at: exp.created_at,
        updated_at: exp.updated_at,
      })),
      profile_created_at: candidate.profile_created_at,
      profile_updated_at: candidate.profile_updated_at,
    };
  }
}
