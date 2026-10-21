import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { getApplicationStatusColor } from '../../utils/application.utils';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Stack, LoadingOverlay, Text, SimpleGrid, Alert, Box, useMantineColorScheme } from '@mantine/core';
import { IconChevronLeft, IconX, IconCheck, IconCircleCheck } from '@tabler/icons-react';
import { useCandidateQuery } from '../../hooks/api/useCandidates';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { useCandidateInterviewsQuery } from '../../hooks/api/useInterviews';
import { useCandidateFilesQuery } from '../../hooks/api/useUserFiles';
import { useCandidateActions } from '../../hooks/useCandidateActions';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { FileType, userFileService } from '../../services/user-file.service';
import { notifications } from '@mantine/notifications';
import { CandidateActionModals } from '../../components/employee/common/CandidateActionModals';
import { WorkExperienceSection } from '../../components/employee/candidate-details/WorkExperienceSection';
import { EducationSection } from '../../components/employee/candidate-details/EducationSection';
import { ApplicationsSection } from '../../components/employee/candidate-details/ApplicationsSection';
import { CandidateHeader } from '../../components/employee/candidate-details/CandidateHeader';
import { CandidateLinks } from '../../components/employee/candidate-details/CandidateLinks';
import { ScheduleInterviewModal } from '../../components/employee/interviews/ScheduleInterviewModal';
import { APP_MAX_WIDTH } from '../../constants/layout';


export function CandidatePage() {
  const { t } = useTranslation('profile');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Data fetching
  const { data: candidate, isLoading: isLoadingCandidate } = useCandidateQuery(id || '');
  const { data: applications, isLoading: isLoadingApplications } = useAllCandidateApplicationsQuery({
    candidate_id: id,
    limit: 50
  });
  const { data: interviews, isLoading: isLoadingInterviews, refetch: refetchInterviews } = useCandidateInterviewsQuery(id || '');
  const { data: files } = useCandidateFilesQuery(id || '');

  const hiredApplication = applications?.data.find(app => app.status === ApplicationStatus.HIRED);
  const isHired = !!hiredApplication;

  // Schedule Interview State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleApplicationId, setScheduleApplicationId] = useState<string | undefined>(undefined);

  const resume = files?.find(f => f.file_type === FileType.RESUME);

  // Shared hook for reject/hire actions with notification callbacks
  const candidateActions = useCandidateActions({
    onRejectSuccess: () => {
      notifications.show({
        title: t('candidate.actions.confirmReject'),
        message: t('candidate.actions.confirmRejectMessage'),
        color: 'red',
        icon: <IconX size={16} />
      });
    },
    onHireSuccess: () => {
      notifications.show({
        title: t('candidate.actions.confirmHire'),
        message: t('candidate.actions.confirmHireMessage'),
        color: 'green',
        icon: <IconCheck size={16} />
      });
    },
  });

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
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle'),
        message: t('candidate.actions.downloadError'),
        color: 'red',
      });
    }
  };

  const handleRejectClick = (applicationId: string, position: string) => {
    candidateActions.handleRejectClick(applicationId, `application for ${position}`);
  };

  const handleHireClick = (applicationId: string, position: string) => {
    candidateActions.handleHireClick(applicationId, `candidate for ${position}`);
  };

  const handleScheduleInterview = (applicationId: string) => {
    setScheduleApplicationId(applicationId);
    setScheduleModalOpen(true);
  };

  const isLoading = isLoadingCandidate || isLoadingApplications || isLoadingInterviews;

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!candidate) {
    return (
      <Container py="xl">
        <Text>{t('candidate.actions.notFound')}</Text>
        <Button onClick={() => navigate(-1)} mt="md">{t('candidate.actions.goBack')}</Button>
      </Container>
    );
  }

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Button
        variant="subtle"
        leftSection={<IconChevronLeft size={16} />}
        onClick={() => navigate(-1)}
        mb="lg"
        color="gray"
        size="sm"
      >
        {t('candidate.actions.backToList')}
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
            title={t('candidate.management.hiredTitle')}
            icon={<IconCircleCheck size={18} />}
            radius="xl"
          >
            <Trans
              i18nKey="candidate.management.hiredMessage"
              ns="profile"
              values={{ position: hiredApplication.job_offer.position }}
              components={{ 1: <strong /> }}
            />
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
        <Box
          style={{
            borderRadius: 16,
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            background: isDark ? '#1e293b' : '#ffffff',
            overflow: 'hidden',
          }}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
            <Box
              p="xl"
              style={{
                borderRight: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
              }}
            >
              <EducationSection educations={candidate.educations || []} />
            </Box>
            <Box p="xl">
              <WorkExperienceSection experiences={candidate.work_experiences || []} />
            </Box>
          </SimpleGrid>
        </Box>

      </Stack>

      {/* Shared Reject/Hire Confirmation Modals */}
      <CandidateActionModals
        candidateToReject={candidateActions.candidateToReject}
        onRejectClose={candidateActions.handleCancelReject}
        onRejectConfirm={candidateActions.handleConfirmReject}
        isRejecting={candidateActions.isRejecting}
        rejectMessage={
          <Trans
            i18nKey="candidate.actions.rejectModalMessage"
            ns="profile"
            values={{ name: candidateActions.candidateToReject?.name }}
            components={{ 1: <strong /> }}
          />
        }
        candidateToHire={candidateActions.candidateToHire}
        onHireClose={candidateActions.handleCancelHire}
        onHireConfirm={candidateActions.handleConfirmHire}
        isHiring={candidateActions.isHiring}
        hireMessage={
          <Trans
            i18nKey="candidate.actions.hireModalMessage"
            ns="profile"
            values={{ name: candidateActions.candidateToHire?.name }}
            components={{ 1: <strong /> }}
          />
        }
      />

      {/* Schedule Interview Modal */}
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
