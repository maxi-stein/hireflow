import { useState, useEffect, useCallback } from 'react';
import { Container, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import { useMantineColorScheme } from '@mantine/core';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { CompareSelectionHeader } from '../../components/employee/compare/CompareSelectionHeader';
import { JobOfferSearchPanel } from '../../components/employee/compare/JobOfferSearchPanel';
import { ComparisonView } from '../../components/employee/compare/ComparisonView';
import { useCandidateTechExperience } from '../../hooks/useCandidateTechExperience';
import { APP_MAX_WIDTH } from '../../constants/layout';


export function CompareCandidatesPage() {
    const [searchParams] = useSearchParams();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    // Job offer search state
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 500);

    // Selected job offer state
    const [selectedJobOfferId, setSelectedJobOfferId] = useState<string | null>(null);

    // Selected candidates for comparison
    const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

    // View state (selection vs comparison)
    const [showComparison, setShowComparison] = useState(false);

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

    const selectedJobOffer = jobOffersData?.data?.find(job => job.id === selectedJobOfferId);

    // Calculate tech stats across all filtered candidates (historical max for this job offer)
    const techStats = useCandidateTechExperience(filteredCandidates);

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

    const handleRemoveCandidate = useCallback((candidateId: string) => {
        setSelectedCandidates(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(candidateId);
            return newSelected;
        });
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

    // ========== COMPARISON VIEW ==========
    if (showComparison) {
        return (
            <ComparisonView
                candidatesToCompare={candidatesToCompare}
                selectedJobOffer={selectedJobOffer}
                onBack={handleBackToSelection}
                onRemoveCandidate={handleRemoveCandidate}
                techStats={techStats}
            />
        );
    }

    // ========== SELECTION VIEW ==========
    return (
        <Container size={APP_MAX_WIDTH} py="xl">
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
