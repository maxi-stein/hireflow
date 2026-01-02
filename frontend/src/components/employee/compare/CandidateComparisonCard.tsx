import {
    Card,
    Stack,
    Group,
    Text,
    Badge,
    Button,
    Accordion,
    LoadingOverlay,
    Paper,
    Grid
} from '@mantine/core';
import { IconX, IconCalendarEvent, IconDownload } from '@tabler/icons-react';
import { useCandidateQuery } from '../../../hooks/api/useCandidates';
import { useCandidateInterviewsQuery } from '../../../hooks/api/useInterviews';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { CandidateAvatar } from '../../shared/CandidateAvatar';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';

interface CandidateComparisonCardProps {
    application: CandidateApplication;
    onReject: (application: CandidateApplication) => void;
    onScheduleInterview: (applicationId: string) => void;
    getStatusColor: (status: ApplicationStatus) => string;
}

export function CandidateComparisonCard({
    application,
    onReject,
    onScheduleInterview,
    getStatusColor
}: CandidateComparisonCardProps) {
    const { data: candidateProfile, isLoading: isLoadingProfile } = useCandidateQuery(application.candidate.id);
    const { data: interviewsData, isLoading: isLoadingInterviews } = useCandidateInterviewsQuery(application.candidate.id);

    const interviews = interviewsData?.data?.filter(i =>
        i.applications.some(app => app.id === application.id)
    ).sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()) || [];

    const isLoading = isLoadingProfile || isLoadingInterviews;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} />
            <Stack gap="md">
                {/* Header with Avatar */}
                <Group>
                    <CandidateAvatar
                        candidateId={application.candidate.id}
                        firstName={application.candidate.user.first_name}
                        lastName={application.candidate.user.last_name}
                        size="lg"
                        radius="xl"
                    />
                    <div style={{ flex: 1 }}>
                        <Text fw={700} size="lg">
                            {application.candidate.user.first_name} {application.candidate.user.last_name}
                        </Text>
                        <Text size="sm" c="dimmed">{application.candidate.user.email}</Text>
                        {candidateProfile?.phone && (
                            <Text size="xs" c="dimmed">{candidateProfile.phone}</Text>
                        )}
                    </div>
                </Group>

                <Badge color={getStatusColor(application.status)} variant="light" w="fit-content">
                    {application.status}
                </Badge>

                {/* Interviews & Reviews Display */}
                <CandidateInterviewsDisplay
                    interviews={interviews}
                    applicationId={application.id}
                />

                {/* Candidate Details Accordion */}
                <Accordion
                    variant="separated"
                    multiple
                    defaultValue={['skills']}
                >
                    {/* Skill Answers - Most Important */}
                    {application.skill_answers && application.skill_answers.length > 0 && (
                        <Accordion.Item value="skills">
                            <Accordion.Control>Skills & Experience Answers</Accordion.Control>
                            <Accordion.Panel>
                                <Grid gutter="xs">
                                    {application.skill_answers.map(answer => {
                                        const isLong = answer.job_offer_skill.skill_name.length > 10;
                                        return (
                                            <Grid.Col key={answer.id} span={isLong ? 12 : 6}>
                                                <Paper p="xs" withBorder>
                                                    <Group justify="space-between" wrap="nowrap" gap="xs">
                                                        <Text fw={600} size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {answer.job_offer_skill.skill_name}
                                                        </Text>
                                                        <Badge variant="light" color="blue" size="xs" style={{ flexShrink: 0 }}>
                                                            {answer.years_of_experience} {answer.years_of_experience === 1 ? 'year' : 'years'}
                                                        </Badge>
                                                    </Group>
                                                </Paper>
                                            </Grid.Col>
                                        );
                                    })}
                                </Grid>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )}

                    <Accordion.Item value="experience">
                        <Accordion.Control>Work Experience</Accordion.Control>
                        <Accordion.Panel>
                            {candidateProfile?.work_experiences && candidateProfile.work_experiences.length > 0 ? (
                                <Stack gap="md">
                                    {candidateProfile.work_experiences.map(exp => (
                                        <div key={exp.id}>
                                            <Text fw={600} size="sm">{exp.position}</Text>
                                            <Text size="sm" c="dimmed">{exp.company_name}</Text>
                                            <Text size="xs" c="dimmed">
                                                {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                                            </Text>
                                            {exp.description && (
                                                <Text size="sm" mt="xs">{exp.description}</Text>
                                            )}
                                        </div>
                                    ))}
                                </Stack>
                            ) : (
                                <Text size="sm" c="dimmed">No work experience data available</Text>
                            )}
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="education">
                        <Accordion.Control>Education</Accordion.Control>
                        <Accordion.Panel>
                            {candidateProfile?.educations && candidateProfile.educations.length > 0 ? (
                                <Stack gap="md">
                                    {candidateProfile.educations.map(edu => (
                                        <div key={edu.id}>
                                            <Text fw={600} size="sm">{edu.degree_type} - {edu.field_of_study}</Text>
                                            <Text size="sm" c="dimmed">{edu.institution}</Text>
                                            <Text size="xs" c="dimmed">
                                                {new Date(edu.start_date).toLocaleDateString()} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'}
                                            </Text>
                                            {edu.description && (
                                                <Text size="sm" mt="xs">{edu.description}</Text>
                                            )}
                                        </div>
                                    ))}
                                </Stack>
                            ) : (
                                <Text size="sm" c="dimmed">No education data available</Text>
                            )}
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="info">
                        <Accordion.Control>Additional Info</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="xs">
                                {candidateProfile?.age && (
                                    <Text size="sm"><strong>Age:</strong> {candidateProfile.age}</Text>
                                )}
                                {candidateProfile?.city && candidateProfile?.country && (
                                    <Text size="sm"><strong>Location:</strong> {candidateProfile.city}, {candidateProfile.country}</Text>
                                )}
                                {candidateProfile?.linkedin && (
                                    <Text size="sm">
                                        <strong>LinkedIn:</strong>{' '}
                                        <a href={candidateProfile.linkedin} target="_blank" rel="noopener noreferrer">
                                            Profile
                                        </a>
                                    </Text>
                                )}
                                {candidateProfile?.github && (
                                    <Text size="sm">
                                        <strong>GitHub:</strong>{' '}
                                        <a href={candidateProfile.github} target="_blank" rel="noopener noreferrer">
                                            Profile
                                        </a>
                                    </Text>
                                )}
                                {!candidateProfile?.age && !candidateProfile?.city && !candidateProfile?.linkedin && !candidateProfile?.github && (
                                    <Text size="sm" c="dimmed">No additional information available</Text>
                                )}
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                {/* Action Buttons */}
                <Stack gap="xs">
                    <Button
                        leftSection={<IconCalendarEvent size={16} />}
                        variant="filled"
                        fullWidth
                        onClick={() => onScheduleInterview(application.id)}
                    >
                        Schedule Interview
                    </Button>
                    <Button
                        leftSection={<IconX size={16} />}
                        variant="light"
                        color="red"
                        fullWidth
                        onClick={() => onReject(application)}
                    >
                        Reject Candidate
                    </Button>
                    <Button
                        leftSection={<IconDownload size={16} />}
                        variant="subtle"
                        fullWidth
                        disabled
                    >
                        Download CV
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
}
