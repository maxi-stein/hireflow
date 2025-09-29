// entities/interview-review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { CandidateApplication } from '../../candidate-application/entities/candidate-application.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import { Employee } from '../../users/entities';
import { ReviewStatus } from '../interface/review-status.enum';

@Entity('interview_reviews')
@Unique(['interview_id', 'employee_id', 'candidate_application_id'])
export class InterviewReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'interview_id', type: 'uuid' })
  interview_id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employee_id: string;

  @Column({ name: 'candidate_application_id', type: 'uuid' })
  candidate_application_id: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'integer', nullable: true })
  score: number;

  @Column({ type: 'simple-array', nullable: true })
  strengths: string[];

  @Column({ type: 'simple-array', nullable: true })
  weaknesses: string[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Interview, (interview) => interview.reviews)
  @JoinColumn({ name: 'interview_id' })
  interview: Interview;

  @ManyToOne(() => Employee, (employee) => employee.interview_reviews)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(
    () => CandidateApplication,
    (application) => application.interview_reviews,
  )
  @JoinColumn({ name: 'candidate_application_id' })
  candidate_application: CandidateApplication;
}
