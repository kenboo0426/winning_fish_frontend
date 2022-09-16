import { useRouter } from 'next/router';
import React from 'react';
import SimpleDialog from '../../../../components/organisms/SimpleDialog';
import QuizAnswer from '../../../../components/organisms/QuizAnswer';
import { show } from '../../../../src/api/online_match';
import { show as Quizshow } from '../../../../src/api/quiz';
import { useShowError } from '../../../../src/hooks/error';
import { OnlineMatch, Quiz } from '../../../../src/interface';

const OnlineMatchQuizPage: React.FC = () => {
  const router = useRouter();
  const { question, online_match_id } = router.query;
  const [onlineMatch, setOnlineMatch] = React.useState<OnlineMatch>();
  const [quiz, setQuiz] = React.useState<Quiz>();
  const showError = useShowError();
  const [isReadyToStart, setIsReadyToStart] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchOnlineMatch = React.useCallback(async () => {
    if (!online_match_id) return;

    try {
      const response = await show(online_match_id as string);
      setOnlineMatch(response);
    } catch (err) {
      showError(err);
    }
  }, [online_match_id, showError]);

  const fetchQuiz = React.useCallback(async () => {
    if (!onlineMatch) return;

    try {
      const quiz_id =
        onlineMatch.online_match_asked_quizzes[Number(question) - 1].quiz_id;
      const response = await Quizshow(quiz_id);
      setQuiz(response);
    } catch (err) {
      showError(err);
    }
  }, [onlineMatch, question, showError]);

  React.useEffect(() => {
    fetchOnlineMatch();
  }, [fetchOnlineMatch]);

  React.useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  setTimeout(() => {
    handleClose();
    setIsReadyToStart(true);
  }, 3 * 1000);

  return (
    <>
      <SimpleDialog text={`第${question}問目！`} isOpen={open} />
      {isReadyToStart && quiz && onlineMatch && (
        <QuizAnswer
          quiz={quiz}
          online_match_id={Number(online_match_id)}
          question={Number(question)}
          online_match={onlineMatch}
        />
      )}
    </>
  );
};

export default OnlineMatchQuizPage;
