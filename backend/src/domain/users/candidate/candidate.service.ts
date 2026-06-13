import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../entities/candidate.entity';
import { User } from '../entities/user.entity';
import { UpdateCandidateDto } from '../dto/candidate/update-candidate.dto';
import { CandidateResponseDto } from '../dto/candidate/candidate-response.dto';
import { PaginatedResponse } from '../../../shared/dto/pagination/pagination.dto';
import {
  CandidateFilterDto,
  CandidateSortBy,
} from '../dto/candidate/candidate-filter.dto';
import { UserType } from '../interfaces/user.enum';
import { RegisterCandidateDto } from '../dto/user/create-user.dto';
import { UsersService } from '../base-user/user.service';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly usersService: UsersService,
  ) {}

  // Public method for candidate creation/registration
  async create(registerCandidateDto: RegisterCandidateDto): Promise<User> {
    return this.candidateRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Create user using UserService (handles validation and password hashing)
        const userSaved = await this.usersService.create(
          {
            first_name: registerCandidateDto.first_name,
            last_name: registerCandidateDto.last_name,
            email: registerCandidateDto.email,
            password: registerCandidateDto.password,
          },
          UserType.CANDIDATE,
          transactionalEntityManager,
        );

        // Create the candidate profile with default empty fields
        const candidate = transactionalEntityManager.create(Candidate, {
          age: null,
          phone: null,
          github: null,
          linkedin: null,
          city: null,
          country: null,
          user: { id: userSaved.id },
        });
        await transactionalEntityManager.save(candidate);

        // Return user with candidate relation (excluding password)
        const userWithCandidate = await this.usersService.findOne(
          { id: userSaved.id },
          transactionalEntityManager,
          ['candidate', 'employee'],
        );

        const { password, ...result } = userWithCandidate;
        return result as User;
      },
    );
  }

  async findAll(
    filterDto: CandidateFilterDto,
  ): Promise<PaginatedResponse<CandidateResponseDto>> {
    const { page = 1, limit = 10, search, sort } = filterDto;
    const queryBuilder =
      this.candidateRepository.createQueryBuilder('candidate');

    queryBuilder
      .leftJoinAndSelect('candidate.user', 'user')
      .leftJoinAndSelect('candidate.educations', 'educations')
      .leftJoinAndSelect('candidate.work_experiences', 'work_experiences');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.first_name) LIKE LOWER(:search) OR LOWER(user.last_name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (sort === CandidateSortBy.LAST_NAME) {
      queryBuilder.orderBy('user.last_name', 'ASC');
    } else {
      queryBuilder.orderBy('candidate.profile_updated_at', 'DESC');
    }

    // Add secondary sort to ensure stable pagination
    queryBuilder.addOrderBy('candidate.id', 'ASC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [candidates, total] = await queryBuilder.getManyAndCount();

    return {
      data: candidates.map(this.mapToResponseDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CandidateResponseDto> {
    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: ['user', 'educations', 'work_experiences'],
      order: {
        work_experiences: {
          start_date: 'DESC',
        },
        educations: {
          start_date: 'DESC',
        },
      },
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
          relations: ['educations', 'work_experiences'],
        });

        if (!candidate) {
          throw new NotFoundException(`Candidate with ID ${id} not found`);
        }

        const { ...candidateFields } = updateCandidateDto;

        // Update candidate fields
        const updatedCandidate = transactionalEntityManager.merge(
          Candidate,
          candidate,
          candidateFields,
        );

        await transactionalEntityManager.save(updatedCandidate);

        const fullCandidate = await transactionalEntityManager.findOne(
          Candidate,
          {
            where: { id },
            relations: ['user', 'educations', 'work_experiences'],
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

  private mapToResponseDto(candidate: Candidate): CandidateResponseDto {
    return {
      id: candidate.id,
      age: candidate.age,
      phone: candidate.phone,
      city: candidate.city,
      country: candidate.country,
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
