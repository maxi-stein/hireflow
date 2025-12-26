import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData9999999999999 implements MigrationInterface {
  name = 'SeedData9999999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admin user (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'User', 'admin@hireflow.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'employee', NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO "employees" 
        ("id", "roles", "position", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440001', ARRAY['admin'], 'System Administrator', 
         '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
    `);

    // Candidate 1 user (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440002', 'Alice', 'Dev', 'alice.dev@example.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'candidate', NOW(), NOW())
    `);

    // Candidate 2 user (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440003', 'Bob', 'Dev', 'bob.dev@example.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'candidate', NOW(), NOW())
    `);

    // Candidate 1
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "age", "phone", "city", "country", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440004', 28, '123456789', 'Buenos Aires', 'Argentina', 'https://github.com/alice', 'https://linkedin.com/in/alice', 
         '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW())
    `);

    // Work experiences for Candidate 1 (Alice)
    await queryRunner.query(`
      INSERT INTO "work_experiences"
        ("id", "candidate_id", "company_name", "position", "start_date", "end_date", "description", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440004', 'Acme Corp', 'Junior Developer', '2020-01-01', '2021-06-30', 'Worked on internal tools with Node.js and React.', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440004', 'Globex', 'Full Stack Developer', '2021-07-01', NULL, 'Building customer-facing apps with TypeScript and PostgreSQL.', NOW(), NOW())
    `);

    // Candidate 2
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "age", "phone", "city", "country", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440005', 30, '987654321', 'Montevideo', 'Uruguay', 'https://github.com/bob', 'https://linkedin.com/in/bob', 
         '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW())
    `);

    // Work experiences for Candidate 2 (Bob)
    await queryRunner.query(`
      INSERT INTO "work_experiences"
        ("id", "candidate_id", "company_name", "position", "start_date", "end_date", "description", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440005', 'Initech', 'Backend Developer', '2019-03-01', '2022-02-28', 'Designed REST APIs and database schemas.', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440005', 'Hooli', 'Senior Backend Developer', '2022-03-01', NULL, 'Leading backend services with NestJS and Docker.', NOW(), NOW())
    `);

    // Job Offer 1
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440006', 'Desarrollador Full Stack', 'Remoto', 'full-remote', 'Buscamos un Full Stack Developer con experiencia en TypeScript.', '50000-70000', 'Seguro, vacaciones, capacitaciones', 'OPEN', false, NOW(), NOW(), '2026-03-01')
    `);

    // Job Offer 2
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440007', 'Desarrollador Backend', 'Remoto', 'full-remote', 'Se requiere Backend Developer con Node.js y PostgreSQL.', '45000-65000', 'Seguro dental, capacitaciones', 'OPEN', false, NOW(), NOW(), '2026-04-15')
    `);

    // Create unique skills
    await queryRunner.query(`
      INSERT INTO "job_offer_skills" 
        ("id", "skill_name", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440010', 'typescript', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440011', 'react', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440012', 'node.js', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440013', 'postgresql', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440014', 'docker', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440015', 'express.js', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440016', 'rest apis', NOW(), NOW())
    `);

    // Create relations between Job Offer 1 and its skills
    await queryRunner.query(`
      INSERT INTO "job_offer_skills_relation" 
        ("job_offer_id", "job_offer_skill_id")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010'),
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440011'),
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440012'),
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440013'),
        ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440014')
    `);

    // Create relations between Job Offer 2 and its skills
    await queryRunner.query(`
      INSERT INTO "job_offer_skills_relation" 
        ("job_offer_id", "job_offer_skill_id")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440012'),
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440013'),
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440015'),
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440010'),
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440016')
    `);

    // Candidate applications
    await queryRunner.query(`
      INSERT INTO "candidate_applications" 
        ("id", "job_offer_id", "candidate_id", "status", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'IN_PROGRESS', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'APPLIED', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'APPLIED', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'APPLIED', NOW(), NOW())
    `);

    // Candidate Skill Answers for Alice's applications
    // Alice's answers for Job Offer 1
    await queryRunner.query(`
      INSERT INTO "candidate_skill_answers" 
        ("id", "candidate_application_id", "job_offer_skill_id", "years_of_experience", "created_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440010', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440011', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440012', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440013', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440014', 1, NOW())
    `);

    // Alice's answers for Job Offer 2
    await queryRunner.query(`
      INSERT INTO "candidate_skill_answers" 
        ("id", "candidate_application_id", "job_offer_skill_id", "years_of_experience", "created_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440012', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440013', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440015', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440010', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440016', 4, NOW())
    `);

    // Bob's answers for Job Offer 1
    await queryRunner.query(`
      INSERT INTO "candidate_skill_answers" 
        ("id", "candidate_application_id", "job_offer_skill_id", "years_of_experience", "created_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440010', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440011', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440012', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440013', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440014', 2, NOW())
    `);

    // Bob's answers for Job Offer 2
    await queryRunner.query(`
      INSERT INTO "candidate_skill_answers" 
        ("id", "candidate_application_id", "job_offer_skill_id", "years_of_experience", "created_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440012', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440013', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440015', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440010', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440016', 3, NOW())
    `);

    // Create an interview for Alice (Application 1) with Admin as interviewer
    await queryRunner.query(`
      INSERT INTO "interviews"
        ("id", "type", "scheduled_time", "meeting_link", "status", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440050', 'INDIVIDUAL', '2025-12-05 10:00:00', 'https://meet.google.com/abc-defg-hij', 'COMPLETED', NOW(), NOW())
    `);

    // Link interview to application
    await queryRunner.query(`
      INSERT INTO "interview_applications"
        ("interview_id", "candidate_application_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440008')
    `);

    // Link interview to interviewer (Admin)
    await queryRunner.query(`
      INSERT INTO "employee_interviews"
        ("interview_id", "employee_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440001')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "work_experiences"`);
    await queryRunner.query(`DELETE FROM "interview_reviews"`);
    await queryRunner.query(`DELETE FROM "interviews"`);
    await queryRunner.query(`DELETE FROM "candidate_skill_answers"`);
    await queryRunner.query(`DELETE FROM "candidate_applications"`);
    await queryRunner.query(`DELETE FROM "job_offer_skills_relation"`);
    await queryRunner.query(`DELETE FROM "job_offer_skills"`);
    await queryRunner.query(`DELETE FROM "job_offers"`);
    await queryRunner.query(`DELETE FROM "user_files"`);
    await queryRunner.query(`DELETE FROM "employees"`);
    await queryRunner.query(`DELETE FROM "educations"`);
    await queryRunner.query(`DELETE FROM "candidates"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}
