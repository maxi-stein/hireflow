import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Education } from './education.entity';
import { EmployeeRole, UserType } from '../interfaces';
import { AUTH, EMPLOYEE, USER } from 'src/shared/constants';

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

  @Column({ type: 'varchar', length: AUTH.BCRYTYPT_HASH_LENGTH, select: false })
  password: string;

  @Column({ enum: UserType })
  user_type: UserType;

  @OneToOne(() => Employee, (employee) => employee.user)
  employee?: Employee;

  // @OneToOne(() => Candidate, (candidate) => candidate.user)
  // candidate?: Candidate;
}

@Entity('employees')
export class Employee extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
  })
  role: EmployeeRole;

  @Column({ type: 'varchar', length: EMPLOYEE.MAX_POSITION_LENGTH })
  position: string;

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn()
  user: User;
}

@Entity('candidates')
export class Candidate extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: USER.PHONE_LENGTH })
  phone: string;

  @Column({ type: 'varchar', length: USER.URL_LENGTH })
  resume_url: string;

  @Column({ type: 'varchar', length: USER.URL_LENGTH })
  portfolio_url: string;

  @Column({ type: 'varchar', length: USER.URL_LENGTH, nullable: true })
  github?: string;

  @Column({ type: 'varchar', length: USER.URL_LENGTH, nullable: true })
  linkedin?: string;

  @OneToMany(() => Education, (education) => education.candidate)
  education: Education[];
}
