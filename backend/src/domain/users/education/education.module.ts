import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationsController } from './education.controller';
import { EducationService } from './education.service';
import { Education } from '../entities/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  controllers: [EducationsController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
