import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (file, folder = 'others') => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer, //from multer
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // This will return the file's URL in the S3 bucket
  } catch (err) {
    console.error("Error uploading image to S3:", err);
    throw new Error("Error uploading image to S3");
  }
};

export default uploadImageToS3;
