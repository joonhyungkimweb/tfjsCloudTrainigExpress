import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const client = new S3Client({
  region: 'ap-northeast-2',
});

const BucketName = process.env.BUCKET_NAME;

const commandGetObject = (filePath: string) =>
  new GetObjectCommand({
    Bucket: BucketName,
    Key: filePath,
  });

export const getObject = (filePath: string) => client.send(commandGetObject(filePath));

export const generateGetURL = (filePath: string) =>
  getSignedUrl(client, commandGetObject(filePath), { expiresIn: 3600 });
