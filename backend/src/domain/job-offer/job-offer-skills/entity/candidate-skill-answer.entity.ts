import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobOfferSkill } from './job-offer-skill.entity';
import { CandidateApplication } from '../../../candidate-application/entities/candidate-application.entity';

@Entity('candidate_skill_answers')
export class CandidateSkillAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'candidate_application_id', type: 'uuid' })
  candidate_application_id: string;

  @Column({ name: 'job_offer_skill_id', type: 'uuid' })
  job_offer_skill_id: string;

  @Column({ type: 'integer' })
  years_of_experience: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => CandidateApplication, (app) => app.skill_answers)
  @JoinColumn({ name: 'candidate_application_id' })
  candidate_application: CandidateApplication;

  @ManyToOne(() => JobOfferSkill)
  @JoinColumn({ name: 'job_offer_skill_id' })
  job_offer_skill: JobOfferSkill;
}
