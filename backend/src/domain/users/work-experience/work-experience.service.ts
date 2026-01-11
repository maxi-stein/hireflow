import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WorkExperience } from '../entities/work-experience.entity';
import { CreateWorkExperienceDto } from '../dto/work-experience/create-work-experience.dto';
import { UpdateWorkExperienceDto } from '../dto/work-experience/update-work-experience.dto';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async create(
    candidateId: string,
    createDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    // Validate dates
    this.validateWorkExperienceDates(createDto);

    const workExperience = this.workExperienceRepository.create({
      ...createDto,
      candidate_id: candidateId,
    });

    return await this.workExperienceRepository.save(workExperience);
  }

  async findAllByCandidate(candidateId: string): Promise<WorkExperience[]> {
    return await this.workExperienceRepository.find({
      where: { candidate_id: candidateId },
      order: { start_date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<WorkExperience> {
    const workExperience = await this.workExperienceRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });

    if (!workExperience) {
      throw new NotFoundException(`Work experience with ID ${id} not found`);
    }

    return workExperience;
  }

  async update(
    id: string,
    updateDto: UpdateWorkExperienceDto,
  ): Promise<WorkExperience> {
    const workExperience = await this.findOne(id);

    // Validate if dates are updating
    if (updateDto.start_date || updateDto.end_date) {
      const mergedData = { ...workExperience, ...updateDto };
      this.validateWorkExperienceDates(mergedData);
    }

    Object.assign(workExperience, updateDto);
    return await this.workExperienceRepository.save(workExperience);
  }

  async remove(id: string): Promise<void> {
    const workExperience = await this.findOne(id);
    await this.workExperienceRepository.remove(workExperience);
  }

  private validateWorkExperienceDates(
    dto: CreateWorkExperienceDto | any,
  ): void {
    // Validate end_date is not older than start_date
    if (dto.end_date && new Date(dto.end_date) < new Date(dto.start_date)) {
      throw new BadRequestException('End date cannot be before start date');
    }

    // Validate start_date is not in the future
    if (new Date(dto.start_date) > new Date()) {
      throw new BadRequestException('Start date cannot be in the future');
    }
  }
}
