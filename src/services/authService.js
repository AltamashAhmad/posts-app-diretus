import { API_URL, ENDPOINTS, USER_ROLE_ID } from '../config';

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Invalid email or password');
    }

    const data = await response.json();
    return data.data.access_token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signup(email, password) {
  try {
    // Get admin token
    const adminToken = await getAdminToken();

    // Create new user
    const createUserResponse = await fetch(`${API_URL}${ENDPOINTS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        email,
        password,
        role: USER_ROLE_ID,
        status: 'active',
      }),
    });

    if (!createUserResponse.ok) {
      const error = await createUserResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create user');
    }

    // Log in the new user
    return await login(email, password);
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

async function getAdminToken() {
  const response = await fetch(`${API_URL}${ENDPOINTS.AUTH.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: import.meta.env.VITE_DIRECTUS_EMAIL,
      password: import.meta.env.VITE_DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate admin');
  }

  const data = await response.json();
  return data.data.access_token;
} 