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
    const today = new Date();

    const { data: activeJobOffers } = await this.jobOfferService.findAll({
      status: JobOfferStatus.OPEN,
      page: 0,
      limit: 0,
    });

    const { data: applicationsToday } =
      await this.candidateApplicationService.findAll({
        start_date: today.toISOString(),
        end_date: today.toISOString(),
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

    const candidatesPerJob = candidatesApplied.reduce(
      (acc, app) => {
        const jobTitle = app.job_offer.position;
        if (acc[jobTitle]) {
          acc[jobTitle]++;
        } else {
          acc[jobTitle] = 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const candidatesPerJobSorted = Object.entries(candidatesPerJob).sort(
      (a, b) => b[1] - a[1],
    );

    return {
      activeJobOffers: activeJobOffers.length,
      applicationsToday: applicationsToday.length,
      pendingInterviews: pendingInterviews.length,
      pendingReviews: pendingReviews.length,
      candidatesPerJob: candidatesPerJobSorted.map(([jobTitle, count]) => ({
        jobTitle,
        count,
      })),
    };
  }
}
