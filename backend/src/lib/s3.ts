import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

export const s3 = new S3Client({
	region: process.env.S3_REGION || "us-east-1",
	endpoint: process.env.S3_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY || "",
		secretAccessKey: process.env.S3_SECRET_KEY || "",
	},
});

export const uploadFileToS3 = async (
	file: Buffer,
	path: string,
	contentType: string,
) => {
	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET,
		Key: path,
		Body: file,
		ContentType: contentType,
	});

	try {
		const response = await s3.send(command);
		console.log("File uploaded successfully:", response);
		return response;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
};
