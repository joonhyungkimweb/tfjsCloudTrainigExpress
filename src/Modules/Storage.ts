import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'ap-northeast-2',
});

const BucketName = process.env.BUCKET_NAME;

export const getObject = (filePath: string) =>
  client.send(
    new GetObjectCommand({
      Bucket: BucketName,
      Key: filePath,
    })
  );
