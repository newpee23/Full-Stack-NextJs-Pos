// src/utils/s3Image.ts

import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const getS3Image = async (key: string): Promise<Buffer | undefined> => {
  try {
    const params = {
      Bucket: 'nextpos-s3',
      Key: key,
    };

    const data = await s3.getObject(params).promise();

    return data.Body as Buffer;
  } catch (error) {
    console.error('Error fetching image from S3:', error);
    return undefined;
  }
};
// const [image, setImage] = useState<string | undefined>(undefined);
// useEffect(() => {
//     const fetchImage = async () => {
//       const key = 'moonlamplogo.png'; // ชื่อไฟล์ภาพที่ต้องการ
//       const imageData = await getS3Image(key);

//       if (imageData) {
//         const base64Image = `data:image/png;base64,${imageData.toString('base64')}`;
//         setImage(base64Image);
//       }
//     };
