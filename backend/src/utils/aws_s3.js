import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (file, key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key, // e.g., 'audio/filename.wav'
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // or 'private'
  };

  return s3.upload(params).promise();
};

export default uploadFileToS3;