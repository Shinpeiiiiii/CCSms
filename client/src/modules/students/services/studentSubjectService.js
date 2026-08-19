import api from '@/services/api';

export const getMySubjects = async () => {
  const response = await api.get('/students/subjects');
  return response.data.data;
};