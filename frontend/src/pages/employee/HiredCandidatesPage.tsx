import { Container, Title, Text, Table, Paper, Group, Badge, LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { CandidateAvatar } from '../../components/shared/candidate-display/CandidateAvatar';
import { getApplicationStatusColor } from '../../utils/application.utils';
import { useTranslation } from 'react-i18next';
import { APP_MAX_WIDTH } from '../../constants/layout';

export function HiredCandidatesPage() {
  const { t } = useTranslation(['candidates', 'profile', 'applications']);
  const navigate = useNavigate();
  const { data: hiredApplications, isLoading } = useAllCandidateApplicationsQuery({
    status: [ApplicationStatus.HIRED],
    limit: 100 // Fetch enough hired candidates
  });

  const handleRowClick = (candidateId: string) => {
    navigate(`/manage/candidates/list/${candidateId}`);
  };

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Title order={2} mb="md">{t('hired.title', { ns: 'candidates' })}</Title>
      <Text c="dimmed" mb="xl">{t('hired.subtitle', { ns: 'candidates' })}</Text>

      <Paper withBorder radius="md" p="md" pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {hiredApplications?.data && hiredApplications.data.length > 0 ? (
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('list.table.candidate', { ns: 'candidates' })}</Table.Th>
                <Table.Th>{t('employee.position', { ns: 'profile' })}</Table.Th>
                <Table.Th>{t('hired.table.hiredDate', { ns: 'candidates' })}</Table.Th>
                <Table.Th>{t('table.headers.status', { ns: 'applications' })}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {hiredApplications.data.map((app) => (
                <Table.Tr
                  key={app.id}
                  onClick={() => handleRowClick(app.candidate.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Td>
                    <Group gap="sm">
                      <CandidateAvatar
                        candidateId={app.candidate.id}
                        firstName={app.candidate.user.first_name}
                        lastName={app.candidate.user.last_name}
                        size="md"
                      />
                      <div>
                        <Text size="sm" fw={500}>
                          {app.candidate.user.first_name} {app.candidate.user.last_name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {app.candidate.user.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{app.job_offer.position}</Text>
                    <Text size="xs" c="dimmed">{app.job_offer.location} • {app.job_offer.work_mode}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(app.updated_at).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getApplicationStatusColor(app.status)} variant="light">
                      {t('common:applicationStatus.' + app.status)}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          !isLoading && <Text c="dimmed" ta="center" py="xl">{t('hired.table.empty', { ns: 'candidates' })}</Text>
        )}
      </Paper>
    </Container>
  );
}
