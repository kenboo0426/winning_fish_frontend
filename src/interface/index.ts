export type User = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  rating: number;
  role: number;
};

export type Quiz = {
  id: number;
  correct_id: number;
  correct_rate: number;
  level: number;
  options: Option[];
  quiz_images: QuizImage[];
};

export type Option = {
  id: number;
  name: string;
  quiz_id: number;
};

export type Answer = {
  id: number;
  user_id: number;
  quiz_id: number;
  correct: boolean;
  answered_option_id: number;
};

export type QuizImage = {
  id: number;
  name: string;
  quiz_id: number;
  progress_id: number;
};
