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

export type OnlineMatch = {
  id: number;
  person_number: number;
  participants_number: number;
  started_at: Date;
  finished_at: Date;
  created_at: Date;
  online_match_joined_users: OnlineMatchJoinedUser[];
  online_match_asked_quizzes: OnlineMatchAskedQuiz[];
};

export type OnlineMatchJoinedUser = {
  id: number;
  user_id: number;
  online_match_id: number;
  rank: number;
  remained_time: number;
  miss_answerd_count: number;
  score: number;
  user: User;
};

export type OnlineMatchAskedQuiz = {
  id: number;
  quiz_id: number;
  online_match_id: number;
};
