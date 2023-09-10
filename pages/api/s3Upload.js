// pages/api/uploadToS3.js
import uploadToS3 from '../../util/uploadToS3';

export default async (req, res) => {
  try {
    //console.log('Received file:', req.body);

    // Invoke the uploadToS3 function and pass the file data directly
    const result = await uploadToS3(req.body);

    // Send a response with the result (e.g., S3 URL)
    res.status(200).json({ success: true, s3ImageUrl: result });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    res.status(500).json({ success: false, error: 'Error uploading to S3' });
  }
};
