import aws from 'aws-sdk';

const awsCredentials = aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: 'us-west-1',
});

const s3 = new aws.S3(awsCredentials);

const singleFileDelete = async (req, res, next) => {
  if (req.body.mediaUrl) {
    const mediaUrlKey = req.body.mediaUrl.substring(53);
    await s3.deleteObject(
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

  next();
};

export default singleFileDelete;
