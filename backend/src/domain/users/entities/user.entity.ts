import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';
import { Employee } from './employee.entity';
import { USER } from '../../../shared/constants/user.constants';
import { AUTH } from '../../../shared/constants/auth.constants';
import { UserType, AuthProvider } from '../interfaces/user.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: USER.FIRST_NAME_LENGTH })
  first_name: string;

  @Column({ type: 'varchar', length: USER.LAST_NAME_LENGTH })
  last_name: string;

  @Column({ type: 'varchar', length: USER.EMAIL_LENGTH, unique: true })
  email: string;

  @Column({ type: 'varchar', length: AUTH.MAX_PASSWORD_LENGTH, select: false, nullable: true })
  password?: string;

  @Column({ enum: UserType })
  user_type: UserType;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  auth_provider: AuthProvider;

  @Column({ type: 'varchar', nullable: true, unique: true })
  google_id?: string;

  @Column({ type: 'varchar', nullable: true })
  hashed_refresh_token: string;

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee?: Employee;

  @OneToOne(() => Candidate, (candidate) => candidate.user, { nullable: true })
  candidate?: Candidate;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
