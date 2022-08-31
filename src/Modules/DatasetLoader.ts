import { parseCsvData } from './CSVPaser';

export const loadCSVDatasets = async (file: Blob) => {
  const {
    data: [, ...data],
  } = await parseCsvData(file);

  return data;
};
