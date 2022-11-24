export enum TrainingLossFunction {
  categoricalCrossentropy,
  sparseCategoricalCrossentropy,
  meanSquaredError,
  meanAbsoluteError,
  binaryCrossentropy,
}

export enum TrainingMetrics {
  accuracy,
  mse,
  precision,
  crossentropy,
}

export enum TrainingOptimizer {
  SGD,
  ADAM,
  ADAMAX,
}

export interface CSVParams {
  xColumns: number[];
  yColumns: number[];
}
export interface ImageParams {
  width: number;
  height: number;
  channel: number;
  normalize: boolean;
}

export interface TrainingParameters {
  epochs: number;
  batchSize: number;
  learningRate: number;
  loss: keyof typeof TrainingLossFunction;
  metrics: keyof typeof TrainingMetrics;
  optimizer: keyof typeof TrainingOptimizer;
  shuffle: boolean;
  trainingOptions: CSVParams | ImageParams;
  datasetId: number;
  modelId: number;
  validationSplit: number;
}

export interface TrainingRequestParameters extends TrainingParameters {
  userId: string;
  modelPath: string;
  weightsPath: string;
  datasetPath: string;
  type: 'csv' | 'image';
}

export type TrainingResponse = {
  id: number;
  trainingStatus: TrainingStatus;
};
export interface TrainingEpochParameters {
  epochsDone: number;
  history: {
    loss: number;
    valLoss: number;
    subMetric: number;
    valSubMetric: number;
  };
  modelFile: {
    fileName: string;
    filePath: string;
    fileSize: number;
  };
  weightsFile?: {
    fileName: string;
    filePath: string;
    fileSize: number;
  };
}
