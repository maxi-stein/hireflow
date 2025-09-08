import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { Education } from '../entities/education.entity';
import { Candidate } from '../entities/candidate.entity';
import { CreateEducationDto } from '../dto/education/create-education.dto';
import { UpdateEducationDto } from '../dto/education/update-education.dto';
import { EducationResponseDto } from '../dto/education/education-response.dto';
import {
  PaginationDto,
  PaginatedResponse,
} from '../../../shared/dto/pagination/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.educationRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Validate if the candidate exists
        const candidate = await transactionalEntityManager.findOne(Candidate, {
          where: { id: createEducationDto.candidate_id },
          select: ['id'],
        });

        if (!candidate) {
          throw new NotFoundException(
            `Candidate with ID ${createEducationDto.candidate_id} not found`,
          );
        }

        // Validate dates
        this.validateEducationDates(createEducationDto);

        // Create the education
        const education = transactionalEntityManager.create(Education, {
          ...createEducationDto,
          candidate: { id: createEducationDto.candidate_id } as Candidate,
        });

        const savedEducation = await transactionalEntityManager.save(education);
        return this.mapToResponseDto(savedEducation);
      },
    );
  }

  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<EducationResponseDto>> {
    const [educations, total] = await this.educationRepository.findAndCount({
      relations: ['candidate'],
      select: this.getEducationSelectFields(),
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return {
      data: educations.map(this.mapToResponseDto),
      pagination: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: string): Promise<EducationResponseDto> {
    const education = await this.educationRepository.findOne({
      where: { id },
      relations: ['candidate'],
      select: this.getEducationSelectFields(),
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return this.mapToResponseDto(education);
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
    manager?: EntityManager,
  ): Promise<EducationResponseDto> {
    const entityManager = manager || this.educationRepository.manager;
    return entityManager.transaction(async (transactionalEntityManager) => {
      // Verify if education exists
      const education = await transactionalEntityManager.findOne(Education, {
        where: { id },
        relations: ['candidate'],
      });

      if (!education) {
        throw new NotFoundException(`Education with ID ${id} not found`);
      }

      if (updateEducationDto.institution) {
        this.validateInstitution(updateEducationDto);
      }

      // Validate is dates are present and correct
      if (updateEducationDto.start_date || updateEducationDto.end_date) {
        this.validateEducationDates({
          start_date: updateEducationDto.start_date || education.start_date,
          end_date: updateEducationDto.end_date ?? education.end_date,
        });
      }

      // Update the education and get result
      const updateResult: UpdateResult =
        await transactionalEntityManager.update(
          Education,
          id,
          updateEducationDto,
        );

      if (updateResult.affected === 0) {
        throw new NotFoundException(
          `Education with ID ${id} not found or no changes were made`,
        );
      }

      // Get the updated education
      const updatedEducation = await transactionalEntityManager.findOne(
        Education,
        {
          where: { id },
          relations: ['candidate'],
        },
      );

      return this.mapToResponseDto(updatedEducation);
    });
  }

  async updateEducations(
    candidateId: string,
    educationsDto: UpdateEducationDto[],
    manager?: EntityManager,
  ): Promise<EducationResponseDto[]> {
    const entityManager = manager || this.educationRepository.manager;

    // Get existing educations
    const existingEducations = await entityManager.find(Education, {
      where: { candidate: { id: candidateId } },
    });

    const existingIds = existingEducations.map((edu) => edu.id);
    const incomingIds = educationsDto
      .filter((edu) => edu.id)
      .map((edu) => edu.id!);

    // Remove educations not present
    const toRemove = existingEducations.filter(
      (edu) => !incomingIds.includes(edu.id),
    );

    if (toRemove.length > 0) {
      await entityManager.remove(Education, toRemove);
    }

    // Process each education
    for (const eduDto of educationsDto) {
      if (eduDto.id && existingIds.includes(eduDto.id)) {
        // Use the existing update method for each education
        await this.update(eduDto.id, eduDto, entityManager);
      } else {
        // Create new education
        const errors = await this.validateEducationDto(eduDto);
        if (errors) {
          const formattedErrors = errors
            .map((err) => {
              const constraints = Object.values(err.constraints || {}).join(
                ', ',
              );
              return `Property "${err.property}": ${constraints}`;
            })
            .join('; ');

          throw new BadRequestException(
            `Validation failed for Education object with ID: ${eduDto.id}. Errors: ${formattedErrors}`,
          );
        }
        const newEducation = entityManager.create(Education, {
          ...eduDto,
          candidate: { id: candidateId },
        });
        await entityManager.save(newEducation);
      }
    }
    // Return all educations for the candidate
    const updatedEducations = await entityManager.find(Education, {
      where: { candidate: { id: candidateId } },
      relations: ['candidate'],
    });

    return updatedEducations.map(this.mapToResponseDto);
  }

  async validateEducationDto(input: UpdateEducationDto) {
    // Transform the plain object into an instance of the DTO
    const dtoInstance = plainToInstance(UpdateEducationDto, input);

    // Validate the DTO (you can pass options like whitelist, forbidNonWhitelisted, etc.)
    const errors = await validate(dtoInstance, {
      whitelist: true, // removes properties not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are properties not allowed
    });

    if (errors.length > 0) {
      // Return formatted errors
      return errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
    }

    return null;
  }

  async remove(id: string): Promise<void> {
    const result = await this.educationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }
  }

  // ===== Helper Methods =====

  private validateEducationDates(dto: {
    start_date: Date;
    end_date?: Date | null;
  }): void {
    if (dto.end_date && dto.end_date < dto.start_date) {
      throw new BadRequestException('End date cannot be before start date');
    }

    if (dto.start_date > new Date()) {
      throw new BadRequestException('Start date cannot be in the future');
    }
  }

  private validateInstitution(dto: UpdateEducationDto) {
    if (dto.institution && !dto.degree_type) {
      throw new BadRequestException(
        'A Degree Type must be provided for the Institution',
      );
    }
  }

  private getEducationSelectFields(): Record<string, any> {
    return {
      id: true,
      institution: true,
      degree_type: true,
      field_of_study: true,
      start_date: true,
      end_date: true,
      description: true,
      candidate: {
        id: true,
      },
    };
  }

  private mapToResponseDto(education: Education): EducationResponseDto {
    return {
      id: education.id,
      institution: education.institution,
      degree_type: education.degree_type,
      field_of_study: education.field_of_study,
      start_date: education.start_date,
      end_date: education.end_date,
      description: education.description,
      candidate_id: education.candidate.id,
      created_at: education.created_at,
      updated_at: education.updated_at,
    };
  }
}
