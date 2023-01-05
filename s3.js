const S3 = require("aws-sdk/clients/s3");
require('dotenv').config()

const region =  process.env.AWS_BUCKET_REGION;
const accessKeyId =  process.env.AWS_ACCESS_KEY;
const secretAccessKey =  process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// upload image to AWS
function uploadFile(file, idx) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file,
    Key: idx,
    ACL:'public-read'
  };

  return s3.upload(uploadParams).promise;
}

exports.uploadFile = uploadFile;
