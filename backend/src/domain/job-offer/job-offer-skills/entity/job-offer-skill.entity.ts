import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { JobOffer } from '../../job-offer/entities/job-offer.entity';

@Entity('job_offer_skills')
export class JobOfferSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_offer_id', type: 'uuid' })
  job_offer_id: string;

  @Column({ type: 'varchar', length: 100 })
  skill_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.skills)
  @JoinColumn({ name: 'job_offer_id' })
  job_offer: JobOffer;
}
