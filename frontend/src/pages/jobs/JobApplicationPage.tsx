import { Container, Title, Text, Button, Stack, Paper } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';

export const JobApplicationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <Container size="sm" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="lg">
          <IconCheck size={64} color="green" />
          <Title order={2} ta="center">Application Page</Title>
          <Text ta="center" c="dimmed">
            This is a placeholder page for job application.
            <br />
            Job ID: {id}
            <br />
            The full application flow will be implemented soon.
          </Text>
          <Button onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
