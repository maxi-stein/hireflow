import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';
import { Employee } from './employee.entity';
import { USER } from '../../../shared/constants/user.constants';
import { AUTH } from '../../../shared/constants/auth.constants';
import { UserType } from '../interfaces/user.enum';
import { UserFile } from './user-files.entity';

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

  @Column({ type: 'varchar', length: AUTH.MAX_PASSWORD_LENGTH, select: false })
  password: string;

  @Column({ enum: UserType })
  user_type: UserType;

  @OneToMany(() => UserFile, (file) => file.user)
  files: UserFile[];

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee?: Employee;

  @OneToOne(() => Candidate, (candidate) => candidate.user, { nullable: true })
  candidate?: Candidate;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
