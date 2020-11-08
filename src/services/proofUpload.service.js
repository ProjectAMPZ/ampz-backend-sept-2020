// import aws from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import { config } from 'dotenv';
// import User from '../db/models/users.model';

// const s3 = new aws.S3();
// config();

// const awsCredentials = aws.config.update({
//   secretAccessKey: process.env.S3_ACCESS_SECRET,
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   region: 'us-west-1',
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
//   }
// };

// const upload = multer({
//   fileFilter,
//   storage: multerS3({
//     acl: 'public-read',
//     s3,
//     bucket: 'ampz-backend-sept',
//     metadata(req, file, cb) {
//       cb(null, { fieldName: 'TESTING_METADATA' });
//     },
//     key(req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

// const multiFileUpload = upload.array('image');

// export const proofUpload = async (req, res, next) => {
//   await multiFileUpload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({
//         status: '400 Invalid Request',
//         error: err.message,
//       });
//     }

//     let proof;

//     (async () => {
//       proof = req.body.proof;

//       const s4 = new aws.S3(awsCredentials);

//       if (proof) {
//         const key = proof.substring(53);

//         s4.deleteObject(
//           {
//             Bucket: 'ampz-backend-sept',
//             Key: key,
//           },
//           () => {
//             // if (err) {
//             //   // console.log(err);
//             // } else {
//             //   // console.log(data);
//             // }
//           }
//         );
//       }
//     })();

//     const proofs = req.files.map((file) => file.location);
//     req.body.proofs = proofs;

//     next();
//   });
// };
