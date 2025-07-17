import { USER } from '../../../shared/constants/user.constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Education } from './education.entity';
import { User } from './user.entity';

@Entity('candidates')
export class Candidate {
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
  github: string | null;

  @Column({ type: 'varchar', length: USER.URL_LENGTH, nullable: true })
  linkedin: string | null;

  @OneToMany(() => Education, (education) => education.candidate)
  education: Education[];

  @OneToOne(() => User, (user) => user.candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
