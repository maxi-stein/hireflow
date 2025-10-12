import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';
import { DegreeType } from '../interfaces/education.enum';

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  institution: string;

  @Column({
    type: 'enum',
    enum: DegreeType,
  })
  degree_type: DegreeType;

  @Column({ type: 'varchar' })
  field_of_study: string; // Eg: "Computer Science"

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null; // Nullable in case the education is ongoing

  @Column({ type: 'text', nullable: true })
  description?: string; // Additional details about the education (optional)

  @ManyToOne(() => Candidate, (candidate) => candidate.educations, {
    onDelete: 'CASCADE',
  })
  candidate: Candidate;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
