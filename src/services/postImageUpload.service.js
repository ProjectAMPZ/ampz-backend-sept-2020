import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { config } from 'dotenv';

const s3 = new aws.S3();
config();

const awsCredentials = aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: 'us-west-1',
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png'
    || file.mimetype === 'video/mp4'
    || file.mimetype === 'video/wmv'
    || file.mimetype === 'video/3gp'
    || file.mimetype === 'video/ogg'
    || file.mimetype === 'video/flv'
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

    (async () => {
      const s4 = new aws.S3(awsCredentials);
      if (req.body.mediaUrl) {
        const mediaUrlKey = req.body.mediaUrl.substring(53);
        await s4.deleteObject(
          {
            Bucket: 'ampz-backend-sept',
            Key: mediaUrlKey,
          },
          () => {
            // if (err) {
            //   // console.log(err);
            // } else {
            //   // console.log(data);
            // }
          }
        );
      }
    })();

    const mediaType = req.file.mimetype.split('/')[0];
    req.body.mediaUrl = req.file.location;
    req.body.mediaType = mediaType;

    next();
  });
};

export default postFileUpload;
