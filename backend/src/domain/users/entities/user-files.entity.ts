import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from '../interfaces/file-type.enum';
import { Candidate } from './candidate.entity';

@Entity('user_files')
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256 })
  file_name: string; // Name to display in UI

  @Column({ type: 'varchar', length: 256 })
  stored_name: string; // Name in filesystem

  @Column({ type: 'varchar', length: 512 })
  file_path: string;

  @Column({ type: 'varchar', length: 64 })
  mime_type: string;

  @Column({ type: 'int' })
  size: number;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  file_type: FileType;

  @ManyToOne(() => Candidate, (candidate) => candidate.files)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
