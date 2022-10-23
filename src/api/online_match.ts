import { OnlineMatch } from '../interface';
import { apiClient } from './apiClient';

export const joinOrCreate = async (user_or_guest_id: string) => {
  const response = await apiClient.post(`/online_match?user_or_guest_id=${user_or_guest_id}`);

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

export const calculateTime = async (id: string, joined_user_id: number) => {
  const response = await apiClient.post(
    `/online_match/calculate/${id}?joined_user_id=${joined_user_id}`
  );

  const data = response.data as OnlineMatch;
  return data;
};

export const finish = async (id: string) => {
  const response = await apiClient.post(`/online_match/finish/${id}`);

  const data = response.data as OnlineMatch;
  return data;
};
