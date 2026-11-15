import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBriefcase, IconFileText, IconCalendarEvent, IconStar } from '@tabler/icons-react';
import { useDashboardMetricsQuery } from '../api/useDashboard';
import { useMyPendingReviewsQuery } from '../api/useInterviewReviews';
import { useInterviewsQuery } from '../api/useInterviews';
import { InterviewStatus } from '../../services/interview.service';

export function useDashboardData() {
  const { t } = useTranslation('dashboard');
  const { data: metrics, isLoading: isLoadingMetrics } = useDashboardMetricsQuery();
  const { data: pendingReviewsData, isLoading: isLoadingPendingReviews } = useMyPendingReviewsQuery(1, 10);

  const startDate = useMemo(() => new Date().toISOString(), []);

  const { data: upcomingInterviewsData, isLoading: isLoadingInterviews } = useInterviewsQuery({
    limit: 10,
    status: [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED],
    start_date: startDate,
  });

  const pendingReviews = useMemo(() => {
    return [...(pendingReviewsData?.data || [])]
      .filter((interview) => interview.applications?.some((app) => app.candidate && app.job_offer))
      .sort((a, b) =>
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
      );
  }, [pendingReviewsData]);

  const upcomingInterviews = useMemo(() => {
    return [...(upcomingInterviewsData?.data || [])]
      .filter((interview) => interview.applications?.[0]?.candidate && interview.applications?.[0]?.job_offer)
      .sort((a, b) =>
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
      );
  }, [upcomingInterviewsData]);

  const stats = metrics
    ? [
        { label: t('stats.activeJobOffers'), value: metrics.activeJobOffers, icon: IconBriefcase, color: 'blue' },
        { label: t('stats.applicationsToday'), value: metrics.applicationsToday, icon: IconFileText, color: 'teal' },
        { label: t('stats.pendingInterviews'), value: metrics.pendingInterviews, icon: IconCalendarEvent, color: 'violet' },
        { label: t('stats.pendingReviews'), value: metrics.pendingReviews, icon: IconStar, color: 'amber' },
      ]
    : [];

  const maxCandidates = metrics
    ? Math.max(0, ...metrics.candidatesPerJob.map((c) => c.count))
    : 0;

  const isLoading = isLoadingMetrics || !metrics;

  return {
    metrics,
    isLoading,
    isLoadingInterviews,
    isLoadingPendingReviews,
    stats,
    maxCandidates,
    pendingReviews,
    upcomingInterviews,
  };
}

