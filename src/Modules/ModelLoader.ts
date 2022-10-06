import { loadLayersModel, io } from '@tensorflow/tfjs-node-gpu';
import { generateGetURL } from './Storage';

export const LoadModel = async (modelPath: string, weightPath: string) => {
  const modelURL = await generateGetURL(modelPath);
  const weightURL = await generateGetURL(weightPath);
  const handler = io.browserHTTPRequest(modelURL, {
    weightUrlConverter: async () => weightURL,
  });
  return await loadLayersModel(handler);
};
