// util/uploadToS3.js
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export default async (fileData) => {
  try {
    // Initialize AWS SDK with credentials from environment variables
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    // Create an S3 instance
    const s3 = new AWS.S3();

    // Define the S3 bucket and file key
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileKey = `${uuidv4()}.jpg`;

    // Create parameters for S3 upload
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileData, // Use the passed file data directly
    };

    // Upload the file to S3
    await s3.upload(params).promise();

    return fileKey; // Return the file key upon successful upload
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error for further handling
  }
};
