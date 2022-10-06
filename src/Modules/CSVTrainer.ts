import { CSVParams } from '../@types/TrainingParams';
import { loadAndProcessCSVData } from './DataProcessor';
import { getStatus, onError, onFinish, onStart, onTraining } from './DB';
import { LoadModel } from './ModelLoader';
import { createModelSaver } from './ModelSaver';
import { compileOptimizer, trainModel } from './ModelTrainer';

export const trainCSVModel = async (params: CSVParams) => {
  const trainingSeq = `training-${+new Date()}`;
  try {
    await onStart(params, trainingSeq);
    const trainingDataset = await loadAndProcessCSVData(
      params.datasetPath,
      params.xColumns,
      params.yColumns
    );
    const model = await LoadModel(params.modelPath, params.weightsPath);
    const result = await trainModel(
      trainingDataset,
      model,
      {
        optimizer: compileOptimizer(params.optimizer, params.learningRate),
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
            const prefix = `${params.userId}/trained-models/${params.projectName}/${trainingSeq}`;
            const modelFileName = `${params.modelName}-epoch${epoch}`;

            const currentStatus = await getStatus(trainingSeq!);
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
  } catch (error) {
    console.error(error);
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    if (trainingSeq == null) return;
    await onError(trainingSeq, message);
  }
};
