import { useRouter } from 'next/router';
import React from 'react';
import QuizAnswer from '../../../../components/organisms/QuizAnswer';
import { show } from '../../../../src/api/online_match';
import { show as Quizshow } from '../../../../src/api/quiz';
import { useShowError } from '../../../../src/hooks/error';
import { OnlineMatch, Quiz } from '../../../../src/interface';
import { Box, Slide, Typography } from '@mui/material';

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
  }, 3 * 1000);

  setTimeout(() => {
    setIsReadyToStart(true);
  }, 3 * 1200);

  return (
    <>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box sx={{ mt: 30, textAlign: 'center' }}>
          <Typography
            sx={{
              color: 'white',
              WebkitTextStroke: '4px red',
              fontSize: 60,
              fontWeight: 900,
            }}
          >
            第{question}問
          </Typography>
        </Box>
      </Slide>
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
