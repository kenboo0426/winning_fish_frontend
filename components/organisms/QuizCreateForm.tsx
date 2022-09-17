import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { useShowError } from '../../src/hooks/error';
import { create } from '../../src/api/quiz';
import { uploadImage } from '../../src/api/uploadImage';
import { useRouter } from 'next/router';
import { Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Badge } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

type QuizWithOption = {
  correct_id: number;
  level: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
};

const QuizCreateForm: React.FC = () => {
  const router = useRouter();
  const [createObjectURLs, setCreateObjectURLs] = React.useState<
    { preview: string }[]
  >([]);
  const [quizImages, setQuizImages] = React.useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      const new_files: any = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setQuizImages([...quizImages, ...acceptedFiles]);
      setCreateObjectURLs([...createObjectURLs, ...new_files]);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizWithOption>({});
  const showError = useShowError();

  const onSubmit: SubmitHandler<QuizWithOption> = React.useCallback(
    async (data) => {
      if (!quizImages) return;

      try {
        const uploadImages = quizImages.map((file) => {
          return uploadImage(file, 'quiz');
        });
        const imageUrls = await Promise.all(uploadImages);
        const quiz_images = imageUrls.map((url, index) => ({
          name: url,
          progress_id: index + 1,
        }));
        const params = {
          level: data.level!,
          options: [
            { name: data.option1! },
            { name: data.option2! },
            { name: data.option3! },
            { name: data.option4! },
          ],
          quiz_images: quiz_images,
        };
        await create(params);
        router.push('/_admin/quizzes');
      } catch (err) {
        showError(err);
      }
    },
    [showError, quizImages, router]
  );

  const handleRevokeImageUrl = React.useCallback(
    (preview: any) => {
      const new_files = createObjectURLs.filter(
        (file) => file.preview != preview
      );
      setCreateObjectURLs(new_files);
    },
    [createObjectURLs]
  );

  return (
    <div className="w-75 mx-auto">
      <p className="fs-2 text-center">クイズ作成</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors && (
          <span style={{ color: 'red', fontWeight: 900 }}>
            必須項目を入力してください
          </span>
        )}
        <div
          {...getRootProps({ className: 'dropzone' })}
          style={{ border: '2px dashed #29020299' }}
        >
          <input {...getInputProps()} />
          <p>Drag n drop some files here, or click to select files</p>
        </div>
        {createObjectURLs.map((file, index) => (
          <Badge
            key={index}
            color="default"
            badgeContent={<ClearIcon />}
            onClick={() => handleRevokeImageUrl(file.preview)}
          >
            <img
              className="flex justify-center items-center"
              src={file.preview}
              style={{ width: 300, height: 230 }}
            />
          </Badge>
        ))}
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
