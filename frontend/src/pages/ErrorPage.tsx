import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  let errorMessage = 'An unexpected error has occurred.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || 'Page not found';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Container className="py-20">
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Title order={1}>{errorStatus}</Title>
        <Title order={2} mt="md">Something went wrong</Title>
        <Text c="dimmed" size="lg" mt="md">
          {errorMessage}
        </Text>
        <Group justify="center" mt="xl">
          <Button variant="outline" size="md" onClick={() => navigate('/')}>
            Take me back to home page
          </Button>
        </Group>
      </div>
    </Container>
  );
}
