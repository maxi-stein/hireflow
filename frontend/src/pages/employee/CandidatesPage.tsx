import { useState } from 'react';
import { getApplicationStatusColor } from '../../utils/application.utils';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Stack, LoadingOverlay, Text, SimpleGrid, Alert } from '@mantine/core';
import { IconChevronLeft, IconX, IconCheck, IconCircleCheck } from '@tabler/icons-react';
import { useCandidateQuery } from '../../hooks/api/useCandidates';
import { useAllCandidateApplicationsQuery, useUpdateApplicationStatusMutation, useHireApplicationMutation } from '../../hooks/api/useCandidateApplications';
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
import { CandidateHeader } from '../../components/employee/candidate-details/CandidateHeader';
import { CandidateLinks } from '../../components/employee/candidate-details/CandidateLinks';
import { ScheduleInterviewModal } from '../../components/employee/interviews/ScheduleInterviewModal';

export function CandidatesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: candidate, isLoading: isLoadingCandidate } = useCandidateQuery(id || '');
  const { data: applications, isLoading: isLoadingApplications } = useAllCandidateApplicationsQuery({
    candidate_id: id,
    limit: 50
  });
  const { data: interviews, isLoading: isLoadingInterviews, refetch: refetchInterviews } = useCandidateInterviewsQuery(id || '');
  const { data: files } = useCandidateFilesQuery(id || '');

  const hiredApplication = applications?.data.find(app => app.status === ApplicationStatus.HIRED);
  const isHired = !!hiredApplication;

  const [rejectModalOpened, setRejectModalOpened] = useState(false);
  const [applicationToReject, setApplicationToReject] = useState<{ id: string; position: string } | null>(null);

  const [hireModalOpened, setHireModalOpened] = useState(false);
  const [applicationToHire, setApplicationToHire] = useState<{ id: string; position: string } | null>(null);

  // Schedule Interview State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleApplicationId, setScheduleApplicationId] = useState<string | undefined>(undefined);

  const resume = files?.find(f => f.file_type === FileType.RESUME);

  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const hireMutation = useHireApplicationMutation();

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
    setApplicationToReject({ id: applicationId, position });
    setRejectModalOpened(true);
  };

  const handleHireClick = (applicationId: string, position: string) => {
    setApplicationToHire({ id: applicationId, position });
    setHireModalOpened(true);
  };

  const handleConfirmReject = async () => {
    if (!applicationToReject) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: applicationToReject.id,
        status: ApplicationStatus.REJECTED
      });
      notifications.show({
        title: 'Application Rejected',
        message: 'The candidate has been disqualified from this position.',
        color: 'red',
        icon: <IconX size={16} />
      });
      setRejectModalOpened(false);
      setApplicationToReject(null);
    } catch (error) {
      console.error('Error rejecting application:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update application status.',
        color: 'red',
      });
    }
  };

  const handleConfirmHire = async () => {
    if (!applicationToHire) return;

    try {
      await hireMutation.mutateAsync(applicationToHire.id);
      notifications.show({
        title: 'Candidate Hired',
        message: `The candidate has been hired for ${applicationToHire.position}.`,
        color: 'green',
        icon: <IconCheck size={16} />
      });
      setHireModalOpened(false);
      setApplicationToHire(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to hire candidate.',
        color: 'red',
      });
    }
  };

  const handleScheduleInterview = (applicationId: string) => {
    setScheduleApplicationId(applicationId);
    setScheduleModalOpen(true);
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

      <Stack gap="xl">

        {/* Section 1: Top Info (Header & Contact) */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <CandidateHeader candidate={candidate} isHired={isHired} />
          <CandidateLinks
            candidate={candidate}
            resume={resume}
            onDownloadResume={handleDownloadResume}
          />
        </SimpleGrid>

        {/* Section 2: Applications or Hired Status */}
        {isHired ? (
          <Alert
            variant="light"
            color="green"
            title="Candidate Hired"
            icon={<IconCircleCheck size={18} />}
          >
            This candidate has been hired for the position of <strong>{hiredApplication.job_offer.position}</strong>.
            All other applications and scheduling for this candidate are now closed.
          </Alert>
        ) : (
          <ApplicationsSection
            applications={applications?.data || []}
            interviews={interviews?.data || []}
            getStatusColor={getApplicationStatusColor}
            onReject={handleRejectClick}
            onHire={handleHireClick}
            onSchedule={handleScheduleInterview}
          />
        )}

        {/* Section 3: Details */}
        <Stack gap="lg">
          <EducationSection educations={candidate.educations || []} />

          <WorkExperienceSection experiences={candidate.work_experiences || []} />

          <InterviewHistorySection
            interviews={interviews?.data || []}
            getStatusColor={getInterviewStatusColor}
          />
        </Stack>

      </Stack>

      {/* Confirmation Modals */}
      <ConfirmActionModal
        opened={rejectModalOpened}
        onClose={() => setRejectModalOpened(false)}
        onConfirm={handleConfirmReject}
        title="Reject Application"
        message={
          <Text>
            Are you sure you want to reject the application for <strong>{applicationToReject?.position}</strong>?
            <br />
            This action can be undone later if needed.
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
            Are you sure you want to hire this candidate for <strong>{applicationToHire?.position}</strong>?
            <br />
            This will mark the application as HIRED.
          </Text>
        }
        confirmLabel="Hire"
        confirmColor="green"
        confirmIcon={<IconCheck size={16} />}
        isLoading={hireMutation.isPending}
      />

      <ScheduleInterviewModal
        opened={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setScheduleApplicationId(undefined);
        }}
        initialApplicationId={scheduleApplicationId}
        onSuccess={() => {
          refetchInterviews();
        }}
      />
    </Container>
  );
}
