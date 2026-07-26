import api from '@/services/api';

export const getMyProfile = async () => {
  const response = await api.get('/students/profile');
  console.log('response:', response);
  return response.data;
};

export const updateMyProfile = async (payload) => {
  const response = await api.put('/students/profile/update', payload);
  return response.data;
};