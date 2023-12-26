import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from '@/firebaseConfig'
import { uploadImagesType } from "@/types/verify"

export const handleUploadFileFirebaseStorage = async (dataProductImg: uploadImagesType): Promise<string> => {
  if (dataProductImg.originFileObj) {
    const fileExtension: string = dataProductImg.originFileObj.name.split('.').pop() || '';
    const fileName: string = `${dataProductImg.fileName}.${fileExtension}`;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, dataProductImg.originFileObj);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.log(error.message);
          reject(error.message);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.log(error);
            reject(error);
          }
        }
      );
    });
  } else {
    console.log('File not found');
    return "";
  }
};

export function getFileNameFromUrl(url: string) {
  // Split the URL by '/'
  const urlParts = url.split('/');
  // Get the last part of the URL (which should be the file name)
  const fileName = urlParts[urlParts.length - 1];
  // Decode the file name (if it contains special characters)
  return decodeURIComponent(fileName);
}

export const handleCheckFileSize = (files: File): boolean => {
  console.log(files.size)
  if (files.size < 5000000) {
    return true;
  }
  return false;
}