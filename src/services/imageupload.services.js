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
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
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

const singleUpload = upload.array('image', 2);

const uploadFile = async (req, res, next) => {
  await singleUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: '400 Invalid Request',
        error: err.message,
      });
    }

    let profilephoto;
    let coverphoto;

    (async () => {
      profilephoto = req.body.profilePhotoUrl;
      coverphoto = req.body.coverPhotoUrl;

      const s4 = new aws.S3(awsCredentials);
      if (profilephoto) {
        const profilePhotoKey = profilephoto.substring(53);

        await s4.deleteObject(
          {
            Bucket: 'ampz-backend-sept',
            Key: profilePhotoKey,
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

      if (coverphoto) {
        const coverPhotoKey = coverphoto.substring(53);
        await s4.deleteObject(
          {
            Bucket: 'ampz-backend-sept',
            Key: coverPhotoKey,
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
    req.body.profilePhotoUrl = req.files[0].location;
    req.body.coverPhotoUrl = req.files[1].location;
    next();
  });
};

export default uploadFile;
