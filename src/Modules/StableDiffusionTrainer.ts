import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'; // ES Modules import
import { StableDiffusionRequestParameters } from '../@types/TrainingParams';

const client = new LambdaClient({ region: 'ap-northeast-2' });

export const trainStableDiffusionModel = ({
  trainingId,
  userId,
  datasetId,
  modelId,
  epochs,
  batchSize,
  learningRate,
  trainingOptions: {
    modelName,
    imageUrlDirectory,
    placeholderToken,
    initializerToken,
    whatToTeach,
  },
}: StableDiffusionRequestParameters) =>
  client.send(
    new InvokeCommand({
      FunctionName: 'sagemaker-stable-diffusion-trai-HelloWorldFunction-Isu9iHgq398O',
      Payload: Buffer.from(
        JSON.stringify({
          queryStringParameters: {
            trainingId,
            placeholderToken,
            initializerToken,
            userId,
            modelId,
            datasetId,
            imageUrlDirectory,
            modelName,
            whatToTeach,
            learningRate,
            epochs,
            batchSize,
          },
        })
      ),
    })
  );
