import { USER } from '../../../shared/constants/user.constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Education } from './education.entity';
import { User } from './user.entity';
import { CandidateApplication } from '../../candidate-application/entities/candidate-application.entity';
import { WorkExperience } from './work-experience.entity';
import { UserFile } from './user-files.entity';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'varchar', length: USER.PHONE_LENGTH, nullable: true })
  phone: string | null;

  @OneToMany(() => UserFile, (file) => file.candidate)
  files: UserFile[];

  @Column({ type: 'varchar', length: USER.URL_LENGTH, nullable: true })
  github: string | null;

  @Column({ type: 'varchar', length: USER.URL_LENGTH, nullable: true })
  linkedin: string | null;

  @OneToMany(() => Education, (education) => education.candidate)
  educations: Education[];

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.candidate)
  work_experiences: WorkExperience[];

  @OneToOne(() => User, (user) => user.candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CandidateApplication, (application) => application.candidate)
  applications: CandidateApplication[];

  @CreateDateColumn({ name: 'profile_created_at' })
  profile_created_at: Date;

  @UpdateDateColumn({ name: 'profile_updated_at' })
  profile_updated_at: Date;
}
