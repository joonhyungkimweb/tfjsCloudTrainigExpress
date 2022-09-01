import { io } from '@tensorflow/tfjs-core';
import fs from 'fs';

const MODEL_DIR = process.env.MODEL_DIR || 'models';

export const createModelSaver = (userId: string, modelName: string): io.IOHandler => ({
  save: async (modelArtifacts) => {
    const modelJSON = JSON.stringify({
      ...modelArtifacts,
      weightsManifest: [
        {
          paths: [`./${modelName}.weights.bin`],
          weights: modelArtifacts.weightSpecs,
        },
      ],
    });

    fs.mkdirSync(`${MODEL_DIR}/${userId}/models/`, { recursive: true });

    fs.writeFileSync(`${MODEL_DIR}/${userId}/models/${modelName}.json`, modelJSON);

    if (modelArtifacts.weightData != null) {
      const modelWeights = Buffer.from(modelArtifacts.weightData);
      fs.writeFileSync(`${MODEL_DIR}/${userId}/models/${modelName}.weights.bin`, modelWeights);
    }

    return {
      modelArtifactsInfo: {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
      },
    };
  },
});
