import { EMPLOYEE } from '../../../shared/constants/user.constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EmployeeRole } from '../interfaces/user.enum';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
  })
  role: EmployeeRole;

  @Column({ type: 'varchar', length: EMPLOYEE.MAX_POSITION_LENGTH })
  position: string;

  @OneToOne(() => User, (user) => user.employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  profile_created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  profile_updated_at: Date;
}
