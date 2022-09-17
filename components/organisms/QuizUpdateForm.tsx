import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { useShowError } from '../../src/hooks/error';
import { update } from '../../src/api/quiz';
import { uploadImage } from '../../src/api/uploadImage';
import { useRouter } from 'next/router';
import { Form } from 'react-bootstrap';
import { Quiz } from '../../src/interface';

type QuizWithOption = {
  image?: string;
  correct_id?: number;
  level?: number;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
};

type Props = {
  quiz: Quiz;
};

const QuizUpdateForm: React.FC<Props> = ({ quiz }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizWithOption>({
    defaultValues: {
      correct_id: quiz.correct_id,
      level: quiz.level,
      option1: quiz.options[0].name,
      option2: quiz.options[1].name,
      option3: quiz.options[2].name,
      option4: quiz.options[3].name,
    },
  });
  const showError = useShowError();
  const [quizImage, setQuizImage] = React.useState<File>();
  const [createObjectURL, setCreateObjectURL] = React.useState<string>();

  const handleChangeQuizImage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        setQuizImage(file);
        setCreateObjectURL(URL.createObjectURL(file));
      }
    },
    []
  );
  const onSubmit: SubmitHandler<QuizWithOption> = React.useCallback(
    async (data) => {
      try {
        let imageUrl;
        if (quizImage) {
          imageUrl = await uploadImage(quizImage, 'quiz');
        } else {
          imageUrl = createObjectURL;
        }
        const params = {
          level: data.level!,
          options: [
            { name: data.option1! },
            { name: data.option2! },
            { name: data.option3! },
            { name: data.option4! },
          ],
          quiz_images: [],
        };
        await update(quiz.id, params);
        router.push('/_admin/quizzes');
      } catch (err) {
        showError(err);
      }
    },
    [showError, quizImage, router, createObjectURL, quiz.id]
  );

  return (
    <div className="w-75 mx-auto">
      <p className="fs-2 text-center">クイズ作成</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.image && <span>This field is required</span>}
        <input type="file" accept="image/*" onChange={handleChangeQuizImage} />
        <img
          className="flex justify-center items-center"
          src={createObjectURL}
          style={{ width: 300, height: 230 }}
        />
        <Form.Select {...register('level', { required: true })}>
          <option value="1">Basic</option>
          <option value="2">Intermediate</option>
          <option value="3">Advance</option>
        </Form.Select>
        <p className="fs-5">正解</p>
        <Form.Control
          {...register('option1', { required: true })}
          placeholder="シーバス"
        />
        <p className="fs-5">不正解</p>
        <Form.Control
          {...register('option2', { required: true })}
          placeholder="カジキ"
        />
        <Form.Control
          {...register('option3', { required: true })}
          placeholder="ブラックバス"
        />
        <Form.Control
          {...register('option4', { required: true })}
          placeholder="カサゴ"
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default QuizUpdateForm;
