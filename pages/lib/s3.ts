import { uploadImagesType } from "@/types/verify";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//     region: process.env.S3_AWS_REGION!,
//     credentials: {
//         accessKeyId: process.env.S3_ACCESS_keyID!,
//         secretAccessKey: process.env.S3_SECRET_ACCESSKEY!,
//     }
// })

export const s3UploadImages = async (data: uploadImagesType): Promise<string> => {
    // const params = {
	// 	Bucket: process.env.S3_BUCKET!,
	// 	Key: data.fileName,
	// 	Body: data.originFileObj,
	// 	ContentType: "image/jpg"
	// }

	// const command = new PutObjectCommand(params);
	// await s3Client.send(command);
    console.log(data)
	return data.fileName;
}
