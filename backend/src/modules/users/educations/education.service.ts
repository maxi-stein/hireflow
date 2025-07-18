import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../entities/education.entity';
import { Candidate } from '../entities/candidate.entity';
import { CreateEducationDto } from '../dto/education/create-education.dto';
import { UpdateEducationDto } from '../dto/education/update-education.dto';
import { EducationResponseDto } from '../dto/education/education-response.dto';
import {
  PaginationDto,
  PaginatedResponse,
} from '../dto/pagination/pagination.dto';

@Injectable()
export class EducationsService {
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
  ): Promise<EducationResponseDto> {
    return this.educationRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Verify if education exists
        const education = await transactionalEntityManager.findOne(Education, {
          where: { id },
          relations: ['candidate'],
        });

        if (!education) {
          throw new NotFoundException(`Education with ID ${id} not found`);
        }

        // Validate is dates are present and correct
        if (updateEducationDto.start_date || updateEducationDto.end_date) {
          this.validateEducationDates({
            start_date: updateEducationDto.start_date || education.start_date,
            end_date: updateEducationDto.end_date ?? education.end_date,
          });
        }

        // Update the education
        await transactionalEntityManager.update(
          Education,
          id,
          updateEducationDto,
        );

        // Get the updated education
        const updatedEducation = await transactionalEntityManager.findOne(
          Education,
          {
            where: { id },
            relations: ['candidate'],
          },
        );

        if (!updatedEducation) {
          throw new NotFoundException(
            `Education with ID ${id} not found after update`,
          );
        }

        return this.mapToResponseDto(updatedEducation);
      },
    );
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
    };
  }
}
