export interface TrainingParams {
  userId: string;
  projectName: string;
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

export interface CSVParams extends TrainingParams {
  xColumns: number[];
  yColumns: number[];
}
