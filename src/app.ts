import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

const client = new SQSClient({
  region: 'ap-northeast-2',
});

const QueueUrl = process.env.QUEUE_URL;

const getMessage = () =>
  client.send(
    new ReceiveMessageCommand({
      QueueUrl,
    })
  );

const deleteMessage = (ReceiptHandle: string) =>
  client.send(
    new DeleteMessageCommand({
      QueueUrl,
      ReceiptHandle,
    })
  );

const start = async () => {
  const { Messages } = await getMessage();
  if (Messages == null) return;
  const [{ Body, MessageId, ReceiptHandle }] = Messages;
  console.log({ MessageId, Body });
  if (ReceiptHandle) await deleteMessage(ReceiptHandle);
};

start();
