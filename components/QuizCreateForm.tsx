import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { useShowError } from '../src/hooks/error';
import { create } from '../src/api/quiz';
import { uploadImage } from '../src/api/uploadImage';

type QuizWithOption = {
  image: string;
  correct_id: number;
  level: number;
};

const QuizCreateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizWithOption>();
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
      if (!quizImage) return;

      try {
        const imageUrl = await uploadImage(quizImage, 'quiz');
        console.log(imageUrl, 'imageUrlimageUrl');
        const params = {
          image: imageUrl,
          correct_id: data.correct_id,
          level: data.level,
        };
        const response = await create(params);
      } catch (err) {
        showError(err);
      }
    },
    [showError, quizImage]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="test" {...register('image')} />
        <input {...register('image', { required: true })} />
        {errors.image && <span>This field is required</span>}
        <input
          type="file"
          accept="image/*"
          // style={{ display: 'none' }}
          onChange={handleChangeQuizImage}
        />
        <img
          className="flex justify-center items-center"
          src={createObjectURL}
        />
        <input type="submit" />
      </form>
    </>
  );
};

export default QuizCreateForm;
