import { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Container, Group, Stack, Paper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { getPosts, createPost } from '../services/postService';
import { getComments, createComment } from '../services/commentService';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const postForm = useForm({
    initialValues: {
      title: '',
      content: '',
    }
  });

  const commentForm = useForm({
    initialValues: {
      content: '',
    }
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      // Load comments for each post
      fetchedPosts.forEach(post => loadComments(post.id));
    } catch (error) {
      setError('Failed to load posts');
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId) => {
    try {
      const fetchedComments = await getComments(postId);
      setComments(prev => ({
        ...prev,
        [postId]: fetchedComments
      }));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handlePostSubmit = async (values) => {
    try {
      const newPost = await createPost(values.title, values.content);
      setPosts([newPost, ...posts]);
      postForm.reset();
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    }
  };

  const handleCommentSubmit = async (postId, values) => {
    try {
      const newComment = await createComment(values.content, postId);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      commentForm.reset();
    } catch (error) {
      setError('Failed to create comment');
      console.error('Error creating comment:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <Container size="md" my={40}><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="md" my={40}>
      <Group justify="space-between" mb={30}>
        <Text size="xl" weight={500}>Dashboard</Text>
        <Button onClick={handleLogout} color="red">Logout</Button>
      </Group>

      {error && (
        <Paper p="md" mb="lg" bg="red.1">
          <Text c="red">{error}</Text>
        </Paper>
      )}

      <Paper withBorder p="md" mb={30}>
        <Text size="lg" weight={500} mb="md">Create New Post</Text>
        <form onSubmit={postForm.onSubmit(handlePostSubmit)}>
          <TextInput
            label="Title"
            placeholder="Post title"
            {...postForm.getInputProps('title')}
          />
          <Textarea
            label="Content"
            placeholder="Post content"
            minRows={3}
            mt="md"
            {...postForm.getInputProps('content')}
          />
          <Button type="submit" mt="md">Create Post</Button>
        </form>
      </Paper>

      <Text size="lg" weight={500} mb="md">Your Posts</Text>
      <Stack>
        {posts.map((post) => (
          <Paper key={post.id} p="md" withBorder>
            <Text size="lg" weight={500}>{post.title}</Text>
            <Text mt="xs">{post.content}</Text>
            
            <Paper withBorder p="xs" mt="md">
              <Text size="sm" weight={500} mb="xs">Comments</Text>
              {comments[post.id]?.map((comment) => (
                <Paper key={comment.id} p="xs" mb="xs" withBorder>
                  <Text size="sm">{comment.content}</Text>
                </Paper>
              ))}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(post.id, commentForm.values);
              }}>
                <Textarea
                  placeholder="Add a comment"
                  size="xs"
                  {...commentForm.getInputProps('content')}
                />
                <Button size="xs" type="submit" mt="xs">Add Comment</Button>
              </form>
            </Paper>
          </Paper>
        ))}
        {posts.length === 0 && (
          <Text c="dimmed" ta="center">
            No posts yet. Create your first post above!
          </Text>
        )}
      </Stack>
    </Container>
  );
}

export default Dashboard; 