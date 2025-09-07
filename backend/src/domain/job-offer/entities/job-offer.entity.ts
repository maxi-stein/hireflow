import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobOfferStatus } from '../interfaces/job-offer-status.enum';
import { WorkMode } from '../interfaces/work-mode.enum';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  position: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({
    type: 'enum',
    enum: WorkMode,
    nullable: false,
  })
  work_mode: WorkMode;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  salary?: string;

  @Column({ type: 'text', nullable: true })
  benefits?: string;

  @Column({
    type: 'enum',
    enum: JobOfferStatus,
    default: JobOfferStatus.OPEN,
  })
  status: JobOfferStatus;

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  // TODO: Uncomment when SkillQuestion entity is created
  // @ManyToMany(() => SkillQuestion, (skillQuestion) => skillQuestion.jobOffers)
  // @JoinTable({
  //   name: 'job_offer_skills',
  //   joinColumn: {
  //     name: 'job_offer_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'skill_question_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // skillQuestions: SkillQuestion[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
