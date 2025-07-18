import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationsController } from './educations/educations.controller';
import { EducationsService } from './educations/education.service';
import { Education } from './entities/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  controllers: [EducationsController],
  providers: [EducationsService],
  exports: [EducationsService],
})
export class EducationModule {}
