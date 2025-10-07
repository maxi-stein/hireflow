// work-experience.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperience } from '../entities/work-experience.entity';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperienceService } from './work-experience.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperience])],
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService],
  exports: [WorkExperienceService],
})
export class WorkExperienceModule {}
