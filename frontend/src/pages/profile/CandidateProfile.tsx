
import { useState } from 'react';
import { Paper, Title, Grid, TextInput, Button, Group, Stack, FileButton, Text, Divider, NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconBrandGithub, IconBrandLinkedin, IconMapPin, IconPhone, IconWorld, IconEye } from '@tabler/icons-react';
import type { User } from '../../types/models/user.types';
import { candidateService } from '../../services/candidate.service';
import { fileService } from '../../services/file.service';
import { queryClient } from '../../services/queryClient';
import { FILES_QUERY_KEY } from '../../hooks/api/useUserFiles';
import { WorkExperienceSection } from '../../components/profile/WorkExperienceSection';
import { EducationSection } from '../../components/profile/EducationSection';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';
import { CandidateAvatar } from '../../components/shared/candidate-display/CandidateAvatar';
import { ProfileTwoColumnLayout } from '../../components/profile/ProfileTwoColumnLayout';

interface CandidateProfileProps {
    user: User;
    refreshProfile: () => void;
}

export const CandidateProfile = ({ user, refreshProfile }: CandidateProfileProps) => {
    const { t } = useTranslation('profile');
    const { candidate } = user;
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingCV, setUploadingCV] = useState(false);
    const [loading, setLoading] = useState(false);


    const form = useForm({
        initialValues: {
            phone: candidate?.phone || '',
            city: candidate?.city || '',
            country: candidate?.country || '',
            github: candidate?.github || '',
            linkedin: candidate?.linkedin || '',
            age: candidate?.age || '',
        },
    });

    const handleUpdateProfile = async (values: typeof form.values) => {
        if (!candidate?.id) return;
        setLoading(true);
        try {
            await candidateService.update(candidate.id, {
                ...values,
                age: values.age ? Number(values.age) : undefined,
            });
            notifications.show({ title: t('candidate.notifications.successTitle'), message: t('candidate.notifications.profileUpdated'), color: 'green' });
            refreshProfile();
        } catch (error) {
            notifications.show({ title: t('candidate.notifications.errorTitle'), message: t('candidate.notifications.updateFailed'), color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const cvFile = candidate?.files?.find(f => f.file_type === 'cv');

    const handlePhotoUpload = async (file: File | null) => {
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            notifications.show({
                title: t('candidate.notifications.errorTitle'),
                message: t('candidate.notifications.fileTooLarge'),
                color: 'red',
            });
            return;
        }
        setUploadingPhoto(true);
        try {
            await fileService.uploadProfilePicture(file);
            // Invalidate the files query so CandidateAvatar refetches the new photo
            queryClient.invalidateQueries({ queryKey: [...FILES_QUERY_KEY, 'candidate', candidate?.id] });
            notifications.show({ title: t('candidate.notifications.successTitle'), message: t('candidate.notifications.picitureUploaded'), color: 'green' });
            refreshProfile();
        } catch (error) {
            notifications.show({ title: t('candidate.notifications.errorTitle'), message: t('candidate.notifications.uploadPhotoFailed'), color: 'red' });
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleCVUpload = async (file: File | null) => {
        if (!file) return;
        setUploadingCV(true);
        try {
            await fileService.uploadCV(file);
            notifications.show({ title: t('candidate.notifications.successTitle'), message: t('candidate.notifications.cvUploaded'), color: 'green' });
            refreshProfile();
        } catch (error) {
            notifications.show({ title: t('candidate.notifications.errorTitle'), message: t('candidate.notifications.uploadCvFailed'), color: 'red' });
        } finally {
            setUploadingCV(false);
        }
    };

    const handleViewCV = async () => {
        if (!cvFile) return;
        try {
            const blob = await fileService.downloadFile(cvFile.id);
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            notifications.show({ title: t('candidate.notifications.errorTitle'), message: t('candidate.notifications.openCvFailed'), color: 'red' });
        }
    };

    return (
        <Stack gap="xl">
            {/* Basic Info & Photo */}
            <Paper withBorder shadow="sm" p="lg" radius="md">
                <Group justify="space-between" align="flex-start" mb="lg">
                    <Group align="flex-start">
                        <Stack align="center" gap="xs">
                            <CandidateAvatar
                                candidateId={candidate?.id}
                                firstName={user.first_name}
                                lastName={user.last_name}
                            />
                            <FileButton onChange={handlePhotoUpload} accept="image/png,image/jpeg,image/jpg,image/webp" >
                                {(props) => <Button variant="subtle" size="xs" loading={uploadingPhoto} {...props}>{t('candidate.changePhoto')}</Button>}
                            </FileButton>
                        </Stack>
                        <Stack gap={0}>
                            <Title order={2}>{user.first_name} {user.last_name}</Title>
                            <Text c="dimmed">{user.email}</Text>
                            <Group gap="xs" mt="xs">
                                {candidate?.city && candidate?.country && (
                                    <Group gap={4}>
                                        <IconMapPin size={16} color="gray" />
                                        <Text size="sm" c="gray">{candidate.city}, {candidate.country}</Text>
                                    </Group>
                                )}
                            </Group>
                        </Stack>
                    </Group>
                    <Stack align="flex-end">
                        {cvFile ? (
                            <Group>
                                <Button
                                    variant="light"
                                    leftSection={<IconEye size={16} />}
                                    onClick={handleViewCV}
                                >
                                    {t('candidate.viewResume')}
                                </Button>
                                <FileButton onChange={handleCVUpload} accept="application/pdf">
                                    {(props) => (
                                        <Button
                                            variant="outline"
                                            loading={uploadingCV}
                                            {...props}
                                        >
                                            {t('candidate.addNew')}
                                        </Button>
                                    )}
                                </FileButton>
                            </Group>
                        ) : (
                            <FileButton onChange={handleCVUpload} accept="application/pdf">
                                {(props) => (
                                    <Button
                                        leftSection={<IconUpload size={16} />}
                                        variant="outline"
                                        loading={uploadingCV}
                                        {...props}
                                    >
                                        {t('candidate.uploadResume')}
                                    </Button>
                                )}
                            </FileButton>
                        )}
                        <Text size="xs" c="dimmed">{t('candidate.resumeHint')}</Text>
                        {cvFile && <Text size="xs" c="dimmed">{t('candidate.currentResume', { fileName: cvFile.file_name })}</Text>}
                    </Stack>
                </Group>

                <ProfileTwoColumnLayout
                    leftTitle={t('candidate.personalInfo')}
                    leftContent={
                        <form onSubmit={form.onSubmit(handleUpdateProfile)}>
                            <Grid>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <TextInput
                                        label={t('candidate.phone')}
                                        leftSection={<IconPhone size={16} />}
                                        {...form.getInputProps('phone')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 3 }}>
                                    <NumberInput
                                        label={t('candidate.age')}
                                        min={16}
                                        max={120}
                                        clampBehavior="strict"
                                        {...form.getInputProps('age')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <TextInput
                                        label={t('candidate.city')}
                                        leftSection={<IconWorld size={16} />}
                                        {...form.getInputProps('city')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <TextInput
                                        label={t('candidate.country')}
                                        leftSection={<IconWorld size={16} />}
                                        {...form.getInputProps('country')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <TextInput
                                        label={t('candidate.github')}
                                        leftSection={<IconBrandGithub size={16} />}
                                        placeholder="https://github.com/username"
                                        {...form.getInputProps('github')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <TextInput
                                        label={t('candidate.linkedin')}
                                        leftSection={<IconBrandLinkedin size={16} />}
                                        placeholder="https://linkedin.com/in/username"
                                        {...form.getInputProps('linkedin')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Group justify="flex-end">
                                        <Button type="submit" loading={loading}>{t('candidate.saveChanges')}</Button>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                        </form>
                    }
                    rightTitle={t('password.title', 'Cambiar Contraseña')}
                    rightContent={<ChangePasswordForm withPaper={false} />}
                />
            </Paper>

            {/* Work Experience */}
            {candidate?.id && (
                <WorkExperienceSection
                    candidateId={candidate.id}
                    experiences={candidate.work_experiences || []}
                    onUpdate={refreshProfile}
                />
            )}

            {/* Education */}
            {candidate?.id && (
                <EducationSection
                    candidateId={candidate.id}
                    educationList={candidate.educations || []}
                    onUpdate={refreshProfile}
                />
            )}

        </Stack>
    );
};
