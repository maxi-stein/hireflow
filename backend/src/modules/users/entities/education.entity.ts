import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DegreeType } from '../interfaces';
import { Candidate } from './candidate.entity';

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

  @ManyToOne(() => Candidate, (candidate) => candidate.education, {
    onDelete: 'CASCADE',
  })
  candidate: Candidate;
}
