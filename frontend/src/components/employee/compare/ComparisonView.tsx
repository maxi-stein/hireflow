import { useState, useCallback } from 'react';
import { Container, Flex, Box, ScrollArea } from '@mantine/core';
import { ComparisonViewHeader } from './ComparisonViewHeader';
import { CandidateComparisonCard } from './CandidateComparisonCard';
import { CandidateActionModals } from '../common/CandidateActionModals';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import { useCandidateActions } from '../../../hooks/useCandidateActions';
import { useDragScroll } from '../../../hooks/useDragScroll';
import { useNavigate } from 'react-router-dom';
import { APP_MAX_WIDTH } from '../../../constants/layout';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import type { JobOffer } from '../../../services/job-offer.service';
import type { TechStats } from '../../../hooks/useCandidateTechExperience';

interface ComparisonViewProps {
  candidatesToCompare: CandidateApplication[];
  selectedJobOffer: JobOffer | undefined;
  onBack: () => void;
  onRemoveCandidate: (candidateId: string) => void;
  techStats: TechStats;
}

export function ComparisonView({
  candidatesToCompare,
  selectedJobOffer,
  onBack,
  onRemoveCandidate,
  techStats
}: ComparisonViewProps) {
  const navigate = useNavigate();
  const [accordionValue, setAccordionValue] = useState<string[]>(['skills']);
  const dragScroll = useDragScroll<HTMLDivElement>();

  const candidateActions = useCandidateActions({
    onRejectSuccess: (applicationId) => {
      const rejectedApp = candidatesToCompare.find(app => app.id === applicationId);
      if (rejectedApp) {
        onRemoveCandidate(rejectedApp.candidate.id);
      }
    },
    onHireSuccess: (applicationId) => {
      const hiredApp = candidatesToCompare.find(app => app.id === applicationId);
      if (hiredApp) {
        onRemoveCandidate(hiredApp.candidate.id);
      }
    },
  });

  const handleScheduleInterview = useCallback((applicationId: string) => {
    navigate(`/manage/interviews?applicationId=${applicationId}`);
  }, [navigate]);

  const handleRejectClick = useCallback((application: CandidateApplication) => {
    candidateActions.handleRejectClick(
      application.id,
      `${application.candidate.user.first_name} ${application.candidate.user.last_name}`
    );
  }, [candidateActions]);

  const handleHireClick = useCallback((application: CandidateApplication) => {
    candidateActions.handleHireClick(
      application.id,
      `${application.candidate.user.first_name} ${application.candidate.user.last_name}`
    );
  }, [candidateActions]);

  return (
    <Box py="xl">
      <Container size={APP_MAX_WIDTH} mb="xl">
        <ComparisonViewHeader
          candidateCount={candidatesToCompare.length}
          onBack={onBack}
          title={selectedJobOffer?.position}
        />
      </Container>

      {/* Full width container with horizontal scroll (CSS Breakout for full-bleed) */}
      <Box
        w="100vw"
        style={{
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
        }}
      >
        <ScrollArea 
          w="100%" 
          type="auto" 
          offsetScrollbars 
          viewportRef={dragScroll.ref}
          {...dragScroll.events}
          style={{ cursor: dragScroll.isDragging ? 'grabbing' : 'grab' }}
        >
          <Flex
            wrap="nowrap"
            gap="lg"
            px="xl"
            mx="auto"
            w="fit-content"
            style={{ 
              paddingBottom: '1rem', // Give some space for the scrollbar
            }}
          >
            {candidatesToCompare.map(application => (
              <Box key={application.candidate.id} w={{ base: 400, sm: 475, md: 525 }}>
                <CandidateComparisonCard
                  application={application}
                  onHire={handleHireClick}
                  onReject={handleRejectClick}
                  onScheduleInterview={handleScheduleInterview}
                  getStatusColor={getApplicationStatusColor}
                  accordionValue={accordionValue}
                  onAccordionChange={setAccordionValue}
                  techStats={techStats}
                />
              </Box>
            ))}
          </Flex>
        </ScrollArea>
      </Box>

      <CandidateActionModals
        candidateToReject={candidateActions.candidateToReject}
        onRejectClose={candidateActions.handleCancelReject}
        onRejectConfirm={candidateActions.handleConfirmReject}
        isRejecting={candidateActions.isRejecting}
        candidateToHire={candidateActions.candidateToHire}
        onHireClose={candidateActions.handleCancelHire}
        onHireConfirm={candidateActions.handleConfirmHire}
        isHiring={candidateActions.isHiring}
      />
    </Box>
  );
}
