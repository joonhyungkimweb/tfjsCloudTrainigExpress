import {
  DynamoDBClient,
  UpdateItemCommand,
  AttributeValue,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { TrainingParams } from '../@types/TrainingParams';

const client = new DynamoDBClient({
  region: 'ap-northeast-2',
});

const TRAINING_TABLE = process.env.TRAINING_TABLE;
const MODEL_TABLE = process.env.MODEL_TABLE;

const parseParam = (param: any): AttributeValue => {
  if (typeof param === 'string') return { S: param };
  if (typeof param === 'number') return { N: `${param}` };
  if (Array.isArray(param)) return { L: param.map(parseParam) };
  if (typeof param === 'object')
    return {
      M: Object.entries(param).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: parseParam(value) }),
        {}
      ),
    };
  if (typeof param === 'boolean') return { BOOL: param };
  return { NULL: true };
};

const commandPut = <P extends TrainingParams>(params: P, trainingSeq: string) =>
  new PutItemCommand({
    TableName: TRAINING_TABLE,
    Item: {
      trainingSeq: {
        S: trainingSeq,
      },
      status: { S: 'provisioning' },
      history: { L: [] },
      files: { L: [] },
      errorMessage: { NULL: true },
      startTime: { N: `${+new Date()}` },
      finishTime: { NULL: true },
      epochsDone: { N: '0' },
      ...Object.entries(params).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: parseParam(value) }),
        {}
      ),
    },
  });

const commandUpdate = (
  trainingSeq: string,
  status: 'preprocessing' | 'training' | 'finished' | 'error',
  keys?: Record<string, string>,
  values?: Record<string, AttributeValue>,
  setExpression?: string
) =>
  new UpdateItemCommand({
    TableName: TRAINING_TABLE,
    Key: {
      trainingSeq: {
        S: trainingSeq,
      },
    },
    ExpressionAttributeNames: { '#status': 'status', ...keys },
    ExpressionAttributeValues: { ':status': { S: status }, ...values },
    UpdateExpression: `SET #status = :status${setExpression == null ? '' : `, ${setExpression}`}`,
  });

const commandUpdateModel = (userId: string, modelName: string, trainingSeq: string) =>
  new UpdateItemCommand({
    Key: {
      email: { S: userId },
    },
    ExpressionAttributeNames: { '#title': modelName, '#trainingSession': 'trainingSession' },
    ExpressionAttributeValues: { ':trainingSeq': { L: [{ S: trainingSeq }] } },
    UpdateExpression: `SET models.#title.#trainingSession = :trainingSeq`,
    TableName: MODEL_TABLE,
  });

export const getParams = (instanceId: string) =>
  client.send(
    new ScanCommand({
      TableName: TRAINING_TABLE,
      ExpressionAttributeNames: { '#instanceId': 'instanceId' },
      ExpressionAttributeValues: { ':instanceId': { S: instanceId } },
      FilterExpression: '#instanceId = :instanceId',
    })
  );

export const getStatus = async (trainingSeq: string) => {
  const { Item } = await client.send(
    new GetItemCommand({
      TableName: TRAINING_TABLE,
      Key: {
        trainingSeq: {
          S: trainingSeq,
        },
      },
      ProjectionExpression: '#status',
      ExpressionAttributeNames: { '#status': 'status' },
    })
  );
  return Item?.status.S;
};

export const onStart = async <P extends TrainingParams>(params: P, trainingSeq: string) => {
  await client.send(commandPut(params, trainingSeq));
  await client.send(commandUpdateModel(params.userId, params.modelName, trainingSeq));
};

export const onProcessing = (trainingSeq: string) =>
  client.send(commandUpdate(trainingSeq, 'preprocessing'));

export const onTraining = (
  trainingSeq: string,
  history: Record<string, AttributeValue>,
  files: Record<string, AttributeValue>,
  epochsDone: number
) =>
  client.send(
    commandUpdate(
      trainingSeq,
      'training',
      { '#history': 'history', '#files': 'files', '#epochsDone': 'epochsDone' },
      {
        ':history': { L: [{ M: history }] },
        ':files': { L: [{ M: files }] },
        ':epochsDone': { N: `${epochsDone}` },
      },
      '#history = list_append(#history, :history), #files = list_append(#files, :files), #epochsDone = :epochsDone'
    )
  );

export const onFinish = (trainingSeq: string) =>
  client.send(
    commandUpdate(
      trainingSeq,
      'finished',
      { '#finishTime': 'finishTime' },
      {
        ':finishTime': { N: `${+new Date()}` },
      },
      '#finishTime = :finishTime'
    )
  );

export const onError = (trainingSeq: string, errorMessage: string) =>
  client.send(
    commandUpdate(
      trainingSeq,
      'error',
      { '#errorMessage': 'errorMessage' },
      {
        ':errorMessage': { S: errorMessage },
      },
      '#errorMessage = :errorMessage'
    )
  );
