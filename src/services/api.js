import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' }
});

export const fetchPodcasts = async (params = {}) => {
  const response = await api.get('/podcastList', { params });
  return response.data;
};

export const fetchPodcastById = async (id) => {
  const response = await api.get(`/podcastList/${id}`);
  return response.data;
};

export const postContactForm = async (payload) => {
  const response = await api.post('/contactForm', payload);
  return response.data;
};

export default api;