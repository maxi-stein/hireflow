import { Inject, Injectable } from '@nestjs/common';
import { JobOfferService } from '../job-offer/job-offer/job-offer.service';
import { JobOfferStatus } from '../job-offer/job-offer/interfaces';
import { CandidateApplicationService } from '../candidate-application/candidate-application.service';
import { InterviewService } from '../interviews/interview.service';
import { InterviewStatus } from '../interviews/interfaces/interview-status.enum';
import { InterviewReviewService } from '../interview-review/interview-review.service';
import { ApplicationStatus } from '../candidate-application/interfaces/application-status';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(JobOfferService)
    private readonly jobOfferService: JobOfferService,
    @Inject(CandidateApplicationService)
    private readonly candidateApplicationService: CandidateApplicationService,
    @Inject(InterviewService)
    private readonly interviewService: InterviewService,
    @Inject(InterviewReviewService)
    private readonly interviewReviewService: InterviewReviewService,
  ) {}

  async getMetrics(employeeId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const { data: activeJobOffers } = await this.jobOfferService.findAll({
      status: JobOfferStatus.OPEN,
      page: 0,
      limit: 0,
    });

    const { data: applicationsToday } =
      await this.candidateApplicationService.findAll({
        start_date: startOfToday.toISOString(),
        end_date: endOfToday.toISOString(),
        page: 0,
        limit: 0,
      });

    const { data: pendingInterviews } = await this.interviewService.findAll({
      status: [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED],
      employeeId,
      page: 0,
      limit: 0,
    });

    const { data: pendingReviews } =
      await this.interviewReviewService.findInterviewsPendingReview(
        employeeId,
        {
          page: 0,
          limit: 0,
        },
      );

    const { data: candidatesApplied } =
      await this.candidateApplicationService.findAll({
        status: [ApplicationStatus.APPLIED, ApplicationStatus.IN_PROGRESS],
        page: 0,
        limit: 0,
      });

    const { data: allApplications } =
      await this.candidateApplicationService.findAll({
        page: 0,
        limit: 0,
      });

    const candidatesPerJob = activeJobOffers.reduce(
      (acc, job) => {
        acc[job.position] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    candidatesApplied.forEach((app) => {
      const jobTitle = app.job_offer?.position;
      if (jobTitle && candidatesPerJob[jobTitle] !== undefined) {
        candidatesPerJob[jobTitle]++;
      }
    });

    const candidatesPerJobSorted = Object.entries(candidatesPerJob).sort(
      (a, b) => b[1] - a[1],
    );

    let pendingReviewsCount = 0;
    pendingReviews.forEach(interview => {
      pendingReviewsCount += interview.applications.length;
    });

    // Calculate applications per week for the last 8 weeks
    const weeksCount = 8;
    const applicationsPerWeek = [];
    const now = new Date();
    
    // Normalize to start of current week (Monday)
    const currentWeekStart = new Date(now);
    currentWeekStart.setHours(0, 0, 0, 0);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);

    for (let i = weeksCount - 1; i >= 0; i--) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const count = allApplications.filter(app => {
        const appDate = new Date(app.created_at);
        return appDate >= weekStart && appDate <= weekEnd;
      }).length;

      const label = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
      applicationsPerWeek.push({
        date: label,
        count
      });
    }

    return {
      activeJobOffers: activeJobOffers.length,
      applicationsToday: applicationsToday.length,
      pendingInterviews: pendingInterviews.length,
      pendingReviews: pendingReviewsCount,
      candidatesPerJob: candidatesPerJobSorted.map(([jobTitle, count]) => ({
        jobTitle,
        count,
      })),
      applicationsPerWeek,
    };
  }
}
