import { dispose } from '@tensorflow/tfjs-node-gpu';
import { ImageParams } from '../@types/TrainingParams';
import { getStatus, onError, onFinish, onProcessing, onTraining } from './DB';
import { loadAndProcessImageData } from './ImageProcessor';
import { LoadModel } from './ModelLoader';
import { createModelSaver } from './ModelSaver';
import { compileOptimizer, trainModel } from './ModelTrainer';

export const trainImageModel = async (params: ImageParams, trainingSeq: string) => {
  try {
    await onProcessing(trainingSeq);

    const trainingDataset = await loadAndProcessImageData(
      params.datasetPath,
      params.width,
      params.height,
      params.channel,
      params.normalize
    );

    const model = await LoadModel(params.modelPath, params.weightsPath);
    const optimizer = compileOptimizer(params.optimizer, params.learningRate);

    await trainModel(
      trainingDataset,
      model,
      {
        optimizer,
        loss: params.loss,
        metrics: params.metrics,
      },
      {
        batchSize: params.batchSize,
        epochs: params.epochs,
        shuffle: params.shuffle,
        validationSplit: params.validationSplit,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const prefix = `${params.userId}/trained-models/${params.modelName}/${trainingSeq}`;
            const modelFileName = `${params.modelName}-epoch${epoch}`;
            const currentStatus = await getStatus(trainingSeq);
            if (currentStatus == null || currentStatus === 'stopped') return;
            await model.save(createModelSaver(prefix, modelFileName));
            await onTraining(
              trainingSeq,
              Object.entries(logs!).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: { N: `${value}` } }),
                {}
              ),
              {
                modelPath: {
                  S: `${modelFileName}.json`,
                },
                weightsPath: {
                  S: `${modelFileName}.weights.bin`,
                },
              },
              epoch + 1
            );
          },
          onTrainEnd: async () => {
            await onFinish(trainingSeq);
          },
        },
      }
    );
    optimizer.dispose();
    model.dispose();
    dispose(trainingDataset);
  } catch (error) {
    console.error(error);
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    if (trainingSeq == null) return;
    await onError(trainingSeq, message);
  }
};
