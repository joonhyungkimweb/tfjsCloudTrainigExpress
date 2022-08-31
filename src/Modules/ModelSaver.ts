import { io } from '@tensorflow/tfjs-core';

export const createModelSaver = (modelName: string): io.IOHandler => ({
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

    if (modelArtifacts.weightData != null) {
      const modelWeights = Buffer.from(modelArtifacts.weightData);
    }

    return {
      modelArtifactsInfo: {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
      },
    };
  },
});
