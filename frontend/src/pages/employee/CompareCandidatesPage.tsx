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
import { IconSearch, IconScale, IconAlertCircle, IconX } from '@tabler/icons-react';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAllCandidateApplicationsQuery, useUpdateApplicationStatusMutation } from '../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal';
import { useNavigate } from 'react-router-dom';
import { CandidateComparisonCard } from '../../components/employee/compare/CandidateComparisonCard';
import { CandidateAvatar } from '../../components/shared/CandidateAvatar';

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

    // Accordion open state
    const [accordionValue, setAccordionValue] = useState<string | null>(null);

    // Selected candidates for comparison
    const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

    // Comparison view active
    const [showComparison, setShowComparison] = useState(false);

    // Candidate to reject
    const [candidateToReject, setCandidateToReject] = useState<{ id: string; name: string } | null>(null);

    // Mutation for updating application status
    const updateStatusMutation = useUpdateApplicationStatusMutation();

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

    const uniqueCandidates = filteredCandidates;

    // Handle URL parameters for deep linking
    useEffect(() => {
        const jobOfferId = searchParams.get('jobOfferId');
        const candidateId = searchParams.get('candidateId');

        if (jobOfferId) {
            setSelectedJobOfferId(jobOfferId);
            setAccordionValue(jobOfferId);
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

    const handleCompare = () => {
        if (selectedCandidates.size >= 2) {
            setShowComparison(true);
        }
    };

    const handleBackToSelection = () => {
        setShowComparison(false);
        // Keep the accordion open with selections preserved
        if (selectedJobOfferId) {
            setAccordionValue(selectedJobOfferId);
        }
    };

    const handleAccordionChange = (value: string | null) => {
        setAccordionValue(value);
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

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.APPLIED:
                return 'gray';
            case ApplicationStatus.IN_PROGRESS:
                return 'blue';
            default:
                return 'gray';
        }
    };

    // Get selected candidate applications for comparison
    const candidatesToCompare = uniqueCandidates.filter(app =>
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

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    {candidatesToCompare.map(application => (
                        <CandidateComparisonCard
                            key={application.candidate.id}
                            application={application}
                            onReject={handleRejectClick}
                            onScheduleInterview={handleScheduleInterview}
                            getStatusColor={getStatusColor}
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
            </Container>
        );
    }

    // Selection View
    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <div>
                    <Title order={2}>Compare Candidates</Title>
                    <Text c="dimmed" size="sm">Select candidates from a job offer to compare</Text>
                </div>

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
                        {jobOffersData?.data.map(offer => (
                            <Accordion key={offer.id} variant="separated" value={accordionValue} onChange={handleAccordionChange}>
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

                                        {uniqueCandidates.length === 0 ? (
                                            <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                                                No candidates with APPLIED or IN_PROGRESS status
                                            </Alert>
                                        ) : (
                                            <Stack gap="xs">
                                                {uniqueCandidates.map(application => (
                                                    <Paper
                                                        key={application.candidate.id}
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
                                                            <Badge color={getStatusColor(application.status)} variant="light">
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
                        ))}
                    </SimpleGrid>

                    {isLoadingJobs && (
                        <Text ta="center" c="dimmed" py="md">Loading job offers...</Text>
                    )}

                    {!isLoadingJobs && jobOffersData?.data.length === 0 && (
                        <Text ta="center" c="dimmed" py="md">No job offers found</Text>
                    )}
                </Paper>

                {/* Compare Button - Sticky */}
                {selectedCandidates.size > 0 && (
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        withBorder
                        style={{
                            position: 'sticky',
                            bottom: 20,
                            zIndex: 100,
                            backgroundColor: 'var(--mantine-color-body)',
                        }}
                    >
                        <Group justify="center">
                            <Button
                                leftSection={<IconScale size={20} />}
                                size="lg"
                                disabled={selectedCandidates.size < 2}
                                onClick={handleCompare}
                            >
                                Compare {selectedCandidates.size} Candidate{selectedCandidates.size !== 1 ? 's' : ''}
                            </Button>
                        </Group>
                    </Paper>
                )}
            </Stack>
        </Container>
    );
}
