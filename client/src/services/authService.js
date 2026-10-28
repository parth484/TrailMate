import API from './api';

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/users/profile', profileData);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updated = { ...currentUser, ...response.data };
  localStorage.setItem('user', JSON.stringify(updated));
  return response.data;
};

export const changePassword = async (passwords) => {
  const response = await API.put('/users/change-password', passwords);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
