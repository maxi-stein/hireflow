import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JobOfferSkill } from './entity/job-offer-skill.entity';
import { CreateJobOfferSkillDto } from './dto/create-job-offer-skill.dto';

@Injectable()
export class JobOfferSkillService {
  constructor(
    @InjectRepository(JobOfferSkill)
    private readonly skillRepository: Repository<JobOfferSkill>,
  ) {}

  //Used when creating a job offer.
  async createForJobOffer(
    jobOfferId: string,
    createDtos: CreateJobOfferSkillDto[],
    entityManager?: EntityManager,
  ): Promise<JobOfferSkill[]> {
    const manager = entityManager || this.skillRepository.manager;

    const skills = createDtos.map((dto) =>
      manager.create(JobOfferSkill, {
        ...dto,
        job_offer_id: jobOfferId,
      }),
    );

    return await manager.save(skills);
  }

  //Used when creating a candidate application.
  async findByJobOffer(jobOfferId: string): Promise<JobOfferSkill[]> {
    return await this.skillRepository.find({
      where: { job_offer_id: jobOfferId },
      order: { skill_name: 'ASC' },
    });
  }

  //Used when validating candidate application skill answers (when creating a candidate application)
  async findOne(skillId: string): Promise<JobOfferSkill> {
    return await this.skillRepository.findOne({ where: { id: skillId } });
  }

  async softDelete(skillId: string): Promise<void> {
    const result = await this.skillRepository.softDelete(skillId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Job offer skill with ID ${skillId} not found`,
      );
    }
  }
}
