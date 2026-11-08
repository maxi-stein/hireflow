import type { Interview } from '../../../services/interview.service';
import type { JobOffer } from '../../../services/job-offer.service';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { InterviewDetailsModal } from './InterviewDetailsModal';
import { ViewJobOfferModal } from '../job-postings/ViewJobOfferModal';
import { CancelInterviewModal } from './CancelInterviewModal';

interface CalendarModalsContainerProps {
  isScheduleModalOpen: boolean;
  onCloseScheduleModal: () => void;
  onScheduleSuccess: () => void;
  applicationId?: string;
  interviewToEdit: Interview | null;
  selectedInterview: Interview | null;
  onCloseInterviewDetails: () => void;
  onReschedule: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
  selectedJobOffer: JobOffer | null;
  onCloseJobOffer: () => void;
  interviewToCancel: Interview | null;
  onCloseCancelModal: () => void;
  onConfirmCancel: () => void;
  isCancelling: boolean;
}

export function CalendarModalsContainer({
  isScheduleModalOpen,
  onCloseScheduleModal,
  onScheduleSuccess,
  applicationId,
  interviewToEdit,
  selectedInterview,
  onCloseInterviewDetails,
  onReschedule,
  onCancel,
  selectedJobOffer,
  onCloseJobOffer,
  interviewToCancel,
  onCloseCancelModal,
  onConfirmCancel,
  isCancelling,
}: CalendarModalsContainerProps) {
  return (
    <>
      <ScheduleInterviewModal
        opened={isScheduleModalOpen}
        onClose={onCloseScheduleModal}
        onSuccess={onScheduleSuccess}
        initialApplicationId={applicationId}
        interviewToEdit={interviewToEdit}
      />

      <InterviewDetailsModal
        interview={selectedInterview}
        onClose={onCloseInterviewDetails}
        onReschedule={onReschedule}
        onCancel={onCancel}
      />

      {selectedJobOffer && (
        <ViewJobOfferModal
          opened={!!selectedJobOffer}
          onClose={onCloseJobOffer}
          jobOfferId={selectedJobOffer.id}
        />
      )}

      <CancelInterviewModal
        opened={!!interviewToCancel}
        onClose={onCloseCancelModal}
        onConfirm={onConfirmCancel}
        isLoading={isCancelling}
      />
    </>
  );
}

