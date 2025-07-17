import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Module({
  providers: [JwtAuthGuard, LocalAuthGuard],
  exports: [JwtAuthGuard, LocalAuthGuard],
})
export class GuardsModule {}
