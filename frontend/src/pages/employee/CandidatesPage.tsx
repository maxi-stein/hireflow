import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Grid, Stack, LoadingOverlay, Text } from '@mantine/core';
import { IconChevronLeft, IconX, IconCalendarEvent } from '@tabler/icons-react';
import { useCandidateQuery } from '../../hooks/api/useCandidates';
import { useAllCandidateApplicationsQuery, useUpdateApplicationStatusMutation } from '../../hooks/api/useCandidateApplications';
import { useCandidateInterviewsQuery } from '../../hooks/api/useInterviews';
import { useCandidateFilesQuery } from '../../hooks/api/useUserFiles';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { InterviewStatus } from '../../services/interview.service';
import { FileType, userFileService } from '../../services/user-file.service';
import { notifications } from '@mantine/notifications';
import { ROUTES } from '../../router/routes.config';
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal';
import { InterviewHistorySection } from '../../components/employee/candidate-details/InterviewHistorySection';
import { WorkExperienceSection } from '../../components/employee/candidate-details/WorkExperienceSection';
import { EducationSection } from '../../components/employee/candidate-details/EducationSection';
import { ApplicationsSection } from '../../components/employee/candidate-details/ApplicationsSection';
import { CandidateProfileCard } from '../../components/employee/candidate-details/CandidateProfileCard';

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
  
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [rejectModalOpened, setRejectModalOpened] = useState(false);
  const [scheduleModalOpened, setScheduleModalOpened] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>('');

  const profilePicture = files?.find(f => f.file_type === FileType.PROFILE_PICTURE);
  const resume = files?.find(f => f.file_type === FileType.RESUME);

  const updateStatusMutation = useUpdateApplicationStatusMutation();

  // Load profile picture as blob
  useEffect(() => {
    if (profilePicture) {
      userFileService.downloadFile(profilePicture.id).then((blob) => {
        const url = URL.createObjectURL(blob);
        setProfilePictureUrl(url);
      }).catch((e) => {
        // show placeholder
        setProfilePictureUrl(null);
      });
    }
    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [profilePicture?.id]);

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

  const handleScheduleClick = (applicationId: string, position: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedJobPosition(position);
    setScheduleModalOpened(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedApplicationId) return;
    setScheduleModalOpened(false);
    navigate(`${ROUTES.EMPLOYEE.INTERVIEWS.path}?applicationId=${selectedApplicationId}`);
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

  const sortedEducation = [...(candidate.educations || [])].sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  const sortedExperience = [...(candidate.work_experiences || [])].sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

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
              profilePictureUrl={profilePictureUrl}
              resume={resume}
              onDownloadResume={handleDownloadResume}
            />

            <EducationSection educations={sortedEducation} />
          </Stack>
        </Grid.Col>

        {/* Right Column: Applications, Interviews & Experience */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            
            <ApplicationsSection 
              applications={applications?.data || []}
              getStatusColor={getStatusColor}
              onReject={handleRejectClick}
              onSchedule={handleScheduleClick}
            />

            <InterviewHistorySection 
              interviews={interviews?.data || []} 
              getStatusColor={getInterviewStatusColor} 
            />

            <WorkExperienceSection experiences={sortedExperience} />

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
        opened={scheduleModalOpened}
        onClose={() => setScheduleModalOpened(false)}
        onConfirm={handleConfirmSchedule}
        title="Schedule Interview"
        message={
          <Text>
            You will be redirected to schedule an interview for this candidate's application to{' '}
            <strong>"{selectedJobPosition}"</strong>. Continue?
          </Text>
        }
        confirmLabel="Continue"
        confirmColor="blue"
        confirmIcon={<IconCalendarEvent size={16} />}
      />
    </Container>
  );
}
