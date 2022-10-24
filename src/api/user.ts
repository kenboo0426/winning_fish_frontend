import { User } from '../interface';
import { apiClient } from './apiClient';

type UserCreateParams = {
  uuid: string;
  name: string;
  email: string;
  icon: string;
  role: number;
};

export const create = async (params: UserCreateParams) => {
  const response = await apiClient.post('/user', params);

  const data = response.data as User;
  const status = response.status;
  return { data, status };
};

export const show = async (id: string) => {
  const response = await apiClient.get(`/user/${id}`);

  const data = response.data as User;
  return data;
};
