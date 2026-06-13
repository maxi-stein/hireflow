import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCandidateCityCountryNullable1781308827079 implements MigrationInterface {
    name = 'MakeCandidateCityCountryNullable1781308827079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "country" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "city" SET NOT NULL`);
    }

}
