import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1754261069000 implements MigrationInterface {
    name = 'InitialMigration1754261069000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "age" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "resume_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "portfolio_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "portfolio_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "resume_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidates" ALTER COLUMN "age" SET NOT NULL`);
    }

}
