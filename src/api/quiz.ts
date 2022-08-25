import { apiClient } from './apiClient';
import Jsona from 'jsona';
import { Quiz } from '../interface';

const formatter = new Jsona();

export const index = async () => {
  const response = await apiClient.get('/quizzes');
  const data = formatter.deserialize(response) as Quiz[];

  return data;
};

type CreateQuizParams = {
  image: string;
  correct_id: number;
  correct_rate: number;
  level: number;
};

export const create = async (params: CreateQuizParams) => {
  const response = await apiClient.post('/quiz/create', params);

  const data = formatter.deserialize(response) as Quiz;
  return data;
};

export const show = async (id: number) => {
  const response = await apiClient.get(`/quiz${id}`);

  const data = formatter.deserialize(response) as Quiz;
  return data;
};

export const destory = async (id: number) => {
  const response = await apiClient.delete(`/quiz/${id}`);

  const data = formatter.deserialize(response) as Quiz;
  return data;
};
