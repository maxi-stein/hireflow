import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    TextInput,
    Paper,
    Stack,
    Group,
    Button,
    Checkbox,
    Badge,
    SimpleGrid,
    LoadingOverlay,
    Accordion,
    Alert,
    useMantineColorScheme
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import { IconSearch, IconScale, IconAlertCircle, IconX, IconCheck } from '@tabler/icons-react';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAllCandidateApplicationsQuery, useUpdateApplicationStatusMutation, useHireApplicationMutation } from '../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal';
import { useNavigate } from 'react-router-dom';
import { CandidateComparisonCard } from '../../components/employee/compare/CandidateComparisonCard';
import { CandidateAvatar } from '../../components/shared/CandidateAvatar';
import { getApplicationStatusColor } from '../../utils/application.utils';

export function CompareCandidatesPage() {
    const [searchParams] = useSearchParams();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const navigate = useNavigate();

    // Job offer search
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 500);

    // Selected job offer
    const [selectedJobOfferId, setSelectedJobOfferId] = useState<string | null>(null);

    // Accordion open state for job offers
    const [jobAccordionValue, setJobAccordionValue] = useState<string | null>(null);

    // Selected candidates for comparison
    const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

    // Comparison view active
    const [showComparison, setShowComparison] = useState(false);

    // Candidate to reject
    const [candidateToReject, setCandidateToReject] = useState<{ id: string; name: string } | null>(null);
    const [candidateToHire, setCandidateToHire] = useState<{ id: string; name: string } | null>(null);

    // Synchronized accordion state across all cards (must be outside conditional)
    const [accordionValue, setAccordionValue] = useState<string[]>(['skills']);

    // Mutation for updating application status
    const updateStatusMutation = useUpdateApplicationStatusMutation();
    const hireMutation = useHireApplicationMutation();

    // Fetch job offers
    const { data: jobOffersData, isLoading: isLoadingJobs } = useJobOffersQuery({
        position: debouncedSearch || undefined,
        limit: 50,
    });

    // Fetch candidates for selected job offer
    const { data: applicationsData, isLoading: isLoadingApps } = useAllCandidateApplicationsQuery({
        job_offer_id: selectedJobOfferId || undefined,
        limit: 100,
    });

    // Filter candidates by status (APPLIED or IN_PROGRESS only)
    const filteredCandidates = applicationsData?.data?.filter(
        app => app.status === ApplicationStatus.APPLIED || app.status === ApplicationStatus.IN_PROGRESS
    ) || [];

    // Handle URL parameters for deep linking
    useEffect(() => {
        const jobOfferId = searchParams.get('jobOfferId');
        const candidateId = searchParams.get('candidateId');

        if (jobOfferId) {
            setSelectedJobOfferId(jobOfferId);
            setJobAccordionValue(jobOfferId);
        }

        if (candidateId) {
            setSelectedCandidates(new Set([candidateId]));
        }
    }, [searchParams]);

    const handleCandidateToggle = (candidateId: string) => {
        const newSelected = new Set(selectedCandidates);
        if (newSelected.has(candidateId)) {
            newSelected.delete(candidateId);
        } else {
            newSelected.add(candidateId);
        }
        setSelectedCandidates(newSelected);
    };

    const handleClearSelection = () => {
        setSelectedCandidates(new Set());
    };

    const handleCompare = () => {
        if (selectedCandidates.size >= 2) {
            setShowComparison(true);
        }
    };

    const handleBackToSelection = () => {
        setShowComparison(false);
        // Keep the accordion open with selections preserved
        if (selectedJobOfferId) {
            setJobAccordionValue(selectedJobOfferId);
        }
    };

    const handleAccordionChange = (value: string | null) => {
        setJobAccordionValue(value);
        if (value) {
            setSelectedJobOfferId(value);
        }
    };

    const handleRejectClick = (application: any) => {
        setCandidateToReject({
            id: application.id,
            name: `${application.candidate.user.first_name} ${application.candidate.user.last_name}`
        });
    };

    const handleConfirmReject = async () => {
        if (!candidateToReject) return;

        try {
            await updateStatusMutation.mutateAsync({
                id: candidateToReject.id,
                status: ApplicationStatus.REJECTED
            });

            // Remove from selected candidates
            const newSelected = new Set(selectedCandidates);
            const rejectedApp = candidatesToCompare.find(app => app.id === candidateToReject.id);
            if (rejectedApp) {
                newSelected.delete(rejectedApp.candidate.id);
                setSelectedCandidates(newSelected);
            }

            setCandidateToReject(null);
        } catch (error) {
            console.error('Error rejecting candidate:', error);
        }
    };

    const handleScheduleInterview = (applicationId: string) => {
        navigate(`/manage/interviews?applicationId=${applicationId}`);
    };

    const handleHireClick = (application: any) => {
        setCandidateToHire({
            id: application.id,
            name: `${application.candidate.user.first_name} ${application.candidate.user.last_name}`
        });
    };

    const handleConfirmHire = async () => {
        if (!candidateToHire) return;

        try {
            await hireMutation.mutateAsync(candidateToHire.id);

            // Remove from selected candidates
            const newSelected = new Set(selectedCandidates);
            const hiredApp = candidatesToCompare.find(app => app.id === candidateToHire.id);
            if (hiredApp) {
                newSelected.delete(hiredApp.candidate.id);
                setSelectedCandidates(newSelected);
            }

            setCandidateToHire(null);
        } catch (error) {
            console.error('Error hiring candidate:', error);
        }
    };

    // Get selected candidate applications for comparison
    const candidatesToCompare = filteredCandidates.filter(app =>
        selectedCandidates.has(app.candidate.id)
    );

    // Comparison View
    if (showComparison) {
        return (
            <Container size="xl" py="xl">
                <Group justify="space-between" mb="lg">
                    <div>
                        <Title order={2}>Candidate Comparison</Title>
                        <Text c="dimmed" size="sm">Comparing {candidatesToCompare.length} candidates</Text>
                    </div>
                    <Button variant="default" onClick={handleBackToSelection}>
                        Back to Selection
                    </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" style={{ alignItems: 'stretch' }}>
                    {candidatesToCompare.map(application => (
                        <CandidateComparisonCard
                            key={application.candidate.id}
                            application={application}
                            onHire={handleHireClick}
                            onReject={handleRejectClick}
                            onScheduleInterview={handleScheduleInterview}
                            getStatusColor={getApplicationStatusColor}
                            accordionValue={accordionValue}
                            onAccordionChange={setAccordionValue}
                        />
                    ))}
                </SimpleGrid>

                {/* Reject Confirmation Modal */}
                <ConfirmActionModal
                    opened={!!candidateToReject}
                    onClose={() => setCandidateToReject(null)}
                    onConfirm={handleConfirmReject}
                    title="Reject Candidate"
                    message={
                        <Text>
                            Are you sure you want to reject <strong>{candidateToReject?.name}</strong>?
                            <br /><br />
                            This will change their application status to REJECTED and they will be removed from the comparison.
                        </Text>
                    }
                    confirmLabel="Reject"
                    confirmColor="red"
                    confirmIcon={<IconX size={16} />}
                    isLoading={updateStatusMutation.isPending}
                />

                {/* Hire Confirmation Modal */}
                <ConfirmActionModal
                    opened={!!candidateToHire}
                    onClose={() => setCandidateToHire(null)}
                    onConfirm={handleConfirmHire}
                    title="Hire Candidate"
                    message={
                        <Text>
                            Are you sure you want to hire <strong>{candidateToHire?.name}</strong>?
                            <br /><br />
                            This will change their application status to HIRED.
                        </Text>
                    }
                    confirmLabel="Hire"
                    confirmColor="green"
                    confirmIcon={<IconCheck size={16} />}
                    isLoading={hireMutation.isPending}
                />
            </Container>
        );
    }

    // Selection View
    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2}>Compare Candidates</Title>
                        <Text c="dimmed" size="sm">Select candidates from a job offer to compare</Text>
                    </div>
                    <Group gap="sm">
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={handleClearSelection}
                            disabled={selectedCandidates.size === 0}
                            leftSection={<IconX size={16} />}
                        >
                            Clear Selection
                        </Button>
                        <Button
                            leftSection={<IconScale size={20} />}
                            disabled={selectedCandidates.size < 2}
                            onClick={handleCompare}
                        >
                            Compare Candidates
                        </Button>
                    </Group>
                </Group>

                {/* Job Offer Search */}
                <Paper p="md" withBorder>
                    <TextInput
                        placeholder="Search job offers by position..."
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        mb="md"
                    />

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                        {jobOffersData?.data.map((offer, index) => {
                            const bgColors = ['blue', 'teal', 'grape', 'orange', 'indigo', 'green', 'cyan', 'pink'];
                            const color = bgColors[index % bgColors.length];

                            return (
                                <Accordion
                                    key={offer.id}
                                    variant="separated"
                                    value={jobAccordionValue}
                                    onChange={handleAccordionChange}
                                    styles={{
                                        item: {
                                            backgroundColor: isDark
                                                ? `var(--mantine-color-${color}-light)`
                                                : `var(--mantine-color-${color}-light)`,
                                            borderColor: `var(--mantine-color-${color}-light-color)`,
                                        },
                                        control: {
                                            '&:hover': {
                                                backgroundColor: isDark
                                                    ? `var(--mantine-color-${color}-9)`
                                                    : `var(--mantine-color-${color}-1)`,
                                            }
                                        }
                                    }}
                                >
                                    <Accordion.Item value={offer.id}>
                                        <Accordion.Control>
                                            <Group justify="space-between" wrap="nowrap">
                                                <div>
                                                    <Text fw={500}>{offer.position}</Text>
                                                    <Text size="sm" c="dimmed">{offer.location}</Text>
                                                </div>
                                                <Badge>{offer.applicants_count} applicants</Badge>
                                            </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel style={{ position: 'relative', minHeight: 100 }}>
                                            <LoadingOverlay visible={isLoadingApps} />

                                            {filteredCandidates.length === 0 ? (
                                                <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                                                    No candidates with APPLIED or IN_PROGRESS status
                                                </Alert>
                                            ) : (
                                                <Stack gap="xs">
                                                    {filteredCandidates.map(application => (
                                                        <Paper
                                                            key={`${application.candidate.id}-${application.id}`}
                                                            p="sm"
                                                            withBorder
                                                            onClick={() => handleCandidateToggle(application.candidate.id)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = isDark
                                                                    ? 'var(--mantine-color-dark-6)'
                                                                    : 'var(--mantine-color-gray-0)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = '';
                                                            }}
                                                        >
                                                            <Group justify="space-between">
                                                                <Group>
                                                                    <Checkbox
                                                                        checked={selectedCandidates.has(application.candidate.id)}
                                                                        onChange={() => handleCandidateToggle(application.candidate.id)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <CandidateAvatar
                                                                        candidateId={application.candidate.id}
                                                                        firstName={application.candidate.user.first_name}
                                                                        lastName={application.candidate.user.last_name}
                                                                        radius="xl"
                                                                    />
                                                                    <div>
                                                                        <Text fw={500}>
                                                                            {application.candidate.user.first_name} {application.candidate.user.last_name}
                                                                        </Text>
                                                                        <Text size="xs" c="dimmed">{application.candidate.user.email}</Text>
                                                                    </div>
                                                                </Group>
                                                                <Badge color={getApplicationStatusColor(application.status)} variant="light">
                                                                    {application.status}
                                                                </Badge>
                                                            </Group>
                                                        </Paper>
                                                    ))}
                                                </Stack>
                                            )}
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>
                            );
                        })}
                    </SimpleGrid>

                    {isLoadingJobs && (
                        <Text ta="center" c="dimmed" py="md">Loading job offers...</Text>
                    )}

                    {!isLoadingJobs && jobOffersData?.data.length === 0 && (
                        <Text ta="center" c="dimmed" py="md">No job offers found</Text>
                    )}
                </Paper>

            </Stack>
        </Container>
    );
}
