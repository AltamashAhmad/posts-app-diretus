import { TextInput, PasswordInput, Button, Container, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import { useState } from 'react';

function SignUp() {
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
      const token = await signup(values.email, values.password);
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
        <Button 
          type="submit" 
          fullWidth 
          mt="xl"
          loading={loading}
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default SignUp; 