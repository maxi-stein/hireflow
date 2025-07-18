import { Module } from '@nestjs/common';
import { UsersService } from './base-user/user.service';
import { UsersController } from './base-user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Employee, Candidate, Education } from './entities';
import { GuardsModule } from '../auth/guards/guards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee, Candidate, Education]),
    GuardsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
