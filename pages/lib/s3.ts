
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
	region: process.env.S3_AWS_REGION!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_keyID!,
		secretAccessKey: process.env.S3_SECRET_ACCESSKEY!,
	}
})
