// entities/interview.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InterviewType } from '../interfaces/interview-type.enum';
import { InterviewStatus } from '../interfaces/interview-status.enum';
import { CandidateApplication } from '../../candidate-application/entities/candidate-application.entity';
import { Employee } from '../../users/entities';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: InterviewType,
    name: 'type',
  })
  type: InterviewType;

  @Column({
    name: 'scheduled_time',
    type: 'timestamp',
  })
  scheduled_time: Date;

  @Column({
    name: 'meeting_link',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  meeting_link: string;

  @Column({
    type: 'enum',
    enum: InterviewStatus,
    default: InterviewStatus.SCHEDULED,
    name: 'status',
  })
  status: InterviewStatus;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;

  @ManyToMany(
    () => CandidateApplication,
    (application) => application.interviews,
  )
  @JoinTable({
    name: 'interview_applications',
    joinColumn: {
      name: 'interview_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'candidate_application_id',
      referencedColumnName: 'id',
    },
  })
  applications: CandidateApplication[];

  // Relation ManyToMany to Employee (interviewers)
  @ManyToMany(() => Employee, (employee) => employee.interviews)
  @JoinTable({
    name: 'employee_interviews',
    joinColumn: {
      name: 'interview_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'employee_id',
      referencedColumnName: 'id',
    },
  })
  interviewers: Employee[];
}
