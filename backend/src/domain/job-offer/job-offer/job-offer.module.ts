import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOfferService } from './job-offer.service';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferController } from './job-offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer])],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService],
})
export class JobOfferModule {}
