import { Button } from '@mui/material';
import React from 'react';
import { index } from '../../../src/api/quiz';
import { useShowError } from '../../../src/hooks/error';
import { Quiz } from '../../../src/interface';
import { useRouter } from 'next/router';
import QuizList from '../../../components/organisms/QuizList';

const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
  const showError = useShowError();
  const router = useRouter();

  const fetchQuizzes = React.useCallback(async () => {
    try {
      const response = await index();
      setQuizzes(response);
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  React.useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <>
      <Button onClick={() => router.push('/_admin/quizzes/new')}>作成</Button>
      <div>
        <QuizList quizzes={quizzes} setQuizzes={setQuizzes} />
      </div>
    </>
  );
};

export default QuizzesPage;
