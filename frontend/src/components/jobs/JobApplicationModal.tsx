
import { Modal, Button, Text, Stack, NumberInput, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { JobOffer } from '../../services/job-offer.service';
import { candidateApplicationService } from '../../services/candidate-application.service';

interface JobApplicationModalProps {
    opened: boolean;
    onClose: () => void;
    jobOffer: JobOffer;
    candidateId: string;
    onSuccess: () => void;
}

export const JobApplicationModal = ({ opened, onClose, jobOffer, candidateId, onSuccess }: JobApplicationModalProps) => {
    const { t } = useTranslation(['applications', 'common']);
    const [submitting, setSubmitting] = useState(false);

    // Dynamic initial values based on skills
    const initialValues: Record<string, number> = {};
    jobOffer.skills.forEach(skill => {
        initialValues[skill.id] = 0;
    });

    const form = useForm({
        initialValues,
        validate: (values) => {
            const errors: Record<string, string> = {};
            jobOffer.skills.forEach(skill => {
                if (values[skill.id] === undefined || values[skill.id] === null || values[skill.id] < 0) {
                    errors[skill.id] = t('applications:modal.validationError');
                }
            });
            return errors;
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setSubmitting(true);
        try {
            const skillAnswers = Object.entries(values).map(([skillId, years]) => ({
                job_offer_skill_id: skillId,
                years_of_experience: years,
            }));

            await candidateApplicationService.create({
                candidate_id: candidateId,
                job_offer_id: jobOffer.id,
                skill_answers: skillAnswers,
            });

            notifications.show({
                title: t('applications:modal.successTitle'),
                message: t('applications:modal.successMessage'),
                color: 'green',
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            notifications.show({
                title: t('applications:modal.errorTitle'),
                message: error.response?.data?.message || t('applications:modal.errorMessage'),
                color: 'red',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title={t('applications:modal.title', { position: jobOffer.position })} size="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Text size="sm" c="dimmed">
                        {t('applications:modal.description')}
                    </Text>

                    {jobOffer.skills.map((skill) => (
                        <NumberInput
                            key={skill.id}
                            label={t('applications:modal.yearsOfExperience', { skill: skill.skill_name })}
                            min={0}
                            required
                            {...form.getInputProps(skill.id)}
                        />
                    ))}

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={onClose}>{t('common:actions.cancel')}</Button>
                        <Button type="submit" loading={submitting}>{t('applications:modal.submit')}</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
