import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Grid, Stack, LoadingOverlay, Text } from '@mantine/core';
import { IconChevronLeft, IconX, IconCalendarEvent, IconCheck } from '@tabler/icons-react';
import { useCandidateQuery } from '../../hooks/api/useCandidates';
import { useAllCandidateApplicationsQuery, useUpdateApplicationStatusMutation } from '../../hooks/api/useCandidateApplications';
import { useCandidateInterviewsQuery } from '../../hooks/api/useInterviews';
import { useCandidateFilesQuery } from '../../hooks/api/useUserFiles';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { InterviewStatus } from '../../services/interview.service';
import { FileType, userFileService } from '../../services/user-file.service';
import { notifications } from '@mantine/notifications';
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal';
import { InterviewHistorySection } from '../../components/employee/candidate-details/InterviewHistorySection';
import { WorkExperienceSection } from '../../components/employee/candidate-details/WorkExperienceSection';
import { EducationSection } from '../../components/employee/candidate-details/EducationSection';
import { ApplicationsSection } from '../../components/employee/candidate-details/ApplicationsSection';
import { CandidateProfileCard } from '../../components/employee/candidate-details/CandidateProfileCard';
import { ApplicationWorkflowStepper } from '../../components/employee/candidate-details/ApplicationWorkflowStepper';
import { DecisionBanner } from '../../components/employee/candidate-details/DecisionBanner';
import { useInterviewScheduling } from '../../hooks/useInterviewScheduling';

export function CandidatesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: candidate, isLoading: isLoadingCandidate } = useCandidateQuery(id || '');
  const { data: applications, isLoading: isLoadingApplications } = useAllCandidateApplicationsQuery({
    candidate_id: id,
    limit: 50
  });
  const { data: interviews, isLoading: isLoadingInterviews } = useCandidateInterviewsQuery(id || '');
  const { data: files } = useCandidateFilesQuery(id || '');

  const [rejectModalOpened, setRejectModalOpened] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>('');

  const { handleScheduleClick, modalOpened, closeModal, confirmSchedule } = useInterviewScheduling();

  const resume = files?.find(f => f.file_type === FileType.RESUME);

  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const [hireModalOpened, setHireModalOpened] = useState(false);

  // Logic to determine if decision is needed
  const activeApplication = applications?.data.find(app => app.status === ApplicationStatus.IN_PROGRESS);

  const relevantInterviews = interviews?.data.filter(interview =>
    interview.applications.some(app => app.id === activeApplication?.id) &&
    (interview.reviews && interview.reviews.length > 0)
  ) || [];

  const hasReviews = relevantInterviews.length > 0;

  const averageScore = hasReviews
    ? relevantInterviews.reduce((acc, interview) => {
      const interviewAvg = interview.reviews?.reduce((sum, r) => sum + (r.score || 0), 0) || 0;
      return acc + (interviewAvg / (interview.reviews?.length || 1));
    }, 0) / relevantInterviews.length
    : 0;

  const handleHireClick = () => {
    if (activeApplication) {
      setSelectedApplicationId(activeApplication.id);
      setSelectedJobPosition(activeApplication.job_offer.position);
      setHireModalOpened(true);
    }
  };

  const handleConfirmHire = async () => {
    if (!selectedApplicationId) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedApplicationId,
        status: ApplicationStatus.HIRED
      });
      notifications.show({
        title: 'Candidate Hired!',
        message: 'The candidate has been successfully hired.',
        color: 'green',
      });
      setHireModalOpened(false);
      setSelectedApplicationId(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to hire candidate.',
        color: 'red',
      });
    }
  };

  const handleDownloadResume = async () => {
    if (!resume) return;
    try {
      const blob = await userFileService.downloadFile(resume.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.file_name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to download resume.',
        color: 'red',
      });
    }
  };

  const handleRejectClick = (applicationId: string, position: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedJobPosition(position);
    setRejectModalOpened(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedApplicationId) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedApplicationId,
        status: ApplicationStatus.REJECTED
      });
      notifications.show({
        title: 'Application Rejected',
        message: 'The candidate has been disqualified from this position.',
        color: 'red',
      });
      setRejectModalOpened(false);
      setSelectedApplicationId(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update application status.',
        color: 'red',
      });
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.HIRED: return 'green';
      case ApplicationStatus.REJECTED: return 'red';
      case ApplicationStatus.APPLIED: return 'gray';
      case ApplicationStatus.IN_PROGRESS: return 'blue';
      default: return 'gray';
    }
  };

  const getInterviewStatusColor = (status: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.COMPLETED: return 'green';
      case InterviewStatus.CANCELLED: return 'red';
      case InterviewStatus.SCHEDULED: return 'blue';
      case InterviewStatus.NO_SHOW: return 'orange';
      default: return 'gray';
    }
  };

  const isLoading = isLoadingCandidate || isLoadingApplications || isLoadingInterviews;

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!candidate) {
    return (
      <Container py="xl">
        <Text>Candidate not found.</Text>
        <Button onClick={() => navigate(-1)} mt="md">Go Back</Button>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconChevronLeft size={16} />}
        onClick={() => navigate(-1)}
        mb="lg"
      >
        Back to List
      </Button>

      <Grid gutter="lg">
        {/* Left Column: Profile Info */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <CandidateProfileCard
              candidate={candidate}
              resume={resume}
              onDownloadResume={handleDownloadResume}
            />

            <EducationSection educations={candidate.educations || []} />
          </Stack>
        </Grid.Col>

        {/* Right Column: Applications, Interviews & Experience */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">



            {/* Stepper for Active or Most Recent Application */}
            {(activeApplication || applications?.data?.[0]) && (
              <ApplicationWorkflowStepper
                status={activeApplication?.status || applications?.data?.[0]?.status || ApplicationStatus.APPLIED}
              />
            )}

            {activeApplication && hasReviews && (
              <DecisionBanner
                score={Math.round(averageScore)}
                onHire={handleHireClick}
                onReject={() => handleRejectClick(activeApplication.id, activeApplication.job_offer.position)}
                isLoading={updateStatusMutation.isPending}
              />
            )}

            <ApplicationsSection
              applications={applications?.data || []}
              getStatusColor={getStatusColor}
              onReject={handleRejectClick}
              onSchedule={(appId) => handleScheduleClick(appId, id || '')}
            />

            <InterviewHistorySection
              interviews={interviews?.data || []}
              getStatusColor={getInterviewStatusColor}
            />

            <WorkExperienceSection experiences={candidate.work_experiences || []} />

          </Stack>
        </Grid.Col>
      </Grid>

      {/* Confirmation Modals */}
      <ConfirmActionModal
        opened={rejectModalOpened}
        onClose={() => setRejectModalOpened(false)}
        onConfirm={handleConfirmReject}
        title="Reject Application"
        message={
          <Text>
            Are you sure you want to reject this candidate's application for{' '}
            <strong>"{selectedJobPosition}"</strong>? This action cannot be undone.
          </Text>
        }
        confirmLabel="Reject"
        confirmColor="red"
        confirmIcon={<IconX size={16} />}
        isLoading={updateStatusMutation.isPending}
      />

      <ConfirmActionModal
        opened={hireModalOpened}
        onClose={() => setHireModalOpened(false)}
        onConfirm={handleConfirmHire}
        title="Hire Candidate"
        message={
          <Text>
            Are you sure you want to hire this candidate for <strong>"{selectedJobPosition}"</strong>?
            <br /><br />
            This will mark the application as HIRED.
          </Text>
        }
        confirmLabel="Hire Candidate"
        confirmColor="green"
        confirmIcon={<IconCheck size={16} />}
        isLoading={updateStatusMutation.isPending}
      />

      <ConfirmActionModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={confirmSchedule}
        title="Schedule Interview"
        message={
          <Text>
            This candidate already has a future interview scheduled.
            <br /><br />
            Are you sure you want to schedule another interview?
          </Text>
        }
        confirmLabel="Continue"
        confirmColor="blue"
        confirmIcon={<IconCalendarEvent size={16} />}
      />
    </Container>
  );
}
