import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToMany,
} from 'typeorm';
import { ApplicationStatus } from '../interfaces/application-status';
import { JobOffer } from '../../job-offer/entities/job-offer.entity';
import { Candidate } from '../../users/entities';
import { Interview } from '../../interviews/entities/interview.entity';

@Entity('candidate_applications')
@Unique(['job_offer_id', 'candidate_id'])
export class CandidateApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_offer_id', type: 'uuid' })
  job_offer_id: string;

  @Column({ name: 'candidate_id', type: 'uuid' })
  candidate_id: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.IN_PROGRESS,
  })
  status: ApplicationStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.applications)
  @JoinColumn({ name: 'job_offer_id' })
  job_offer: JobOffer;

  @ManyToOne(() => Candidate, (candidate) => candidate.applications)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ManyToMany(() => Interview, (interview) => interview.applications)
  interviews: Interview[];
}
