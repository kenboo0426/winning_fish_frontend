import { ProgressBar } from 'react-bootstrap';
import { Box, Button } from '@mui/material';
import React, { PureComponent } from 'react';
import Image from 'react-bootstrap/Image';
import { OnlineMatch, Quiz } from '../src/interface';
import SimpleDialog from './organisms/SimpleDialog';
import { useShowError } from '../src/hooks/error';
import { create } from '../src/api/answer';
import { useCurrentUser } from '../src/utils/userAuth';
import { useRouter } from 'next/router';

type Props = {
  quiz: Quiz;
  online_match_id: number;
  question: number;
  online_match: OnlineMatch;
};

const QuizAnswer: React.FC<Props> = ({
  quiz,
  online_match_id,
  question,
  online_match,
}) => {
  const LiMIT_TIME = 20.0;
  const [nowProgressRate, setNowProgressRate] = React.useState(100);
  const [remainingTime, setRemainingTime] = React.useState(LiMIT_TIME);
  const [currentImageProgress, setCurrentImageProgress] = React.useState(0);
  const [showCorrectDialog, setShowCorrectDialog] = React.useState(false);
  const [showInCorrectDialog, setShowInCorrectDialog] = React.useState(false);
  const [remainTimeInCorrect, seteRmainTimeInCorrect] = React.useState(3);

  const currentUser = useCurrentUser();
  const router = useRouter();
  const showError = useShowError();
  let setIntervalObj: NodeJS.Timer;

  const showPassedTime = (startTime: Date) => {
    const nowTime: Date = new Date();
    const passedTime = (Number(nowTime) - Number(startTime)) / 1000;
    setNowProgressRate(((20 - passedTime) / 20) * 100);
    const newRemainingTime =
      Math.round((LiMIT_TIME - passedTime) * 1000) / 1000;
    setRemainingTime(newRemainingTime);
    setCurrentImageProgress(Math.min(Math.floor(passedTime / 2), 9));
    if (passedTime > 20) {
      setRemainingTime(0.0);
      handleTimeUp();
    }
  };

  const moveToNextQuestion = () => {
    window.location.href = `/online_match/${online_match_id}/quiz?question=${
      question + 1
    }`;
  };

  const handleTimeUp = () => {
    clearInterval(setIntervalObj);
    if (online_match.online_match_asked_quizzes.length <= Number(question)) {
      router.push(`/online_match/${online_match_id}/finished`);
    } else {
      moveToNextQuestion();
    }
  };

  const handleAfterCorrectAnswer = React.useCallback(() => {
    setTimeout(() => {
      if (online_match.online_match_asked_quizzes.length <= Number(question)) {
        router.push(`/online_match/${online_match_id}/finished`);
      } else {
        moveToNextQuestion();
      }
      setShowCorrectDialog(false);
    }, 1000);
  }, [online_match_id, online_match, question, router]);

  const handleAfterInCorrectAnswer = React.useCallback(() => {
    seteRmainTimeInCorrect(3);
    const timer = setInterval(() => {
      seteRmainTimeInCorrect((preCount) => preCount - 1);
    }, 1000);
    setTimeout(() => {
      setShowInCorrectDialog(false);
      clearInterval(timer);
    }, 3000);
  }, [seteRmainTimeInCorrect]);

  const handleCorrectAsnwer = React.useCallback(
    async (option_id: number) => {
      if (!currentUser) return;

      try {
        const params = {
          user_id: currentUser.id,
          quiz_id: quiz.id,
          correct: true,
          answered_option_id: option_id,
          remained_time: remainingTime,
          online_match_id: online_match_id,
        };

        await create(params);
        setShowCorrectDialog(true);
        handleAfterCorrectAnswer();
      } catch (err) {
        showError(err);
      }
    },
    [
      currentUser,
      quiz,
      remainingTime,
      online_match_id,
      showError,
      handleAfterCorrectAnswer,
    ]
  );

  const handleInCorrectAsnwer = React.useCallback(
    async (option_id: number) => {
      if (!currentUser) return;

      try {
        const params = {
          user_id: currentUser.id,
          quiz_id: quiz.id,
          correct: false,
          answered_option_id: option_id,
          online_match_id: online_match_id,
        };

        await create(params);
        setShowInCorrectDialog(true);
        handleAfterInCorrectAnswer();
      } catch (err) {
        showError(err);
      }
    },
    [currentUser, quiz, online_match_id, showError, handleAfterInCorrectAnswer]
  );

  const checkAnswer = React.useCallback(
    (option_id: number) => {
      if (quiz.correct_id == option_id) {
        handleCorrectAsnwer(option_id);
      } else {
        handleInCorrectAsnwer(option_id);
      }
    },
    [quiz, handleCorrectAsnwer, handleInCorrectAsnwer]
  );

  React.useEffect(() => {
    const startTime = new Date();
    setIntervalObj = setInterval(() => showPassedTime(startTime), 10);

    return () => {
      clearInterval(setIntervalObj);
    };
  }, []);

  return (
    <div>
      {showCorrectDialog && <SimpleDialog text="正解です！" isOpen={true} />}
      {showInCorrectDialog && (
        <SimpleDialog
          text={`残り: ${remainTimeInCorrect}  不正解です！`}
          isOpen={true}
        />
      )}
      <br></br>
      残り時間：{remainingTime}
      <ProgressBar now={nowProgressRate} visuallyHidden />
      <br></br> <br></br>
      <Image
        style={{ width: 300, height: 230 }}
        alt=""
        src={quiz.quiz_images[currentImageProgress].name}
      />
      <Box sx={{ mt: 3 }}>
        {quiz.options.map((option, index) => (
          <Box sx={{ width: '80%', textAlign: 'left' }} key={option.id}>
            <React.Fragment>
              <Button
                onClick={() => checkAnswer(option.id)}
                variant="outlined"
                sx={{ width: 300, my: 1, px: 0, textAlign: 'left' }}
              >
                {index + 1}、 {option.name}
              </Button>
            </React.Fragment>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default QuizAnswer;
