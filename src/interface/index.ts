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
  image: string;
  correctId: number;
  correctRate: number;
  level: number;
};

export type Option = {
  id: number;
  name: string;
  quizId: number;
};

export type Answer = {
  id: number;
  userId: number;
  quizId: number;
  correct: boolean;
  answeredOptionId: number;
};
