import React from 'react';
import { Quiz } from '../../../src/interface';

const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>();

  const fetchQuizzes = React.useCallback(() => {}, []);
  return <>sss</>;
};

export default QuizzesPage;
