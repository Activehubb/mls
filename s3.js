const S3 = require("aws-sdk/clients/s3");
const { keys } = require("./config/config");

const region = keys.AWS_BUCKET_REGION;
const accessKeyId = keys.AWS_ACCESS_KEY;
const secretAccessKey = keys.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// upload image to AWS
function uploadFile(file, idx) {
  const uploadParams = {
    Bucket: keys.AWS_BUCKET_NAME,
    Body: file,
    Key: idx,
  };

  return s3.upload(uploadParams).promise;
}

exports.uploadFile = uploadFile;
