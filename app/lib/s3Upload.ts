import { s3Client } from "@/pages/lib/s3";
import { uploadImagesType } from "@/types/verify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3UploadImages = async (data: uploadImagesType): Promise<string> => {
	try {
		const file = data.originFileObj;
		const fileName: string = file.name;
		const fileExtension: string = fileName.split('.').pop() || '';

		// Check file size
		const fileSize = file.size / (1024 * 1024); // Convert to megabytes
		if (fileSize > 5) {
			throw new Error("File size exceeds the maximum limit of 5 MB.");
		}

		const params = {
			Bucket: process.env.S3_BUCKET!,
			Key: `product/${data.fileName}.${fileExtension}`,
			Body: data.originFileObj,
			ContentType: `image/${fileExtension}`
		};

		const command = new PutObjectCommand(params);

		// Generate a pre-signed URL for the PUT operation with a 1-minute expiration
		const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

		// Use the pre-signed URL to upload the file
		const options = {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": `image/${fileExtension}`
			},
		};

		const uploadResponse = await fetch(preSignedUrl, options);

		if (uploadResponse.ok) {
			// Return a more informative message or the S3 URL if needed
			return `Upload successful! File: ${fileName}, Pre-signed URL: ${preSignedUrl}`;
		} else {
			console.error("File upload failed.");
			throw new Error("Failed to upload to S3");
		}
	} catch (error) {
		console.error("S3 upload failed:", error);
		throw new Error("Failed to upload to S3");
	}
};