import { API_URL, ENDPOINTS } from '../config';

export async function getPosts() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.POSTS}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to fetch posts');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function createPost(title, content) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.POSTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create post');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
} 