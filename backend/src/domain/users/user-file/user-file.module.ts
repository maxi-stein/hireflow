// work-experience.module.ts
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFile } from '../entities/user-files.entity';
import { FileController } from './user-file.controller';
import { FileStorageService } from './user-file.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserFile])],
  controllers: [FileController],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class UserFileModule {}
