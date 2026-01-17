import { useState, useEffect, useCallback } from 'react';
import { Container, SimpleGrid, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMantineColorScheme } from '@mantine/core';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { useCandidateActions } from '../../hooks/useCandidateActions';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { CandidateComparisonCard } from '../../components/employee/compare/CandidateComparisonCard';
import { ComparisonViewHeader } from '../../components/employee/compare/ComparisonViewHeader';
import { CompareSelectionHeader } from '../../components/employee/compare/CompareSelectionHeader';
import { JobOfferSearchPanel } from '../../components/employee/compare/JobOfferSearchPanel';
import { CandidateActionModals } from '../../components/employee/common/CandidateActionModals';
import { getApplicationStatusColor } from '../../utils/application.utils';

export function CompareCandidatesPage() {
    const [searchParams] = useSearchParams();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const navigate = useNavigate();

    // Job offer search state
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 500);

    // Selected job offer state
    const [selectedJobOfferId, setSelectedJobOfferId] = useState<string | null>(null);

    // Selected candidates for comparison
    const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

    // View state (selection vs comparison)
    const [showComparison, setShowComparison] = useState(false);

    // Synchronized accordion state across comparison cards
    const [accordionValue, setAccordionValue] = useState<string[]>(['skills']);

    // Hook for candidate reject/hire actions with modal management
    const candidateActions = useCandidateActions({
        onRejectSuccess: (applicationId) => {
            // Remove rejected candidate from selection
            const rejectedApp = candidatesToCompare.find(app => app.id === applicationId);
            if (rejectedApp) {
                const newSelected = new Set(selectedCandidates);
                newSelected.delete(rejectedApp.candidate.id);
                setSelectedCandidates(newSelected);
            }
        },
        onHireSuccess: (applicationId) => {
            // Remove hired candidate from selection
            const hiredApp = candidatesToCompare.find(app => app.id === applicationId);
            if (hiredApp) {
                const newSelected = new Set(selectedCandidates);
                newSelected.delete(hiredApp.candidate.id);
                setSelectedCandidates(newSelected);
            }
        },
    });

    // Fetch job offers with search filter
    const { data: jobOffersData, isLoading: isLoadingJobs } = useJobOffersQuery({
        position: debouncedSearch || undefined,
        limit: 50,
    });

    // Fetch candidates for selected job offer
    const { data: applicationsData, isLoading: isLoadingApps } = useAllCandidateApplicationsQuery({
        job_offer_id: selectedJobOfferId || undefined,
        limit: 100,
    });

    // Filter candidates by status (only APPLIED or IN_PROGRESS for comparison)
    const filteredCandidates = applicationsData?.data?.filter(
        app => app.status === ApplicationStatus.APPLIED || app.status === ApplicationStatus.IN_PROGRESS
    ) || [];

    // Get selected candidate applications for comparison view
    const candidatesToCompare = filteredCandidates.filter(app =>
        selectedCandidates.has(app.candidate.id)
    );

    // Handle URL parameters for deep linking (jobOfferId and candidateId)
    useEffect(() => {
        const jobOfferId = searchParams.get('jobOfferId');
        const candidateId = searchParams.get('candidateId');

        if (jobOfferId) {
            setSelectedJobOfferId(jobOfferId);
        }

        if (candidateId) {
            setSelectedCandidates(new Set([candidateId]));
        }
    }, [searchParams]);

    // Memoized callback to toggle candidate selection
    const handleCandidateToggle = useCallback((candidateId: string) => {
        setSelectedCandidates(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(candidateId)) {
                newSelected.delete(candidateId);
            } else {
                newSelected.add(candidateId);
            }
            return newSelected;
        });
    }, []);

    // Clear all selected candidates
    const handleClearSelection = useCallback(() => {
        setSelectedCandidates(new Set());
    }, []);

    // Enter comparison view (requires 2+ candidates)
    const handleCompare = useCallback(() => {
        if (selectedCandidates.size >= 2) {
            setShowComparison(true);
        }
    }, [selectedCandidates.size]);

    // Return to selection view, preserving selections
    const handleBackToSelection = useCallback(() => {
        setShowComparison(false);
    }, []);

    // Handle job offer accordion change
    const handleJobSelect = useCallback((jobId: string | null) => {
        setSelectedJobOfferId(jobId);
    }, []);

    // Navigate to interviews page with application pre-selected
    const handleScheduleInterview = useCallback((applicationId: string) => {
        navigate(`/manage/interviews?applicationId=${applicationId}`);
    }, [navigate]);

    // Handlers for reject/hire modal actions
    const handleRejectClick = useCallback((application: any) => {
        candidateActions.handleRejectClick(
            application.id,
            `${application.candidate.user.first_name} ${application.candidate.user.last_name}`
        );
    }, [candidateActions]);

    const handleHireClick = useCallback((application: any) => {
        candidateActions.handleHireClick(
            application.id,
            `${application.candidate.user.first_name} ${application.candidate.user.last_name}`
        );
    }, [candidateActions]);

    // ========== COMPARISON VIEW ==========
    if (showComparison) {
        return (
            <Container size="xl" py="xl">
                {/* Header with candidate count and back button */}
                <ComparisonViewHeader
                    candidateCount={candidatesToCompare.length}
                    onBack={handleBackToSelection}
                />

                {/* Grid of candidate comparison cards */}
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

                {/* Reject and Hire confirmation modals */}
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
            </Container>
        );
    }

    // ========== SELECTION VIEW ==========
    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                {/* Header with selection count and action buttons */}
                <CompareSelectionHeader
                    selectedCount={selectedCandidates.size}
                    onClearSelection={handleClearSelection}
                    onCompare={handleCompare}
                />

                {/* Search panel with job offers and candidate selection */}
                <JobOfferSearchPanel
                    search={search}
                    onSearchChange={setSearch}
                    jobOffers={jobOffersData?.data || []}
                    selectedJobOfferId={selectedJobOfferId}
                    onJobSelect={handleJobSelect}
                    selectedCandidates={selectedCandidates}
                    onCandidateToggle={handleCandidateToggle}
                    isLoadingJobs={isLoadingJobs}
                    isLoadingApps={isLoadingApps}
                    filteredCandidates={filteredCandidates}
                    isDark={isDark}
                />
            </Stack>
        </Container>
    );
}
