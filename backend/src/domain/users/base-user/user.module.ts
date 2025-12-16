import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/domain/auth/guards/guards.module';
import { User} from '../entities';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GuardsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
