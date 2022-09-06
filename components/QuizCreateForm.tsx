import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import Image from 'next/image';
import { useShowError } from '../src/hooks/error';
import { create } from '../src/api/quiz';
import { uploadImage } from '../src/api/uploadImage';
import { useRouter } from 'next/router';
import { Form, InputGroup } from 'react-bootstrap';

type QuizWithOption = {
  image?: string;
  correct_id?: number;
  level?: number;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
};

const QuizCreateForm: React.FC<QuizWithOption> = ({
  image,
  correct_id,
  level,
  option1,
  option2,
  option3,
  option4,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizWithOption>({
    defaultValues: {
      image: image,
      correct_id: correct_id,
      level: level,
      option1: option1,
      option2: option2,
      option3: option3,
      option4: option4,
    },
  });
  const showError = useShowError();
  const [quizImage, setQuizImage] = React.useState<File>();
  const [createObjectURL, setCreateObjectURL] = React.useState(image);

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
      if (!quizImage) return;

      try {
        let imageUrl;
        if (createObjectURL) {
          imageUrl = createObjectURL;
        } else {
          imageUrl = await uploadImage(quizImage, 'quiz');
        }
        const params = {
          image: imageUrl!,
          level: data.level!,
          options: [
            { name: data.option1! },
            { name: data.option2! },
            { name: data.option3! },
            { name: data.option4! },
          ],
        };
        await create(params);
        router.push('/_admin/quizzes');
      } catch (err) {
        showError(err);
      }
    },
    [showError, quizImage, router, createObjectURL]
  );

  return (
    <div className="w-75 mx-auto">
      <p className="fs-2 text-center">クイズ作成</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.image && <span>This field is required</span>}
        <input type="file" accept="image/*" onChange={handleChangeQuizImage} />
        {/* <Image
          alt="fish img"
          className="flex justify-center items-center"
          src={createObjectURL}
        /> */}
        <img
          className="flex justify-center items-center"
          src={createObjectURL}
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

export default QuizCreateForm;
