import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity('work_experiences')
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'candidate_id', type: 'uuid' })
  candidate_id: string;

  @Column({ type: 'varchar', length: 200 })
  company_name: string;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Candidate, (candidate) => candidate.work_experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;
}
