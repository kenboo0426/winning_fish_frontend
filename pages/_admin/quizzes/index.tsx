import { Button } from '@mui/material';
import React from 'react';
import { index, create, show, destory, update } from '../../../src/api/quiz';
import { useShowError } from '../../../src/hooks/error';
import { Quiz } from '../../../src/interface';
import { Button as AAAA } from 'react-bootstrap';
import { useRouter } from 'next/router';

const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
  const [createQuiz, setCreateQuiz] = React.useState<Quiz>();
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

  const handleCreateQuiz = React.useCallback(async () => {
    try {
      const params = {
        image: 'aaaa',
        correct_id: 1,
        correct_rate: 1,
        level: 1,
      };
      const response = await create(params);
      setQuizzes([...quizzes, response]);
    } catch (err) {
      showError(err);
    }
  }, [showError, quizzes, setQuizzes]);

  const fetchQuiz = React.useCallback(async () => {
    try {
      const response = await show(5);
      console.log(response);
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  const deleteQuiz = React.useCallback(async () => {
    try {
      const response = await destory(17);
      console.log(response);
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  const updateQuiz = React.useCallback(async () => {
    try {
      const params = {
        image: 'krtortgomre',
        correct_id: 1,
        correct_rate: 1,
        level: 3,
      };
      const response = await update(18, params);
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  React.useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <>
      <AAAA variant="primary" onClick={fetchQuiz}>
        fetch
      </AAAA>
      <Button onClick={deleteQuiz}>削除</Button>
      <Button onClick={updateQuiz}>更新</Button>
      <Button onClick={() => router.push('/_admin/quizzes/new')}>作成</Button>
    </>
  );
};

export default QuizzesPage;
