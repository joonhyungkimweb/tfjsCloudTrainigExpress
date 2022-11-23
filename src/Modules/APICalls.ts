import fetch from 'cross-fetch';
import { TrainingEpochParameters, TrainingParameters } from '../@types/TrainingParams';
import { getObject } from '../Modules/Storage';

const TRAINING_ENDPOINT = 'https://api.nocodingai.com/training';
const STATUS_ENDPOINT = `${TRAINING_ENDPOINT}/status`;
const EPOCH_ENDPOINT = `${TRAINING_ENDPOINT}/epoch`;

const fetchWithErrorHandler = async <Data = any>(
  url: string,
  options?: RequestInit
): Promise<Data> => {
  const request = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!request.ok) throw new Error(await request.text());
  return request.json();
};

const updateTrainingStatus = async (
  trainingId: number,
  status: 'start' | 'preprocessing' | 'training' | 'finish' | 'error',
  options?: {
    datasetId?: number;
    errorMessages?: string;
  }
) =>
  fetchWithErrorHandler(`${STATUS_ENDPOINT}/${trainingId}`, {
    method: 'PUT',
    body: JSON.stringify({ status, ...options }),
  });

export const createTrainingSession = (modelId: number, TrainingParameters: TrainingParameters) =>
  fetchWithErrorHandler(`${TRAINING_ENDPOINT}/${modelId}`, {
    method: 'POST',
    body: JSON.stringify(TrainingParameters),
  });

export const startTrainingSession = (trainingId: number) =>
  updateTrainingStatus(trainingId, 'start');

export const preprocessAndFetchMetadata = async (trainingId: number, datasetId: number) => {
  const {
    data: { datasetPath },
  } = await updateTrainingStatus(trainingId, 'preprocessing', { datasetId });

  return getObject(datasetPath);
};

export const startTrainningProcess = (trainingId: number) =>
  updateTrainingStatus(trainingId, 'training');

export const finishTrainingSession = (trainingId: number) =>
  updateTrainingStatus(trainingId, 'finish');

export const errorOnTrainingSession = (trainingId: number, errorMessages: string) =>
  updateTrainingStatus(trainingId, 'error', { errorMessages });

export const updateEpochResult = async (trainingId: number, epochParams: TrainingEpochParameters) =>
  fetchWithErrorHandler(`${EPOCH_ENDPOINT}/${trainingId}`, {
    method: 'PUT',
    body: JSON.stringify(epochParams),
  });
