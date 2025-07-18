export const API_URL = import.meta.env.VITE_DIRECTUS_URL;
export const USER_ROLE_ID = '07eea35c-238a-404d-b201-408f27c895e7';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/users',
  },
  POSTS: '/items/posts',
  COMMENTS: '/items/comments',
}; 