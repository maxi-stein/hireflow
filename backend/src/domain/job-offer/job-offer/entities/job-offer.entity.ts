import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobOfferStatus } from '../interfaces/job-offer-status.enum';
import { WorkMode } from '../interfaces/work-mode.enum';
import { JobOfferSkill } from '../../job-offer-skills/entity/job-offer-skill.entity';
import { CandidateApplication } from '../../../candidate-application/entities/candidate-application.entity';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  position: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({
    type: 'enum',
    enum: WorkMode,
    nullable: false,
  })
  work_mode: WorkMode;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  salary?: string;

  @Column({ type: 'text', nullable: true })
  benefits?: string;

  @Column({
    type: 'enum',
    enum: JobOfferStatus,
    default: JobOfferStatus.OPEN,
  })
  status: JobOfferStatus;

  @OneToMany(() => CandidateApplication, (application) => application.job_offer)
  applications: CandidateApplication[];

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => JobOfferSkill, (skill) => skill.job_offer)
  skills: JobOfferSkill[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
