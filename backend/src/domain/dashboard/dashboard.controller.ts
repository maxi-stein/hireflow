import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../auth/guards/roles.guard';
import { RequireUserType } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/interfaces/user.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@RequireUserType(UserType.EMPLOYEE)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('metrics')
  getMetrics() {
    return this.dashboardService.getMetrics();
  }
}
