import { API_URL, ENDPOINTS } from '../config';

export async function getComments(postId) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.COMMENTS}?filter[post][_eq]=${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to fetch comments');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function createComment(content, postId) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.COMMENTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        post: postId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create comment');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
} 