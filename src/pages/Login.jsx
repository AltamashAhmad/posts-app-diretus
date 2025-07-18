import { TextInput, PasswordInput, Button, Container, Group, Anchor, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    }
  });

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);
      const token = await login(values.email, values.password);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          disabled={loading}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          label="Password"
          placeholder="Your password"
          disabled={loading}
          {...form.getInputProps('password')}
        />
        <Group justify="space-between" mt="md">
          <Anchor component={Link} to="/signup" size="sm">
            Don't have an account? Register
          </Anchor>
          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default Login; 