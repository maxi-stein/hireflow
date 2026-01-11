
import { useState, useEffect } from 'react';
import { Paper, Title, Grid, TextInput, Button, Group, Stack, Avatar, FileButton, Text, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconBrandGithub, IconBrandLinkedin, IconMapPin, IconPhone, IconWorld, IconEye } from '@tabler/icons-react';
import type { User } from '../../types/models/user.types';
import { candidateService } from '../../services/candidate.service';
import { fileService } from '../../services/file.service';
import { WorkExperienceSection } from '../../components/profile/WorkExperienceSection';
import { EducationSection } from '../../components/profile/EducationSection';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';

interface CandidateProfileProps {
    user: User;
    refreshProfile: () => void;
}

export const CandidateProfile = ({ user, refreshProfile }: CandidateProfileProps) => {
    const { candidate } = user;
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingCV, setUploadingCV] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
            notifications.show({ title: 'Success', message: 'Profile updated', color: 'green' });
            refreshProfile();
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to update profile', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const profilePicture = candidate?.files?.find(f => f.file_type === 'profile_picture');
    const cvFile = candidate?.files?.find(f => f.file_type === 'cv');

    // We download the profile image as a Blob to bypass authentication issues with simple <img> tags.
    // The Backend requires a Bearer token which isn't sent with standard img src requests.
    // URL.createObjectURL creates a temporary local URL for the Blob.
    useEffect(() => {
        let objectUrl: string | null = null;
        if (profilePicture) {
            fileService.downloadFile(profilePicture.id).then(blob => {
                objectUrl = URL.createObjectURL(blob);
                setAvatarUrl(objectUrl);
            }).catch(() => {
                setAvatarUrl(null);
            });
        } else {
            setAvatarUrl(null);
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [profilePicture?.id]);

    const handlePhotoUpload = async (file: File | null) => {
        if (!file) return;
        setUploadingPhoto(true);
        try {
            await fileService.uploadProfilePicture(file);
            notifications.show({ title: 'Success', message: 'Profile picture uploaded', color: 'green' });
            refreshProfile();
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to upload photo', color: 'red' });
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleCVUpload = async (file: File | null) => {
        if (!file) return;
        setUploadingCV(true);
        try {
            await fileService.uploadCV(file);
            notifications.show({ title: 'Success', message: 'CV uploaded', color: 'green' });
            refreshProfile();
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to upload CV', color: 'red' });
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
            notifications.show({ title: 'Error', message: 'Failed to open CV', color: 'red' });
        }
    };

    return (
        <Stack gap="xl">
            {/* Basic Info & Photo */}
            <Paper withBorder shadow="sm" p="lg" radius="md">
                <Group justify="space-between" align="flex-start" mb="lg">
                    <Group align="flex-start">
                        <Stack align="center" gap="xs">
                            <Avatar
                                src={avatarUrl}
                                size={100}
                                radius={100}
                                color="blue"
                            >
                                {user.first_name[0]}{user.last_name[0]}
                            </Avatar>
                            <FileButton onChange={handlePhotoUpload} accept="image/png,image/jpeg">
                                {(props) => <Button variant="subtle" size="xs" loading={uploadingPhoto} {...props}>Change Photo</Button>}
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
                                    View Resume
                                </Button>
                                <FileButton onChange={handleCVUpload} accept="application/pdf">
                                    {(props) => (
                                        <Button
                                            variant="outline"
                                            loading={uploadingCV}
                                            {...props}
                                        >
                                            Add new
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
                                        Upload Resume
                                    </Button>
                                )}
                            </FileButton>
                        )}
                        <Text size="xs" c="dimmed">PDF, max 5MB</Text>
                        {cvFile && <Text size="xs" c="dimmed">Current: {cvFile.file_name}</Text>}
                    </Stack>
                </Group>

                <Divider my="md" label="Personal Information" labelPosition="center" />

                <form onSubmit={form.onSubmit(handleUpdateProfile)}>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Phone"
                                leftSection={<IconPhone size={16} />}
                                {...form.getInputProps('phone')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Age"
                                type="number"
                                {...form.getInputProps('age')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="City"
                                leftSection={<IconWorld size={16} />}
                                {...form.getInputProps('city')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Country"
                                leftSection={<IconWorld size={16} />}
                                {...form.getInputProps('country')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="GitHub URL"
                                leftSection={<IconBrandGithub size={16} />}
                                placeholder="https://github.com/username"
                                {...form.getInputProps('github')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="LinkedIn URL"
                                leftSection={<IconBrandLinkedin size={16} />}
                                placeholder="https://linkedin.com/in/username"
                                {...form.getInputProps('linkedin')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Group justify="flex-end">
                                <Button type="submit" loading={loading}>Save Changes</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </form>
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

            <ChangePasswordForm />
        </Stack>
    );
};
