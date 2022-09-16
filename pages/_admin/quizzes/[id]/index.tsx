import { useRouter } from 'next/router';
import React from 'react';
import QuizUpdateForm from '../../../../components/organisms/QuizUpdateForm';
import { show } from '../../../../src/api/quiz';
import { useShowError } from '../../../../src/hooks/error';
import { Quiz } from '../../../../src/interface';

const QuizNewPage: React.FC = () => {
  const router = useRouter();
  const showError = useShowError();
  const { id } = router.query;
  const [quiz, setQuiz] = React.useState<Quiz>();
  const fetchQuiz = React.useCallback(async () => {
    if (!id) return;

    try {
      const response = await show(Number(id));
      setQuiz(response);
    } catch (error) {
      showError(error);
    }
  }, [showError, id]);

  React.useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  if (!quiz) return <></>;
  return (
    <>
      <QuizUpdateForm quiz={quiz} />
    </>
  );
};

export default QuizNewPage;
