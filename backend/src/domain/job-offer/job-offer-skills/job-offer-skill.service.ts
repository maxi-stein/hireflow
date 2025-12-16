import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { JobOfferSkill } from './entity/job-offer-skill.entity';

@Injectable()
export class JobOfferSkillService {
  constructor(
    @InjectRepository(JobOfferSkill)
    private readonly skillRepository: Repository<JobOfferSkill>,
  ) {}

  async findOrCreateByName(skillNames: string[]): Promise<JobOfferSkill[]> {
    if (!skillNames || skillNames.length === 0) return [];

    const normalizedNames = [...new Set(skillNames.map((name) => name.toLowerCase()))];
    
    // Find existing skills
    // Using QueryBuilder for case-insensitive search
    const existingSkills = await this.skillRepository
      .createQueryBuilder('skill')
      .where('LOWER(skill.skill_name) IN (:...names)', { names: normalizedNames })
      .getMany();

    const existingNames = existingSkills.map(s => s.skill_name.toLowerCase());
    const newNames = normalizedNames.filter(name => !existingNames.includes(name));

    // Create new skills
    const newSkills: JobOfferSkill[] = [];
    if (newNames.length > 0) {
      const createdSkills = newNames.map(name => 
        this.skillRepository.create({ skill_name: name })
      );
      const savedSkills = await this.skillRepository.save(createdSkills);
      newSkills.push(...savedSkills);
    }

    return [...existingSkills, ...newSkills];
  }

  async findByJobOffer(jobOfferId: string): Promise<JobOfferSkill[]> {
    return await this.skillRepository.find({
      where: { job_offers: { id: jobOfferId } },
      order: { skill_name: 'ASC' },
    });
  }

  async findOne(skillId: string): Promise<JobOfferSkill> {
    const skill = await this.skillRepository.findOne({ where: { id: skillId } });
    if (!skill) {
      throw new NotFoundException(`Job offer skill with ID ${skillId} not found`);
    }
    return skill;
  }

  async softDelete(skillId: string): Promise<void> {
    const result = await this.skillRepository.softDelete(skillId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Job offer skill with ID ${skillId} not found`,
      );
    }
  }

  async search(query: string): Promise<JobOfferSkill[]> {
    if (!query) return [];
    
    return await this.skillRepository
      .createQueryBuilder('skill')
      .where('LOWER(skill.skill_name) LIKE :query', { query: `%${query.toLowerCase()}%` })
      .take(10)
      .orderBy('skill.skill_name', 'ASC')
      .getMany();
  }
}
