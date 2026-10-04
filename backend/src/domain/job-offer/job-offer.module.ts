import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { JobOfferSkillsModule } from '../job-offer-skills/job-offer-skills.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOffer]),
    JobOfferSkillsModule,
  ],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService, JobOfferSkillsModule],
})
export class JobOfferModule {}
