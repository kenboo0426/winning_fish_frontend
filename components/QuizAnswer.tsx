import { ProgressBar } from 'react-bootstrap';
import { Box, Button } from '@mui/material';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { Quiz } from '../src/interface';
import SimpleDialog from './organisms/SimpleDialog';

type Props = {
  quiz: Quiz;
};

const QuizAnswer: React.FC<Props> = ({ quiz }) => {
  const LiMIT_TIME = 20.0;
  const [nowProgressRate, setNowProgressRate] = React.useState(100);
  const [remainingTime, setRemainingTime] = React.useState(LiMIT_TIME);
  const [currentImageProgress, setCurrentImageProgress] = React.useState(0);
  const [showCorrectDialog, setShowCorrectDialog] = React.useState(false);
  const [showInCorrectDialog, setShowInCorrectDialog] = React.useState(false);
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
  console.log(quiz, 'quiz');

  const handleTimeUp = () => {
    clearInterval(setIntervalObj);
  };

  const handleCorrectAsnwer = React.useCallback(() => {
    setShowCorrectDialog(true);
  }, []);

  const handleInCorrectAsnwer = React.useCallback(() => {
    setShowInCorrectDialog(true);
  }, []);

  const checkAnswer = React.useCallback(
    (option_id: number) => {
      if (quiz.correct_id == option_id) {
        handleCorrectAsnwer();
      } else {
        handleInCorrectAsnwer();
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
        <SimpleDialog text="不正解です！" isOpen={true} />
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
