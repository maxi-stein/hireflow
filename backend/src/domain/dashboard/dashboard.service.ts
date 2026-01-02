import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getMetrics() {
    // Dummy data for now
    return {
      activeJobOffers: 12,
      applicationsToday: 5,
      pendingInterviews: 3,
      pendingReviews: 8,
      candidatesPerJob: [
        { jobTitle: 'Frontend Developer', count: 45 },
        { jobTitle: 'Backend Developer', count: 32 },
        { jobTitle: 'Product Manager', count: 18 },
        { jobTitle: 'UX Designer', count: 24 },
        { jobTitle: 'DevOps Engineer', count: 15 },
      ]
    };
  }
}
