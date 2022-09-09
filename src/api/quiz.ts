import { apiClient } from './apiClient';
import { Quiz } from '../interface';

export const index = async () => {
  const response = await apiClient.get('/quizzes');

  const data = response.data as Quiz[];
  return data;
};

type QuizParams = {
  level: number;
  options: {
    name: string;
  }[];
  quiz_images: {
    name: string;
    progress_id: number;
  }[];
};

export const create = async (params: QuizParams) => {
  const response = await apiClient.post('/quiz', params);

  const data = response.data as Quiz;
  return data;
};

export const show = async (id: number) => {
  const response = await apiClient.get(`/quiz/${id}`);

  const data = response.data as Quiz;
  return data;
};

export const update = async (id: number, params: QuizParams) => {
  const response = await apiClient.put(`/quiz/${id}`, params);

  const data = response.data as Quiz;
  return data;
};

export const destory = async (id: number) => {
  const response = await apiClient.delete(`/quiz/${id}`);

  const data = response.data as Quiz;
  return data;
};
