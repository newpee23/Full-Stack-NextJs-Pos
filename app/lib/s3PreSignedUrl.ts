import { s3Client } from "@/pages/lib/s3";
import { uploadImagesType } from "@/types/verify";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3UploadImages = async (data: uploadImagesType): Promise<string> => {
	try {
		const { fileName, originFileObj } = data;
		const file = originFileObj;
		const fileNameS3: string = file.name;
		const fileExtension: string = fileNameS3.split('.').pop() || '';
		const type = `image/${fileExtension}`

		// Check file size
		const fileSize = file.size / (1024 * 1024); // Convert to megabytes
		if (fileSize > 5) {
			throw new Error("File size exceeds the maximum limit of 5 MB.");
		}

		const fileNameUploadS3 = `${fileName}.${fileExtension}`
		const params = {
			Bucket: process.env.S3_BUCKET!,
			Key: fileNameUploadS3,
			Body: file,
			ContentType: type
		};

		const command = new PutObjectCommand(params);

		// Generate a pre-signed URL for the PUT operation with a 1-minute expiration
		const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

		// Use the pre-signed URL to upload the file
		const options = {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": type
			},
		};

		const uploadResponse = await fetch(preSignedUrl, options);

		if (uploadResponse.ok) {
			// Return a more informative message or the S3 URL if needed
			return fileNameUploadS3;
		} else {
			console.error("File upload failed.");
			return "";
		}
	} catch (error) {
		console.error("S3 upload failed:", error);
		return "";
	}
};

export const deleteImageS3 = async (fileName: string): Promise<boolean> => {
    try {
        const command = new DeleteObjectCommand({ Bucket: "nextpos-s3", Key: "product/PD_72_202311291656.jpg" });
        await s3Client.send(command);

        // console.log(`S3 delete: ${fileName} successfully`);
		return true;
    } catch (error) {
        console.error("S3 delete failed:", error);
		return false;
    }
}