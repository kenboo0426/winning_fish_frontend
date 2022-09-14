import { useRouter } from 'next/router';
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { destory } from '../src/api/quiz';
import { useShowError } from '../src/hooks/error';
import { Quiz } from '../src/interface';
import { NotificationStateContext } from './Notification';

type Props = {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
};

const QuizList: React.FC<Props> = ({ quizzes, setQuizzes }) => {
  const showError = useShowError();
  const { setNotify } = React.useContext(NotificationStateContext);
  const router = useRouter();

  const handleDelete = React.useCallback(
    async (quiz_id: number) => {
      try {
        await destory(quiz_id);
        setNotify({
          type: 'success',
          message: '削除しました',
          open: true,
        });
        const newQiuzzes: Quiz[] = quizzes.filter((quiz) => quiz.id != quiz_id);
        setQuizzes(newQiuzzes);
      } catch (error) {
        showError(error);
      }
    },
    [showError, setNotify, setQuizzes, quizzes]
  );
  return (
    <>
      {quizzes.map((quiz) => {
        return (
          <React.Fragment key={quiz.id}>
            <Card className="my-3">
              <Card.Header>No.{quiz.id}</Card.Header>
              <Card.Body>
                {/* <Card.Img
                  variant="top"
                  src={`${quiz.image}`}
                  style={{ width: 300, height: 230 }}
                /> */}
                <div className="d-flex flex-row justify-content-between">
                  <div>
                    <Card.Text>正解</Card.Text>
                    <Card.Text>１、{quiz.options[0].name}</Card.Text>
                    <Card.Text>不正解</Card.Text>
                    <Card.Text>２、{quiz.options[1].name}</Card.Text>
                    <Card.Text>３、{quiz.options[2].name}</Card.Text>
                    <Card.Text>４、{quiz.options[3].name}</Card.Text>
                  </div>
                  <div>
                    <Button
                      variant="primary"
                      onClick={() => router.push(`/_admin/quizzes/${quiz.id}`)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(quiz.id)}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default QuizList;
