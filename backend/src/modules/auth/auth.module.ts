import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { getAuthConfig } from './helper';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [
    UsersModule,
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
