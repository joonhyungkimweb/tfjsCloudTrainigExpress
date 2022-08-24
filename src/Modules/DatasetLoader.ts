import { getObject } from './Storage';
import { parseCsvData } from './CSVPaser';

export const loadCSVDatasets = async (filePath: string) => {
  const file = await getObject(filePath);
  const {
    data: [, ...data],
  } = await parseCsvData(file.Body as Blob);

  return data;
};
