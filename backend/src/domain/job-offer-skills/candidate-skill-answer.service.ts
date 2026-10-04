// services/candidate-skill-answer.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JobOfferSkillService } from './job-offer-skill.service';
import { CandidateSkillAnswer } from './entity/candidate-skill-answer.entity';
import { CreateCandidateSkillAnswerDto } from './dto/create-candidate-skill-answer.dto';

@Injectable()
export class CandidateSkillAnswerService {
  constructor(
    @InjectRepository(CandidateSkillAnswer)
    private readonly answerRepository: Repository<CandidateSkillAnswer>,
  ) {}

  async createForApplication(
    applicationId: string,
    createDtos: CreateCandidateSkillAnswerDto[],
    entityManager?: EntityManager,
  ): Promise<CandidateSkillAnswer[]> {
    const manager = entityManager || this.answerRepository.manager;

    const answers = createDtos.map((dto) =>
      manager.create(CandidateSkillAnswer, {
        ...dto,
        candidate_application_id: applicationId,
      }),
    );

    return await manager.save(answers);
  }

  async findByApplication(applicationId: string) {
    return await this.answerRepository.find({
      where: { candidate_application_id: applicationId },
      relations: ['job_offer_skill'],
    });
  }
}
