import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1779476366343 implements MigrationInterface {
    name = 'InitialMigration1779476366343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "hashed_refresh_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hashed_refresh_token"`);
    }

}
