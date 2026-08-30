import { MigrationInterface, QueryRunner } from 'typeorm';

/*
 * List of Important IDs for relationships
 *
 * --- Users & Employees ---
 * Admin (admin@hireflow.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440000
 *   Employee ID: 550e8400-e29b-41d4-a716-446655440001
 * HR1 (hr1@hireflow.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440080
 *   Employee ID: 550e8400-e29b-41d4-a716-446655440081
 * HR2 (hr2@hireflow.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440082
 *   Employee ID: 550e8400-e29b-41d4-a716-446655440083
 * Manager (manager@hireflow.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440084
 *   Employee ID: 550e8400-e29b-41d4-a716-446655440085
 *
 * --- Users & Candidates ---
 * Candidate1: Alice Dev (alice.dev@example.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440002
 *   Candidate ID: 550e8400-e29b-41d4-a716-446655440004
 * Candidate2: Bob Dev (bob.dev@example.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440003
 *   Candidate ID: 550e8400-e29b-41d4-a716-446655440005
 * Candidate3: Charlie Dev (charlie.dev@example.com / Password1)
 *   User ID: 550e8400-e29b-41d4-a716-446655440090
 *   Candidate ID: 550e8400-e29b-41d4-a716-446655440091
 *
 * --- Job Offers ---
 * Job Offer 1 (Desarrollador Full Stack): 550e8400-e29b-41d4-a716-446655440006
 * Job Offer 2 (Desarrollador Backend): 550e8400-e29b-41d4-a716-446655440007
 * Job Offer 3 (Frontend Developer React): 550e8400-e29b-41d4-a716-446655440098
 * Job Offer 4 (DevOps Engineer): 550e8400-e29b-41d4-a716-446655440099
 * Job Offer 5 (QA Automation Engineer): 550e8400-e29b-41d4-a716-446655440100
 */

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

    // HR User 1 (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440080', 'John', 'Doe', 'hr1@hireflow.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'employee', NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO "employees" 
        ("id", "roles", "position", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440081', ARRAY['hr'], 'HR Specialist', 
         '550e8400-e29b-41d4-a716-446655440080', NOW(), NOW())
    `);

    // HR User 2 (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440082', 'Jane', 'Smith', 'hr2@hireflow.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'employee', NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO "employees" 
        ("id", "roles", "position", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440083', ARRAY['hr'], 'Talent Acquisition Specialist', 
         '550e8400-e29b-41d4-a716-446655440082', NOW(), NOW())
    `);

    // Manager User (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440084', 'Robert', 'Johnson', 'manager@hireflow.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'employee', NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO "employees" 
        ("id", "roles", "position", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440085', ARRAY['manager'], 'Engineering Manager', 
         '550e8400-e29b-41d4-a716-446655440084', NOW(), NOW())
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

    // Candidate 3 user (pass = Password1)
    await queryRunner.query(`
      INSERT INTO "users" 
        ("id", "first_name", "last_name", "email", "password", "user_type", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440090', 'Charlie', 'Dev', 'charlie.dev@example.com', 
         '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'candidate', NOW(), NOW())
    `);

    // Candidate 1
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "headline", "date_of_birth", "phone", "city", "country", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440004', 'Full Stack Developer', '1996-05-15', '123456789', 'Buenos Aires', 'Argentina', 'https://github.com/alice', 'https://linkedin.com/in/alice', 
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

    // Educations for Candidate 1 (Alice)
    await queryRunner.query(`
      INSERT INTO "educations"
        ("id", "candidateId", "institution", "degree_type", "field_of_study", "start_date", "end_date", "description", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440004', 'MIT', 'Licenciatura', 'Computer Science', '2014-09-01', '2018-06-01', 'Graduated with honors.', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440004', 'Stanford', 'Maestría', 'Software Engineering', '2018-09-01', '2020-06-01', 'Focused on distributed systems.', NOW(), NOW())
    `);

    // Candidate 2
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "headline", "date_of_birth", "phone", "city", "country", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440005', 'Senior Backend Developer', '1994-08-22', '987654321', 'Montevideo', 'Uruguay', 'https://github.com/bob', 'https://linkedin.com/in/bob', 
         '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW())
    `);

    // Candidate 3
    await queryRunner.query(`
      INSERT INTO "candidates" 
        ("id", "headline", "date_of_birth", "phone", "city", "country", "github", "linkedin", "user_id", "profile_created_at", "profile_updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440091', 'Junior Frontend Developer', '1999-11-03', '555123456', 'Santiago', 'Chile', 'https://github.com/charlie', 'https://linkedin.com/in/charlie', 
         '550e8400-e29b-41d4-a716-446655440090', NOW(), NOW())
    `);

    // Work experiences for Candidate 2 (Bob)
    await queryRunner.query(`
      INSERT INTO "work_experiences"
        ("id", "candidate_id", "company_name", "position", "start_date", "end_date", "description", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440005', 'Initech', 'Backend Developer', '2019-03-01', '2022-02-28', 'Designed REST APIs and database schemas.', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440005', 'Hooli', 'Senior Backend Developer', '2022-03-01', NULL, 'Leading backend services with NestJS and Docker.', NOW(), NOW())
    `);

    // Educations for Candidate 2 (Bob)
    await queryRunner.query(`
      INSERT INTO "educations"
        ("id", "candidateId", "institution", "degree_type", "field_of_study", "start_date", "end_date", "description", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440005', 'UBA', 'Licenciatura', 'Computer Science', '2012-03-01', '2017-12-01', 'Focus on Algorithms.', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440005', 'Coursera', 'Certificación', 'Cloud Computing', '2023-01-01', '2023-06-01', 'Intensive course on AWS.', NOW(), NOW())
    `);

    // Job Offer 1
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440006', 'Desarrollador Full Stack', 'Remoto', 'remote', 'Estamos buscando un Desarrollador Full Stack con sólida experiencia en TypeScript, React y Node.js para participar en el desarrollo de aplicaciones web modernas de alto impacto. La persona seleccionada trabajará en todo el ciclo de vida del producto, desde el diseño y desarrollo de nuevas funcionalidades hasta la optimización de rendimiento, escalabilidad y experiencia de usuario. Valoramos perfiles con mentalidad colaborativa, orientación a resultados y pasión por construir soluciones tecnológicas de calidad.', '50000-70000', 'Cobertura médica integral, modalidad 100% remota, horario flexible, presupuesto anual para capacitaciones y certificaciones, equipamiento para home office, días adicionales de vacaciones, programas de bienestar y oportunidades de crecimiento profesional.', 'OPEN', false, NOW(), NOW(), '2026-03-01')
    `);

    // Job Offer 2
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440007', 'Desarrollador Backend', 'Remoto', 'remote', 'Buscamos un Desarrollador Backend con experiencia en Node.js, TypeScript y PostgreSQL para diseñar, desarrollar y mantener APIs y servicios escalables. Formará parte de un equipo ágil enfocado en arquitectura de software, buenas prácticas de desarrollo y mejora continua. Será responsable de construir soluciones robustas, optimizar procesos y colaborar con equipos multidisciplinarios para garantizar productos de alta calidad.', '45000-65000', 'Seguro médico y dental, trabajo remoto, horario flexible, capacitaciones técnicas continuas, acceso a certificaciones profesionales, bono por desempeño, licencia extendida y plan de desarrollo de carrera.', 'OPEN', false, NOW(), NOW(), '2026-04-15')
    `);

    // Job Offer 3
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440098', 'Frontend Developer React', 'Remoto', 'remote',
        'Buscamos un Frontend Developer con experiencia en React, TypeScript y desarrollo de interfaces modernas enfocadas en experiencia de usuario.',
        '45000-65000',
        'Seguro médico, horario flexible, capacitaciones, presupuesto para home office',
        'OPEN', false, NOW(), NOW(), '2026-05-30')
    `);

    // Job Offer 4
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440099', 'DevOps Engineer', 'Remoto', 'remote',
        'Estamos buscando un DevOps Engineer para diseñar, automatizar y mantener pipelines de CI/CD e infraestructura cloud escalable.',
        '60000-85000',
        'Seguro premium, capacitaciones, certificaciones cloud, días extra de vacaciones',
        'OPEN', false, NOW(), NOW(), '2026-06-15')
    `);

    // Job Offer 5
    await queryRunner.query(`
      INSERT INTO "job_offers"
        ("id", "position", "location", "work_mode", "description", "salary", "benefits", "status", "deleted", "created_at", "updated_at", "deadline")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440100', 'QA Automation Engineer', 'Híbrido', 'hybrid',
        'Buscamos un QA Automation Engineer con experiencia en automatización de pruebas, integración continua y aseguramiento de calidad de aplicaciones web.',
        '50000-70000',
        'Cobertura médica, capacitaciones técnicas, horario flexible y bonos por desempeño',
        'OPEN', false, NOW(), NOW(), '2026-07-01')
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
        ('550e8400-e29b-41d4-a716-446655440016', 'rest apis', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440101', 'javascript', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440102', 'aws', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440103', 'kubernetes', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440104', 'ci/cd', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440105', 'testing', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440106', 'cypress', NOW(), NOW())
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

    // Create relations between Job Offer 3,4 and 5 and skills
    await queryRunner.query(`
      INSERT INTO "job_offer_skills_relation"
        ("job_offer_id", "job_offer_skill_id")
      VALUES
        -- Frontend Developer React
        ('550e8400-e29b-41d4-a716-446655440098', '550e8400-e29b-41d4-a716-446655440010'),
        ('550e8400-e29b-41d4-a716-446655440098', '550e8400-e29b-41d4-a716-446655440011'),
        ('550e8400-e29b-41d4-a716-446655440098', '550e8400-e29b-41d4-a716-446655440101'),

        -- DevOps Engineer
        ('550e8400-e29b-41d4-a716-446655440099', '550e8400-e29b-41d4-a716-446655440014'),
        ('550e8400-e29b-41d4-a716-446655440099', '550e8400-e29b-41d4-a716-446655440102'),
        ('550e8400-e29b-41d4-a716-446655440099', '550e8400-e29b-41d4-a716-446655440103'),
        ('550e8400-e29b-41d4-a716-446655440099', '550e8400-e29b-41d4-a716-446655440104'),

        -- QA Automation Engineer
        ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440105'),
        ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440106'),
        ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440010')
        `);

    // Profile Pictures for Alice and Bob
    await queryRunner.query(`
      INSERT INTO "user_files" 
        ("id", "file_name", "stored_name", "file_path", "mime_type", "size", "file_type", "candidate_id", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-44665544001a', '550e8400-e29b-41d4-a716-446655440004.jpg', '550e8400-e29b-41d4-a716-446655440004.jpg', 'uploads/profile_pictures/550e8400-e29b-41d4-a716-446655440004.jpg', 'image/jpeg', 29728, 'profile_picture', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544001c', '550e8400-e29b-41d4-a716-446655440005.jpg', '550e8400-e29b-41d4-a716-446655440005.jpg', 'uploads/profile_pictures/550e8400-e29b-41d4-a716-446655440005.jpg', 'image/jpeg', 42405, 'profile_picture', '550e8400-e29b-41d4-a716-446655440005', NOW(), NOW())
    `);

    // Candidate applications
    await queryRunner.query(`
      INSERT INTO "candidate_applications" 
        ("id", "job_offer_id", "candidate_id", "status", "created_at", "updated_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'IN_PROGRESS', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'APPLIED', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'APPLIED', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'APPLIED', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440091', 'APPLIED', NOW(), NOW())
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

    // Charlie's answers for Job Offer 1 (Full Stack)
    await queryRunner.query(`
      INSERT INTO "candidate_skill_answers" 
        ("id", "candidate_application_id", "job_offer_skill_id", "years_of_experience", "created_at")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440010', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440094', '550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440011', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440095', '550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440012', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440096', '550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440013', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440097', '550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440014', 1, NOW())
    `);

    // Create an interview for Alice (Application 1)
    await queryRunner.query(`
      INSERT INTO "interviews"
        ("id", "title", "type", "scheduled_time", "meeting_link", "status", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440050', 'Entrevista Inicial', 'INDIVIDUAL', '2025-12-05 10:00:00', 'https://meet.google.com/abc-defg-hij', 'COMPLETED', NOW(), NOW())
    `);

    // Link interview to application
    await queryRunner.query(`
      INSERT INTO "interview_applications"
        ("interview_id", "candidate_application_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440008')
    `);

    // Link interview to interviewers
    await queryRunner.query(`
      INSERT INTO "employee_interviews"
        ("interview_id", "employee_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440083'),
        ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440081')
    `);

    // Second interview for Alice
    await queryRunner.query(`
      INSERT INTO "interviews"
        ("id", "title", "type", "scheduled_time", "meeting_link", "status", "created_at", "updated_at")
      VALUES
        (
          '550e8400-e29b-41d4-a716-446655440110',
          'Entrevista Técnica',
          'GROUP',
          '2026-09-10 14:00:00',
          'https://meet.google.com/tech-alice-2026',
          'SCHEDULED',
          NOW(),
          NOW()
        )
    `);

    // Link second interview to Alice's application
    await queryRunner.query(`
      INSERT INTO "interview_applications"
        ("interview_id", "candidate_application_id")
      VALUES
        (
          '550e8400-e29b-41d4-a716-446655440110',
          '550e8400-e29b-41d4-a716-446655440008'
        )
    `);

    // Link second interview to 3 interviewers
    await queryRunner.query(`
      INSERT INTO "employee_interviews"
        ("interview_id", "employee_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440083'),
        ('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440081'),
        ('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440085')
    `);

    // Reviews for Alice's Initial Interview
    await queryRunner.query(`
      INSERT INTO "interview_reviews"
        ("id", "interview_id", "employee_id", "candidate_application_id", "notes", "score", "strengths", "weaknesses", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440008', 'Gran capacidad de comunicación y sólidos conocimientos en React.', 4, 'Comunicación,React,Trabajo en equipo', 'Falta de experiencia en testing', NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440008', 'Muy buena actitud, aunque le falta un poco de experiencia en backend.', 3, 'Proactividad', 'Backend,Node.js', NOW(), NOW())
    `);
    // --- BOB DEV'S INTERVIEW ---
    await queryRunner.query(`
      INSERT INTO "interviews"
        ("id", "title", "type", "scheduled_time", "meeting_link", "status", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440300', 'Entrevista Inicial', 'INDIVIDUAL', '2025-12-06 10:00:00', 'https://meet.google.com/abc-defg-hij', 'COMPLETED', NOW(), NOW())
    `);
    await queryRunner.query(`
      INSERT INTO "interview_applications"
        ("interview_id", "candidate_application_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-44665544000a')
    `);
    await queryRunner.query(`
      INSERT INTO "employee_interviews"
        ("interview_id", "employee_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440083'),
        ('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440081')
    `);
    await queryRunner.query(`
      INSERT INTO "interview_reviews"
        ("id", "interview_id", "employee_id", "candidate_application_id", "notes", "score", "strengths", "weaknesses", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-44665544000a', 'Buen candidato, conocimientos acordes.', 3, 'Backend', 'Testing', NOW(), NOW())
    `);

    // --- CHARLIE DEV'S INTERVIEW ---
    await queryRunner.query(`
      INSERT INTO "interviews"
        ("id", "title", "type", "scheduled_time", "meeting_link", "status", "created_at", "updated_at")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440301', 'Entrevista Inicial', 'INDIVIDUAL', '2025-12-07 10:00:00', 'https://meet.google.com/abc-defg-hij', 'COMPLETED', NOW(), NOW())
    `);
    await queryRunner.query(`
      INSERT INTO "interview_applications"
        ("interview_id", "candidate_application_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440092')
    `);
    await queryRunner.query(`
      INSERT INTO "employee_interviews"
        ("interview_id", "employee_id")
      VALUES
        ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440083'),
        ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440081')
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
