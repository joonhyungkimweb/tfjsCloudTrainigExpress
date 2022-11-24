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

type DataType = 'TEXT' | 'IMAGE';

interface CSVParams {
  xColumns: number[];
  yColumns: number[];
}
interface ImageParams {
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
  dataType: DataType;
}

export interface TrainingRequestParameters extends TrainingParameters {
  userId: string;
  modelPath: string;
  weightsPath: string;
  datasetPath: string;
}

export interface TrainingParametersWithDataType<TrainingType extends DataType>
  extends TrainingRequestParameters {
  dataType: TrainingType extends 'TEXT' ? 'TEXT' : 'IMAGE';
  trainingOptions: TrainingType extends 'TEXT' ? CSVParams : ImageParams;
}

export type TrainingResponse = {
  data: {
    id: number;
    trainingStatus: TrainingStatus;
  };
};
export interface TrainingEpochParameters {
  epochsDone: number;
  history: {
    loss: number;
    valLoss?: number;
    subMetric?: number;
    valSubMetric?: number;
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

export interface CSVMetaData {
  fileData: {
    filepath: string;
  };
}

export type ImageMetadata = { className: string; URL: string }[];
