import { loadLayersModel, io } from '@tensorflow/tfjs-node-gpu';
import { io as coreIo } from '@tensorflow/tfjs-core';

const convertBuffertToString = (buffer: Buffer) =>
  String.fromCharCode(...Array.from(new Uint16Array(buffer)));

export const LoadModel = async (modelBuffer: Buffer, weightBuffer: Buffer) => {
  const convertedModelArtifacts: coreIo.ModelJSON = JSON.parse(convertBuffertToString(modelBuffer));

  return await loadLayersModel({
    load: () =>
      io.getModelArtifactsForJSON(convertedModelArtifacts, async (weightsManifest) => [
        weightsManifest.map(({ weights }) => weights).flat(),
        weightBuffer.buffer,
      ]),
  });
};
