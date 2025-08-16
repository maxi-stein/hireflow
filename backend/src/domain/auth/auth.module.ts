import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { getAuthConfig } from './helper';
import { UsersService } from '../users/base-user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { GuardsModule } from './guards/guards.module';
import { UsersModule } from '../users/base-user/user.module';
import { CandidatesModule } from '../users/candidate/candidate.module';
import { EmployeesModule } from '../users/employee/employee.module';

@Module({
  imports: [
    UsersModule,
    EmployeesModule,
    CandidatesModule,
    PassportModule,
    GuardsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { secret, expiresIn } = getAuthConfig(configService);
        return {
          secret: secret,
          signOptions: {
            expiresIn: expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
