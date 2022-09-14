import { ProgressBar } from 'react-bootstrap';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { show } from '../../src/api/quiz';
import { useShowError } from '../../src/hooks/error';
import { Quiz } from '../../src/interface';

const OnlineMatchPage: React.FC = () => {
  const LiMIT_TIME = 20.0;
  const [nowProgressRate, setNowProgressRate] = React.useState(100);
  const [remainingTime, setRemainingTime] = React.useState(LiMIT_TIME);
  const [currentImageProgress, setCurrentImageProgress] = React.useState(0);
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

  const handleTimeUp = () => {
    clearInterval(setIntervalObj);
  };

  const handleStart = () => {
    const startTime = new Date();
    setIntervalObj = setInterval(() => showPassedTime(startTime), 10);
  };

  const [quiz, setQuiz] = React.useState<Quiz>();

  const fetchQuiz = React.useCallback(async () => {
    try {
      const response = await show(12);
      setQuiz(response);
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  React.useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  if (!quiz) return <></>;
  return (
    <div>
      <button onClick={handleStart}>nutton</button>
      <br></br>
      残り時間：{remainingTime}
      <ProgressBar now={nowProgressRate} visuallyHidden />
      <br></br> <br></br>
      <Image
        style={{ width: 300, height: 230 }}
        alt=""
        src={quiz.quiz_images[currentImageProgress].name}
      ></Image>
    </div>
  );
};

export default OnlineMatchPage;
