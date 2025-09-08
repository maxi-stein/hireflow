import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData9999999999999 implements MigrationInterface {
  name = 'SeedData9999999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admin user
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'User', 'admin@hireflow.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'employee', NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO "employees" 
        ("id", "role", "position", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440001', 'hr', 'System Administrator', 
         '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
    `);

    // Candidate 1 user
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440002', 'Alice', 'Dev', 'alice.dev@example.com', 
         '$2a$10$dummyhashalice', 'candidate', NOW(), NOW())
    `);

    // Candidate 2 user
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440003', 'Bob', 'Dev', 'bob.dev@example.com', 
         '$2a$10$dummyhashbob', 'candidate', NOW(), NOW())
    `);

    // Candidate 1
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "age", "phone", "resume_url", "portfolio_url", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440004', 28, '123456789', NULL, NULL, 'https://github.com/alice', 'https://linkedin.com/in/alice', 
         '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW())
    `);

    // Candidate 2
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "age", "phone", "resume_url", "portfolio_url", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440005', 30, '987654321', NULL, NULL, 'https://github.com/bob', 'https://linkedin.com/in/bob', 
         '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW())
    `);

    // Job Offer 1
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440006', 'Desarrollador Full Stack', 'Remoto', 'full-remote', 'Buscamos un Full Stack Developer con experiencia en TypeScript.', '50000-70000', 'Seguro, vacaciones, capacitaciones', 'OPEN', false, NOW(), NOW())
    `);

    // Job Offer 2
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440007', 'Desarrollador Backend', 'Remoto', 'full-remote', 'Se requiere Backend Developer con Node.js y PostgreSQL.', '45000-65000', 'Seguro dental, capacitaciones', 'OPEN', false, NOW(), NOW())
    `);

    // Candidate applications
    await queryRunner.query(`
      INSERT INTO "candidate_applications" 
        ("id", "job_offer_id", "candidate_id", "status", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'IN_PROGRESS', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'IN_PROGRESS', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'IN_PROGRESS', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'IN_PROGRESS', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM candidate_applications`);
    await queryRunner.query(`DELETE FROM "job_offers"`);
    await queryRunner.query(`DELETE FROM "employees"`);
    await queryRunner.query(`DELETE FROM "educations"`);
    await queryRunner.query(`DELETE FROM "candidates"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}
