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

interface StableDiffusionParams {
  imageUrlDirectory: string;
  modelName: string;
  placeholderToken: string;
  initializerToken: string;
  whatToTeach: string;
}

export interface TrainingParameters {
  epochs: number;
  batchSize: number;
  learningRate: number;
  datasetId: number;
  modelId: number;
  trainingOptions: CSVParams | ImageParams | StableDiffusionParams;
}

export interface TfjsParams extends TrainingParameters {
  loss: keyof typeof TrainingLossFunction;
  dataType: DataType;
  validationSplit: number;
  metrics: keyof typeof TrainingMetrics;
  optimizer: keyof typeof TrainingOptimizer;
  shuffle: boolean;
}

export interface TrainingRequestParameters extends TrainingParameters {
  trainingId: number;
  userId: string;
  platform: 'tfjs' | 'stableDiffusion';
}
export interface TfjsRequestParameters extends TfjsParams, TrainingRequestParameters {
  modelPath: string;
  weightsPath: string;
  datasetPath: string;
  platform: 'tfjs';
}

export interface TfjsParametersWithDataType<TrainingType extends DataType>
  extends TfjsRequestParameters {
  dataType: TrainingType extends 'TEXT' ? 'TEXT' : 'IMAGE';
  trainingOptions: TrainingType extends 'TEXT' ? CSVParams : ImageParams;
}

export interface StableDiffusionRequestParameters extends TrainingRequestParameters {
  platform: 'stableDiffusion';
  trainingOptions: StableDiffusionParams;
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
