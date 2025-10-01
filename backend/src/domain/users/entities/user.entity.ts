import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Candidate } from './candidate.entity';
import { Employee } from './employee.entity';
import { USER } from '../../../shared/constants/user.constants';
import { AUTH } from '../../../shared/constants/auth.constants';
import { UserType } from '../interfaces/user.enum';

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

  @Column({ type: 'varchar', length: AUTH.BCRYPT_SALT_ROUNDS, select: false })
  password: string;

  @Column({ enum: UserType })
  user_type: UserType;

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee?: Employee;

  @OneToOne(() => Candidate, (candidate) => candidate.user, { nullable: true })
  candidate?: Candidate;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
