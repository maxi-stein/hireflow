import { Container, Title, Text, Table, Paper, Group, Badge, LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { CandidateAvatar } from '../../components/shared/CandidateAvatar';
import { getApplicationStatusColor } from '../../utils/application.utils';

export function HiredCandidatesPage() {
  const navigate = useNavigate();
  const { data: hiredApplications, isLoading } = useAllCandidateApplicationsQuery({
    status: [ApplicationStatus.HIRED],
    limit: 100 // Fetch enough hired candidates
  });

  const handleRowClick = (candidateId: string) => {
    navigate(`/manage/candidates/${candidateId}`);
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">Hired Candidates</Title>
      <Text c="dimmed" mb="xl">List of all candidates who have been hired and their respective positions.</Text>

      <Paper withBorder radius="md" p="md" pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {hiredApplications?.data && hiredApplications.data.length > 0 ? (
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Candidate</Table.Th>
                <Table.Th>Position</Table.Th>
                <Table.Th>Hired Date</Table.Th>
                <Table.Th>Status</Table.Th>
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
                      {app.status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          !isLoading && <Text c="dimmed" ta="center" py="xl">No hired candidates found.</Text>
        )}
      </Paper>
    </Container>
  );
}
