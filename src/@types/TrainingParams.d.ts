export interface TrainingParams {
  userId: string;
  modelName: string;
  type: 'image' | 'csv';
  datasetPath: string;
  modelPath: string;
  weightsPath: string;
  optimizer: string;
  loss: string;
  metrics: string;
  learningRate: number;
  epochs: number;
  batchSize: number;
  shuffle: boolean;
  validationSplit: number;
}

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

export interface CSVParams extends TrainingParams {
  xColumns: number[];
  yColumns: number[];
}
export interface ImageParams extends TrainingParams {
  width: number;
  height: number;
  channel: number;
  normalize: boolean;
}
export interface TrainingParameters {
  epochs: number;
  batchSize: number;
  learningRate: number;
  loss: TrainingLossFunction;
  metrics: TrainingMetrics;
  optimizer: TrainingOptimizer;
  shuffle: boolean;
  trainingOptions: CSVParams | ImageParams;
  datasetId: number;
}

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
