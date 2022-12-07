import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'; // ES Modules import
import { StableDiffusionRequestParameters } from '../@types/TrainingParams';

const client = new LambdaClient({ region: 'ap-northeast-2' });

export const trainStableDiffusionModel = async ({
  userId,
  datasetId,
  modelId,
  modelName,
  imageUrlDirectory,
  epochs,
  batchSize,
  learningRate,
  placeholderToken,
  initializerToken,
  whatToTeach,
}: StableDiffusionRequestParameters) => {
  const command = new InvokeCommand({
    FunctionName: 'sagemaker-stable-diffusion-trai-HelloWorldFunction-Isu9iHgq398O',
    Payload: Buffer.from(
      JSON.stringify({
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
      })
    ),
  });
  return client.send(command);
};
