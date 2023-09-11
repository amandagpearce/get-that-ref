import fileUploadMiddleware from '../../util/uploadToS3';

export default async (req, res) => {
  try {
    // Use the uploadMiddleware to handle file uploads
    fileUploadMiddleware(req, res, (error) => {
      const MIME_TYPE_MAP = {
        'image/png': 'png',
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg',
      };

      if (error) {
        console.error('Error parsing file:', error);
        res.status(400).json({ success: false, error: 'Error parsing file' });
        return;
      }
      const { file } = req;
      const { mimeType } = req.body;
      console.log('correct mimeType', mimeType);

      // Send a response with the result (e.g., S3 URL)
      res.status(200).json({ success: true, s3ImageUrl: file.location });
    });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    res.status(500).json({ success: false, error: 'Error uploading to S3' });
  }
};

// pages/api/uploadToS3.js
export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};
