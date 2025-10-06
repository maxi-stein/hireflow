import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

import { User } from '../../domain/users/entities/user.entity';
import { Candidate } from '../../domain/users/entities/candidate.entity';
import { Employee } from '../../domain/users/entities/employee.entity';
import { Education } from '../../domain/users/entities/education.entity';
import { CandidateApplication } from '../../domain/candidate-application/entities/candidate-application.entity';
import { Interview } from '../../domain/interviews/entities/interview.entity';
import { InterviewReview } from '../../domain/interview-review/entity/interview-review.entity';
import { JobOffer } from '../../domain/job-offer/job-offer/entities/job-offer.entity';
import { JobOfferSkill } from '../../domain/job-offer/job-offer-skills/entity/job-offer-skill.entity';
import { CandidateSkillAnswer } from '../../domain/job-offer/job-offer-skills/entity/candidate-skill-answer.entity';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    User,
    Candidate,
    Employee,
    Education,
    JobOffer,
    JobOfferSkill,
    CandidateApplication,
    CandidateSkillAnswer,
    Interview,
    InterviewReview,
  ],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  migrations: [join(__dirname, 'migrations', '*.ts')],
  migrationsTableName: 'migrations',
});
