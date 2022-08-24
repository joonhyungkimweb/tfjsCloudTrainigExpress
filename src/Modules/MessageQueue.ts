import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

const client = new SQSClient({
  region: 'ap-northeast-2',
});

const QueueUrl = process.env.QUEUE_URL;

export const getMessage = () =>
  client.send(
    new ReceiveMessageCommand({
      QueueUrl,
    })
  );

export const deleteMessage = (ReceiptHandle: string) =>
  client.send(
    new DeleteMessageCommand({
      QueueUrl,
      ReceiptHandle,
    })
  );
