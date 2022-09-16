import { ProgressBar } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { OnlineMatch, Quiz } from '../../src/interface';
import SimpleDialog from './SimpleDialog';
import { useShowError } from '../../src/hooks/error';
import { create } from '../../src/api/answer';
import { useCurrentUser } from '../../src/utils/userAuth';
import { useRouter } from 'next/router';
import OptionButton from '../molecules/OptionButton';

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
    const newRemainingTime = Math.round((LiMIT_TIME - passedTime) * 100) / 100;
    setRemainingTime(newRemainingTime);
    setCurrentImageProgress(Math.min(Math.floor(passedTime / 2), 9));
    if (passedTime > 20) {
      setRemainingTime(0.0);
      handleTimeUp();
    }
  };

  const moveToNextQuestion = React.useCallback(() => {
    window.location.href = `/online_match/${online_match_id}/quiz?question=${
      question + 1
    }`;
  }, [online_match_id, question]);

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
  }, [online_match_id, online_match, moveToNextQuestion, question, router]);

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
      {showCorrectDialog && (
        <SimpleDialog node="正解" isOpen={true} color="#cb1f1f" />
      )}
      {showInCorrectDialog && (
        <SimpleDialog
          node={
            <>
              不正解
              <p style={{ fontSize: 15, marginLeft: 10, color: '#55545a' }}>
                ※{remainTimeInCorrect}秒後に再開できます
              </p>
            </>
          }
          isOpen={true}
          color="#2346c7"
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
        >
          <Typography sx={{ color: 'black', fontSize: 20, fontWeight: 900 }}>
            残り問題数
          </Typography>
          <Typography sx={{ color: '#890f0f', fontSize: 25, fontWeight: 900 }}>
            {online_match.online_match_asked_quizzes.length - question + 1}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
        >
          <Typography sx={{ color: 'black', fontSize: 20, fontWeight: 900 }}>
            残り時間
          </Typography>
          <Typography sx={{ color: '#890f0f', fontSize: 25, fontWeight: 900 }}>
            {remainingTime}
          </Typography>
        </Box>
      </Box>
      <ProgressBar
        now={nowProgressRate}
        visuallyHidden
        style={{ width: '90%', margin: '10px auto' }}
      />
      <Box sx={{ width: '90%', mx: 'auto' }}>
        <Image
          style={{
            width: '100%',
            height: 230,
          }}
          alt=""
          src={quiz.quiz_images[currentImageProgress].name}
        />
      </Box>
      <Box sx={{ mt: 3, width: '90%', mx: 'auto' }}>
        {quiz.options.map((option, index) => (
          <OptionButton
            key={index}
            option_number={index}
            option={option}
            onClick={checkAnswer}
          />
        ))}
      </Box>
    </div>
  );
};

export default QuizAnswer;
