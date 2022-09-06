import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase';

export const uploadImage = async (image: File, dirname: string) => {
  let uploadResult = '';

  if (image.name) {
    const storageRef = ref(storage);
    const ext = image.name.split('.').pop();
    const hashName = Math.random().toString(36).slice(-8);
    const fullPath = `/${dirname}/` + hashName + '.' + ext;
    const uploadRef = ref(storageRef, fullPath);

    await uploadBytes(uploadRef, image).then(async function (result) {
      await getDownloadURL(uploadRef).then(function (url) {
        uploadResult = url;
      });
    });
  }
  return uploadResult;
};
