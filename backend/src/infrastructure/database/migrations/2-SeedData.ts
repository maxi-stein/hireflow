import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData9999999999999 implements MigrationInterface {
  name = 'SeedData9999999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert admin user
    await queryRunner.query(
      `INSERT INTO "users" ("id", "first_name", "last_name", "email", "password", "user_type") VALUES
      ('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'User', 'admin@hireflow.com', '$2a$10$jiAFi1FhyXfpfAojltsQ8u1p8akSuXkT2ZIxW3ovcQ75bqnekQ5/2', 'employee')`,
    );
    await queryRunner.query(
      `INSERT INTO "employees" ("id", "role", "position", "user_id") VALUES
      ('550e8400-e29b-41d4-a716-446655440001', 'hr', 'System Administrator', '550e8400-e29b-41d4-a716-446655440000')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Clean all tables (this removes all data)
    await queryRunner.query(`DELETE FROM "employees"`);
    await queryRunner.query(`DELETE FROM "candidates"`);
    await queryRunner.query(`DELETE FROM "educations"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}
