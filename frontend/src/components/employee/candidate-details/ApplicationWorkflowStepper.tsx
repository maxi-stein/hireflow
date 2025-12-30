import { Stepper, rem } from '@mantine/core';
import { IconCircleCheck, IconCircleX, IconUserCheck, IconLoader } from '@tabler/icons-react';
import { ApplicationStatus } from '../../../services/candidate-application.service';

interface ApplicationWorkflowStepperProps {
    status: ApplicationStatus;
}

export function ApplicationWorkflowStepper({ status }: ApplicationWorkflowStepperProps) {
    const getActiveStep = () => {
        switch (status) {
            case ApplicationStatus.APPLIED:
                return 0; // First step active
            case ApplicationStatus.IN_PROGRESS:
                return 1; // Second step active
            case ApplicationStatus.HIRED:
            case ApplicationStatus.REJECTED:
                return 3; // Finished
            default:
                return 0;
        }
    };

    const isRejected = status === ApplicationStatus.REJECTED;

    return (
        <Stepper active={getActiveStep()} size="sm">
            <Stepper.Step
                label="App Received"
                description="Application submitted"
                icon={<IconUserCheck style={{ width: rem(18), height: rem(18) }} />}
            />

            <Stepper.Step
                label="In Progress"
                description="Interviewing & Reviewing"
                icon={<IconLoader style={{ width: rem(18), height: rem(18) }} />}
                loading={status === ApplicationStatus.IN_PROGRESS}
            />

            <Stepper.Step
                label="Decision"
                description={isRejected ? "Rejected" : "Hired"}
                color={isRejected ? "red" : "green"}
                completedIcon={isRejected ? <IconCircleX style={{ width: rem(18), height: rem(18) }} /> : <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
            />
        </Stepper>
    );
}
