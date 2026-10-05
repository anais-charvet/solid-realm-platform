import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1791226468453 implements MigrationInterface {
    name = 'InitialSchema1791226468453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "role" character varying NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."asset_type_enum" AS ENUM('AUDIO', 'VIDEO')`);
        await queryRunner.query(`CREATE TYPE "public"."asset_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."asset_type_enum" NOT NULL, "title" character varying NOT NULL, "status" "public"."asset_status_enum" NOT NULL DEFAULT 'DRAFT', "artist" character varying, "price" numeric(10,2), "genre" text array, "style" text array, "label" character varying, "description" text, "technicalSpecs" jsonb, "creatorId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "publishedAt" TIMESTAMP, "fileUrl" text, "fileKey" text, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_b5f6f034d04b77cae7366ac9dc8" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_b5f6f034d04b77cae7366ac9dc8"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TYPE "public"."asset_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."asset_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
