import { Answer } from './../interface/index';
import { apiClient } from './apiClient';

type CreateParams = {
  user_id: number;
  quiz_id: number;
  correct: boolean;
  answered_option_id: number;
  remained_time?: number;
  online_match_id: number;
};

export const create = async (params: CreateParams) => {
  const response = await apiClient.post('/answer', params);

  const data = response.data as Answer;
  return data;
};
