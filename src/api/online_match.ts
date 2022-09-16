import { OnlineMatch } from '../interface';
import { apiClient } from './apiClient';

export const joinOrCreate = async (user_id: number) => {
  const response = await apiClient.post(`/online_match?user_id=${user_id}`);

  const data = response.data as OnlineMatch;
  return data;
};

export const show = async (id: string) => {
  const response = await apiClient.get(`/online_match/${id}`);

  const data = response.data as OnlineMatch;
  return data;
};

export const start = async (id: string) => {
  const response = await apiClient.post(`/online_match/start/${id}`);

  const data = response.data as OnlineMatch;
  return data;
};

export const calculateTime = async (id: string, user_id: number) => {
  const response = await apiClient.post(
    `/online_match/calculate/${id}?user_id=${user_id}`
  );

  const data = response.data as OnlineMatch;
  return data;
};
