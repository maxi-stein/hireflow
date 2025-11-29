import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1764447114992 implements MigrationInterface {
    name = 'InitialMigration1764447114992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."educations_degree_type_enum" AS ENUM('Licenciatura', 'Maestría', 'Doctorado', 'Técnico Superior', 'Diploma', 'Certificación', 'Otro')`);
        await queryRunner.query(`CREATE TABLE "educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "institution" character varying NOT NULL, "degree_type" "public"."educations_degree_type_enum" NOT NULL, "field_of_study" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "candidateId" uuid, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."interview_reviews_status_enum" AS ENUM('PASS', 'FAIL', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "interview_reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "interview_id" uuid NOT NULL, "employee_id" uuid NOT NULL, "candidate_application_id" uuid NOT NULL, "status" "public"."interview_reviews_status_enum" NOT NULL DEFAULT 'PENDING', "notes" text, "score" integer, "strengths" text, "weaknesses" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6863005a77a547ca0bc3bccac51" UNIQUE ("interview_id", "employee_id", "candidate_application_id"), CONSTRAINT "PK_ee02b5ce68187a87e581e49e795" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."interviews_type_enum" AS ENUM('individual', 'group')`);
        await queryRunner.query(`CREATE TYPE "public"."interviews_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'rescheduled')`);
        await queryRunner.query(`CREATE TABLE "interviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."interviews_type_enum" NOT NULL, "scheduled_time" TIMESTAMP NOT NULL, "meeting_link" character varying(500), "status" "public"."interviews_status_enum" NOT NULL DEFAULT 'scheduled', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fd41af1f96d698fa33c2f070f47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roles" character varying(32) array NOT NULL, "position" character varying(100) NOT NULL, "profile_created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."job_offers_work_mode_enum" AS ENUM('hybrid', 'full-remote', 'office')`);
        await queryRunner.query(`CREATE TYPE "public"."job_offers_status_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "job_offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying NOT NULL, "location" character varying NOT NULL, "work_mode" "public"."job_offers_work_mode_enum" NOT NULL, "description" text NOT NULL, "salary" character varying, "benefits" text, "status" "public"."job_offers_status_enum" NOT NULL DEFAULT 'OPEN', "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9a54d36bd6829979f945defdeb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_offer_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "skill_name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_6f1e7fee2dd62f4cf0079de8adf" UNIQUE ("skill_name"), CONSTRAINT "PK_a20236946968bdcb25c71a5f845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate_skill_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "candidate_application_id" uuid NOT NULL, "job_offer_skill_id" uuid NOT NULL, "years_of_experience" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89c9d1c7267842102517def1b88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."candidate_applications_status_enum" AS ENUM('IN_PROGRESS', 'REJECTED', 'ACCEPTED')`);
        await queryRunner.query(`CREATE TABLE "candidate_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "job_offer_id" uuid NOT NULL, "candidate_id" uuid NOT NULL, "status" "public"."candidate_applications_status_enum" NOT NULL DEFAULT 'IN_PROGRESS', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e4b31ec51c8cd938b97fd653e20" UNIQUE ("job_offer_id", "candidate_id"), CONSTRAINT "PK_28ab47cd1defe47ecf047c7c1a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "candidate_id" uuid NOT NULL, "company_name" character varying(200) NOT NULL, "position" character varying(100) NOT NULL, "start_date" date NOT NULL, "end_date" date, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3189db15aaccc2861851ea3da17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_files_file_type_enum" AS ENUM('profile_picture', 'cv')`);
        await queryRunner.query(`CREATE TABLE "user_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_name" character varying(256) NOT NULL, "stored_name" character varying(256) NOT NULL, "file_path" character varying(512) NOT NULL, "mime_type" character varying(64) NOT NULL, "size" integer NOT NULL, "file_type" "public"."user_files_file_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "candidateId" uuid, CONSTRAINT "PK_a62f81d2afadf20a024e11b43bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer, "phone" character varying(20), "github" character varying(2048), "linkedin" character varying(2048), "profile_created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_94a5fe85e7f5bd0221fa7d6f19" UNIQUE ("user_id"), CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(254) NOT NULL, "password" character varying(128) NOT NULL, "user_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interview_applications" ("interview_id" uuid NOT NULL, "candidate_application_id" uuid NOT NULL, CONSTRAINT "PK_579637c747906aafe6ea4be96a3" PRIMARY KEY ("interview_id", "candidate_application_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b5e5fc36393a409f7d30b50776" ON "interview_applications" ("interview_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fa5a1221ef11e0f90e84b44a0a" ON "interview_applications" ("candidate_application_id") `);
        await queryRunner.query(`CREATE TABLE "employee_interviews" ("interview_id" uuid NOT NULL, "employee_id" uuid NOT NULL, CONSTRAINT "PK_99f1d4fb2eecd7309b41b70de5d" PRIMARY KEY ("interview_id", "employee_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3fc25fb2eb3634de44d748baa6" ON "employee_interviews" ("interview_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c72421c15cbb3372b83141131" ON "employee_interviews" ("employee_id") `);
        await queryRunner.query(`CREATE TABLE "job_offer_skills_relation" ("job_offer_id" uuid NOT NULL, "job_offer_skill_id" uuid NOT NULL, CONSTRAINT "PK_0f80305c1624adfd92d89aefbc4" PRIMARY KEY ("job_offer_id", "job_offer_skill_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4b794aa164984f85804cbfe82a" ON "job_offer_skills_relation" ("job_offer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_430957ea4cb5ce806573a4b25d" ON "job_offer_skills_relation" ("job_offer_skill_id") `);
        await queryRunner.query(`ALTER TABLE "educations" ADD CONSTRAINT "FK_da1ce5966e5d5a43a9e0797e0c0" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_reviews" ADD CONSTRAINT "FK_5d298ea0d28cd25d2902b55d466" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_reviews" ADD CONSTRAINT "FK_ca64b602ef1a2af26daa8f2dce7" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_reviews" ADD CONSTRAINT "FK_1c456814d73b647fd72a4b5dd2d" FOREIGN KEY ("candidate_application_id") REFERENCES "candidate_applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_answers" ADD CONSTRAINT "FK_1bc6a9aa906827ae1d2ed725806" FOREIGN KEY ("candidate_application_id") REFERENCES "candidate_applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_answers" ADD CONSTRAINT "FK_7860d63b87f18350ca00bbde568" FOREIGN KEY ("job_offer_skill_id") REFERENCES "job_offer_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_applications" ADD CONSTRAINT "FK_ff0876d3b1ebb843cba7d8665ca" FOREIGN KEY ("job_offer_id") REFERENCES "job_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_applications" ADD CONSTRAINT "FK_bdc76c70bcfed3f7c3be7d826f0" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_experiences" ADD CONSTRAINT "FK_209384ea01bce5b6256fa544ff2" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_files" ADD CONSTRAINT "FK_6c1813251727e62fdaa146c403c" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_94a5fe85e7f5bd0221fa7d6f19c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_applications" ADD CONSTRAINT "FK_b5e5fc36393a409f7d30b50776f" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "interview_applications" ADD CONSTRAINT "FK_fa5a1221ef11e0f90e84b44a0a9" FOREIGN KEY ("candidate_application_id") REFERENCES "candidate_applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_interviews" ADD CONSTRAINT "FK_3fc25fb2eb3634de44d748baa6b" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_interviews" ADD CONSTRAINT "FK_4c72421c15cbb3372b831411319" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_offer_skills_relation" ADD CONSTRAINT "FK_4b794aa164984f85804cbfe82a7" FOREIGN KEY ("job_offer_id") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "job_offer_skills_relation" ADD CONSTRAINT "FK_430957ea4cb5ce806573a4b25d1" FOREIGN KEY ("job_offer_skill_id") REFERENCES "job_offer_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_offer_skills_relation" DROP CONSTRAINT "FK_430957ea4cb5ce806573a4b25d1"`);
        await queryRunner.query(`ALTER TABLE "job_offer_skills_relation" DROP CONSTRAINT "FK_4b794aa164984f85804cbfe82a7"`);
        await queryRunner.query(`ALTER TABLE "employee_interviews" DROP CONSTRAINT "FK_4c72421c15cbb3372b831411319"`);
        await queryRunner.query(`ALTER TABLE "employee_interviews" DROP CONSTRAINT "FK_3fc25fb2eb3634de44d748baa6b"`);
        await queryRunner.query(`ALTER TABLE "interview_applications" DROP CONSTRAINT "FK_fa5a1221ef11e0f90e84b44a0a9"`);
        await queryRunner.query(`ALTER TABLE "interview_applications" DROP CONSTRAINT "FK_b5e5fc36393a409f7d30b50776f"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_94a5fe85e7f5bd0221fa7d6f19c"`);
        await queryRunner.query(`ALTER TABLE "user_files" DROP CONSTRAINT "FK_6c1813251727e62fdaa146c403c"`);
        await queryRunner.query(`ALTER TABLE "work_experiences" DROP CONSTRAINT "FK_209384ea01bce5b6256fa544ff2"`);
        await queryRunner.query(`ALTER TABLE "candidate_applications" DROP CONSTRAINT "FK_bdc76c70bcfed3f7c3be7d826f0"`);
        await queryRunner.query(`ALTER TABLE "candidate_applications" DROP CONSTRAINT "FK_ff0876d3b1ebb843cba7d8665ca"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_answers" DROP CONSTRAINT "FK_7860d63b87f18350ca00bbde568"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_answers" DROP CONSTRAINT "FK_1bc6a9aa906827ae1d2ed725806"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`ALTER TABLE "interview_reviews" DROP CONSTRAINT "FK_1c456814d73b647fd72a4b5dd2d"`);
        await queryRunner.query(`ALTER TABLE "interview_reviews" DROP CONSTRAINT "FK_ca64b602ef1a2af26daa8f2dce7"`);
        await queryRunner.query(`ALTER TABLE "interview_reviews" DROP CONSTRAINT "FK_5d298ea0d28cd25d2902b55d466"`);
        await queryRunner.query(`ALTER TABLE "educations" DROP CONSTRAINT "FK_da1ce5966e5d5a43a9e0797e0c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_430957ea4cb5ce806573a4b25d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b794aa164984f85804cbfe82a"`);
        await queryRunner.query(`DROP TABLE "job_offer_skills_relation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c72421c15cbb3372b83141131"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3fc25fb2eb3634de44d748baa6"`);
        await queryRunner.query(`DROP TABLE "employee_interviews"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa5a1221ef11e0f90e84b44a0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5e5fc36393a409f7d30b50776"`);
        await queryRunner.query(`DROP TABLE "interview_applications"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "candidates"`);
        await queryRunner.query(`DROP TABLE "user_files"`);
        await queryRunner.query(`DROP TYPE "public"."user_files_file_type_enum"`);
        await queryRunner.query(`DROP TABLE "work_experiences"`);
        await queryRunner.query(`DROP TABLE "candidate_applications"`);
        await queryRunner.query(`DROP TYPE "public"."candidate_applications_status_enum"`);
        await queryRunner.query(`DROP TABLE "candidate_skill_answers"`);
        await queryRunner.query(`DROP TABLE "job_offer_skills"`);
        await queryRunner.query(`DROP TABLE "job_offers"`);
        await queryRunner.query(`DROP TYPE "public"."job_offers_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_offers_work_mode_enum"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "interviews"`);
        await queryRunner.query(`DROP TYPE "public"."interviews_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."interviews_type_enum"`);
        await queryRunner.query(`DROP TABLE "interview_reviews"`);
        await queryRunner.query(`DROP TYPE "public"."interview_reviews_status_enum"`);
        await queryRunner.query(`DROP TABLE "educations"`);
        await queryRunner.query(`DROP TYPE "public"."educations_degree_type_enum"`);
    }

}
