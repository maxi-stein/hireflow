
import { useState } from 'react';
import { Paper, Title, Button, Group, Stack, Text, Modal, TextInput, Textarea, Checkbox, ActionIcon, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { Education } from '../../services/education.service';
import { educationService, DegreeType } from '../../services/education.service';
import dayjs from 'dayjs';
import { validateWithJoi } from '../../utils/form-validation';
import { educationSchema } from '../../schemas/profile.schema';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';

interface EducationSectionProps {
    candidateId: string;
    educationList: Education[];
    onUpdate: () => void;
}

export const EducationSection = ({ candidateId, educationList, onUpdate }: EducationSectionProps) => {
    const [opened, setOpened] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Delete confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            institution: '',
            degree_type: '',
            field_of_study: '',
            start_date: null as Date | null,
            end_date: null as Date | null,
            description: '',
        },
        validate: validateWithJoi(educationSchema),
    });

    // Open modal for creating or editing education
    const handleOpen = (education?: Education) => {
        //If editing
        if (education) {
            setEditingId(education.id);
            form.setValues({
                institution: education.institution,
                degree_type: education.degree_type,
                field_of_study: education.field_of_study,
                start_date: education.start_date ? new Date(education.start_date) : null,
                end_date: education.end_date ? new Date(education.end_date) : null,
                description: education.description || '',
            });
        } else {
            //If creating
            setEditingId(null);
            form.reset();
        }
        //Open modal
        setOpened(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            // Ensure dates are Date objects
            if (!values.start_date) {
                throw new Error('Start date is required');
            }

            const startDate = values.start_date instanceof Date ? values.start_date : new Date(values.start_date);
            const endDate = values.end_date ? (values.end_date instanceof Date ? values.end_date : new Date(values.end_date)) : null;

            const payload = {
                institution: values.institution,
                degree_type: values.degree_type as DegreeType,
                field_of_study: values.field_of_study,
                start_date: startDate.toISOString(),
                end_date: endDate?.toISOString() || null,
                description: values.description,
            }

            if (editingId) {
                // Update: don't send candidate_id or current
                await educationService.update(editingId, payload);
                notifications.show({ title: 'Success', message: 'Education updated', color: 'green' });
            } else {
                // Create: include candidate_id
                await educationService.create(candidateId, payload);
                notifications.show({ title: 'Success', message: 'Education added', color: 'green' });
            }
            onUpdate();
            setOpened(false);
        } catch (error) {
            console.error('Error saving education:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save education';
            notifications.show({ title: 'Error', message: errorMessage, color: 'red' });
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
            await educationService.delete(itemToDelete);

            notifications.show({ title: 'Success', message: 'Education deleted', color: 'green' });
            onUpdate();
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to delete education', color: 'red' });
        }
    };

    return (
        <Paper withBorder shadow="sm" p="lg" radius="md">
            <Group justify="space-between" mb="md">
                <Title order={3}>Education</Title>
                <Button leftSection={<IconPlus size={16} />} variant="light" onClick={() => handleOpen()}>
                    Add Education
                </Button>
            </Group>

            <Stack gap="md">
                {educationList.map((edu) => (
                    <Paper key={edu.id} withBorder p="md" radius="sm">
                        <Group justify="space-between" align="flex-start">
                            <div>
                                <Text fw={700} size="lg">{edu.institution}</Text>
                                <Text fw={500}>{edu.degree_type} - {edu.field_of_study}</Text>
                                <Text size="sm" c="dimmed">
                                    {dayjs(edu.start_date).format('MMM YYYY')} -{' '}
                                    {!edu.end_date ? 'Present' : dayjs(edu.end_date).format('MMM YYYY')}
                                </Text>
                                {edu.description && <Text mt="xs" size="sm">{edu.description}</Text>}
                            </div>
                            <Group gap="xs">
                                <ActionIcon variant="subtle" color="blue" onClick={() => handleOpen(edu)}>
                                    <IconPencil size={16} />
                                </ActionIcon>
                                <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(edu.id)}>
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>
                    </Paper>
                ))}
            </Stack>

            <Modal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Education' : 'Add Education'}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput label="Institution" required {...form.getInputProps('institution')} />
                        <Select
                            label="Degree Type"
                            placeholder="Select degree type"
                            data={Object.values(DegreeType)}
                            required
                            {...form.getInputProps('degree_type')}
                        />
                        <TextInput label="Field of Study" required {...form.getInputProps('field_of_study')} />
                        <Group grow>
                            <DateInput label="Start Date" required {...form.getInputProps('start_date')} />
                            <DateInput
                                label="End Date"
                                disabled={form.values.end_date === null}
                                {...form.getInputProps('end_date')}
                            />
                        </Group>
                        <Checkbox
                            label="I am currently studying here"
                            checked={form.values.end_date === null}
                            onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                form.setFieldValue('end_date', checked ? null : new Date());
                            }}
                        />
                        <Textarea label="Description" {...form.getInputProps('description')} />
                        <Button type="submit" loading={loading}>Save</Button>
                    </Stack>
                </form>
            </Modal>

            <DeleteConfirmationModal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Education"
                message="Are you sure you want to delete this education entry? This action cannot be undone."
            />
        </Paper >
    );
};
