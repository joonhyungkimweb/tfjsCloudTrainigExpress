import { parseCsvData, UnheadedCSV } from './CSVPaser';
import { tensor } from '@tensorflow/tfjs-node-gpu';

const loadCSVDataset = async (datasetFile: Blob) => {
  const {
    data: [, ...data],
  } = await parseCsvData(datasetFile);
  return data;
};
const isSelectedColumn = (columns: number[], index: number) => columns.includes(index);

const extractColumns = (dataSet: UnheadedCSV[], columns: number[]) =>
  dataSet.map((data) => data.filter((_, index) => isSelectedColumn(columns, index)));

export const loadAndProcessCSVData = async (
  datasetFile: Blob,
  xColumns: number[],
  yColumns: number[]
) => {
  const data = await loadCSVDataset(datasetFile);
  const xsArray = extractColumns(data, xColumns);
  const ysArray = extractColumns(data, yColumns);
  return {
    xs: tensor(xsArray),
    ys: tensor(ysArray),
  };
};
