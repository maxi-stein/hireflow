
import { useState } from 'react';
import { Paper, Title, Button, Group, Stack, Text, Modal, TextInput, Textarea, Checkbox, ActionIcon, Timeline } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { IconPlus, IconPencil, IconTrash, IconBriefcase } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { WorkExperience } from '../../services/work-experience.service';
import { workExperienceService } from '../../services/work-experience.service';
import dayjs from 'dayjs';
import { validateWithJoi } from '../../utils/form-validation';
import { workExperienceSchema } from '../../schemas/profile.schema';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';

interface WorkExperienceSectionProps {
    candidateId: string;
    experiences: WorkExperience[];
    onUpdate: () => void;
}

export const WorkExperienceSection = ({ candidateId, experiences, onUpdate }: WorkExperienceSectionProps) => {
    const { t } = useTranslation(['profile', 'common']);
    const [opened, setOpened] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Delete confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            company: '',
            position: '',
            description: '',
            start_date: null as Date | null,
            end_date: null as Date | null,
        },
        validate: validateWithJoi(workExperienceSchema),
    });

    const handleOpen = (experience?: WorkExperience) => {
        if (experience) {
            setEditingId(experience.id);
            form.setValues({
                company: experience.company_name,
                position: experience.position,
                description: experience.description,
                start_date: parseLocalDate(experience.start_date),
                end_date: parseLocalDate(experience.end_date),
            });
        } else {
            setEditingId(null);
            form.reset();
        }
        setOpened(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            if (!values.start_date) {
                throw new Error('Start date is required');
            }

            const payload = {
                company_name: values.company,
                position: values.position,
                description: values.description,
                start_date: formatLocalDate(values.start_date)!,
                end_date: formatLocalDate(values.end_date) || null,
            };

            if (editingId) {
                await workExperienceService.update(editingId, payload);
                notifications.show({ title: t('candidate.notifications.successTitle'), message: t('experience.notifications.updated'), color: 'green' });
            } else {
                await workExperienceService.create(candidateId, payload);
                notifications.show({ title: t('candidate.notifications.successTitle'), message: t('experience.notifications.added'), color: 'green' });
            }
            onUpdate();
            setOpened(false);
        } catch (error) {
            console.error('Error saving work experience:', error);
            const errorMessage = error instanceof Error ? error.message : t('experience.notifications.failedSave');
            notifications.show({ title: t('candidate.notifications.errorTitle'), message: errorMessage, color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            await workExperienceService.delete(itemToDelete);

            notifications.show({ title: t('candidate.notifications.successTitle'), message: t('experience.notifications.deleted'), color: 'green' });
            onUpdate();
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            notifications.show({ title: t('candidate.notifications.errorTitle'), message: t('experience.notifications.failedDelete'), color: 'red' });
        }
    };

    return (
        <Paper withBorder shadow="sm" p="xl" radius="md">
            <Group justify="space-between" mb="md">
                <Title order={3}>{t('experience.title')}</Title>
                <Button leftSection={<IconPlus size={16} />} variant="light" onClick={() => handleOpen()}>
                    {t('experience.add')}
                </Button>
            </Group>

            {experiences.length > 0 && (
                <Timeline active={experiences.length} bulletSize={32} lineWidth={2} pl="xs" pt="sm">
                    {[...experiences].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()).map((exp) => (
                        <Timeline.Item
                            key={exp.id}
                            bullet={<IconBriefcase size={16} />}
                            title={
                                <Group justify="space-between" align="flex-start" wrap="nowrap" w="100%">
                                    <Text fw={700} size="md">{exp.position}</Text>
                                    <Group gap={0}>
                                        <ActionIcon variant="subtle" color="blue" onClick={() => handleOpen(exp)}>
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(exp.id)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            }
                        >
                            <Text fw={500} size="sm" mt={2}>{exp.company_name}</Text>
                            <Text size="xs" c="dimmed" mt={4}>
                                {dayjs(exp.start_date).format('MMM YYYY')} -{' '}
                                {!exp.end_date ? t('experience.present') : dayjs(exp.end_date).format('MMM YYYY')}
                            </Text>
                            {exp.description && (
                                <Text mt="xs" size="sm" c="dark.2">{exp.description}</Text>
                            )}
                        </Timeline.Item>
                    ))}
                </Timeline>
            )}

            <Modal opened={opened} onClose={() => setOpened(false)} title={editingId ? t('experience.edit') : t('experience.add')}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput label={t('experience.company')} required {...form.getInputProps('company')} />
                        <TextInput label={t('experience.position')} required {...form.getInputProps('position')} />
                        <Textarea label={t('experience.description')} {...form.getInputProps('description')} />
                        <Group grow>
                            <DateInput label={t('experience.startDate')} required {...form.getInputProps('start_date')} />
                            <DateInput
                                label={t('experience.endDate')}
                                disabled={form.values.end_date === null}
                                {...form.getInputProps('end_date')}
                            />
                        </Group>
                        <Checkbox
                            label={t('experience.current')}
                            checked={form.values.end_date === null}
                            onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                form.setFieldValue('end_date', checked ? null : new Date());
                            }}
                        />
                        <Button type="submit" loading={loading}>{t('common:actions.save')}</Button>
                    </Stack>
                </form>
            </Modal>

            <DeleteConfirmationModal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={t('experience.deleteTitle')}
                message={t('experience.deleteMessage')}
            />
        </Paper >
    );
};
