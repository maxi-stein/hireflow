import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Import entities explicitly
import { User } from '../../domain/users/entities/user.entity';
import { Candidate } from '../../domain/users/entities/candidate.entity';
import { Employee } from '../../domain/users/entities/employee.entity';
import { Education } from '../../domain/users/entities/education.entity';
import { JobOffer } from '../../domain/job-offer/entities/job-offer.entity';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Candidate, Employee, Education, JobOffer],
  synchronize: false,
  logging: true,
  migrations: [join(__dirname, 'migrations', '*.ts')],
  migrationsTableName: 'migrations',
});
