import {
  EMPLOYEE,
  EMPLOYEE_ROLES,
} from '../../../shared/constants/user.constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import { InterviewReview } from '../../interview-review/entity/interview-review.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    array: true,
    length: EMPLOYEE_ROLES.LENGTH,
  })
  roles: string[];

  @Column({ type: 'varchar', length: EMPLOYEE.MAX_POSITION_LENGTH })
  position: string;

  @OneToOne(() => User, (user) => user.employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'profile_created_at' })
  profile_created_at: Date;

  @UpdateDateColumn({ name: 'profile_updated_at' })
  profile_updated_at: Date;

  @ManyToMany(() => Interview, (interview) => interview.interviewers)
  interviews: Interview[];

  @OneToMany(() => InterviewReview, (review) => review.employee)
  interview_reviews: InterviewReview[];
}
