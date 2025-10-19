import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760306216984 implements MigrationInterface {
    name = 'InitialMigration1760306216984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_files_file_type_enum" AS ENUM('profile_picture', 'cv')`);
        await queryRunner.query(`CREATE TABLE "user_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_name" character varying(256) NOT NULL, "stored_name" character varying(256) NOT NULL, "file_path" character varying(512) NOT NULL, "mime_type" character varying(64) NOT NULL, "size" integer NOT NULL, "file_type" "public"."user_files_file_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_a62f81d2afadf20a024e11b43bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_files" ADD CONSTRAINT "FK_c53cb02ee2a726a1e47ff1854c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_files" DROP CONSTRAINT "FK_c53cb02ee2a726a1e47ff1854c9"`);
        await queryRunner.query(`DROP TABLE "user_files"`);
        await queryRunner.query(`DROP TYPE "public"."user_files_file_type_enum"`);
    }

}
