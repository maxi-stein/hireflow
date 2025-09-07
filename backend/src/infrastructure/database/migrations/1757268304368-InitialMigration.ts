import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1757268304368 implements MigrationInterface {
    name = 'InitialMigration1757268304368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."educations_degree_type_enum" AS ENUM('Licenciatura', 'Maestría', 'Doctorado', 'Técnico Superior', 'Diploma', 'Certificación', 'Otro')`);
        await queryRunner.query(`CREATE TABLE "educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "institution" character varying NOT NULL, "degree_type" "public"."educations_degree_type_enum" NOT NULL, "field_of_study" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "candidateId" uuid, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer, "phone" character varying(20), "resume_url" character varying(2048), "portfolio_url" character varying(2048), "github" character varying(2048), "linkedin" character varying(2048), "profile_created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_94a5fe85e7f5bd0221fa7d6f19" UNIQUE ("user_id"), CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employees_role_enum" AS ENUM('hr', 'manager')`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."employees_role_enum" NOT NULL, "position" character varying(100) NOT NULL, "profile_created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(254) NOT NULL, "password" character varying(60) NOT NULL, "user_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."job_offers_work_mode_enum" AS ENUM('hybrid', 'full-remote', 'office')`);
        await queryRunner.query(`CREATE TYPE "public"."job_offers_status_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "job_offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying NOT NULL, "location" character varying NOT NULL, "work_mode" "public"."job_offers_work_mode_enum" NOT NULL, "description" text NOT NULL, "salary" character varying, "benefits" text, "status" "public"."job_offers_status_enum" NOT NULL DEFAULT 'OPEN', "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9a54d36bd6829979f945defdeb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "educations" ADD CONSTRAINT "FK_da1ce5966e5d5a43a9e0797e0c0" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_94a5fe85e7f5bd0221fa7d6f19c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_94a5fe85e7f5bd0221fa7d6f19c"`);
        await queryRunner.query(`ALTER TABLE "educations" DROP CONSTRAINT "FK_da1ce5966e5d5a43a9e0797e0c0"`);
        await queryRunner.query(`DROP TABLE "job_offers"`);
        await queryRunner.query(`DROP TYPE "public"."job_offers_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_offers_work_mode_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TYPE "public"."employees_role_enum"`);
        await queryRunner.query(`DROP TABLE "candidates"`);
        await queryRunner.query(`DROP TABLE "educations"`);
        await queryRunner.query(`DROP TYPE "public"."educations_degree_type_enum"`);
    }

}
