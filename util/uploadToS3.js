// Import necessary modules
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

// Create an instance of AWS S3
console.log('process.env.AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
console.log(
  'process.env.AWS_SECRET_ACCESS_KEY',
  process.env.AWS_SECRET_ACCESS_KEY
);
console.log('process.env.AWS_REGION', process.env.AWS_REGION);
console.log('process.env.AWS_BUCKET_NAME', process.env.AWS_BUCKET_NAME);

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create a multer storage instance with multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; // rely on file and not req.body.mimeType
      const filename = `${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}.${ext}`;

      callback(null, filename);
    },
  }),
});

// Middleware function to handle file upload
const fileUploadMiddleware = upload.single('file'); // Assumes you have an input field with the name 'file'

export default fileUploadMiddleware;
