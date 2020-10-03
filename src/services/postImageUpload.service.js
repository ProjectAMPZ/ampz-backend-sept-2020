import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { config } from 'dotenv';

const s3 = new aws.S3();
config();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png'
    || file.mimetype === 'video/mp4'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type, only JPEG, PNG and MP4 is allowed!'),
      false
    );
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'ampz-backend-sept',
    metadata(req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key(req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const singleFileUpload = upload.single('media');

const postFileUpload = async (req, res, next) => {
  await singleFileUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: '400 Invalid Request',
        error: err.message,
      });
    }
    req.body.media = req.file.location;
    next();
  });
};

export default postFileUpload;
