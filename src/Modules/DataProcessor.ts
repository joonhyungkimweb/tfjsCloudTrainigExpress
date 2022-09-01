import { parseCsvData, UnheadedCSV } from './CSVPaser';
import { tensor } from '@tensorflow/tfjs-node-gpu';
import { LocalFile } from 'papaparse';

const loadCSVDataset = async (datasetFile: LocalFile) => {
  const {
    data: [, ...data],
  } = await parseCsvData(datasetFile);
  return data;
};
const isSelectedColumn = (columns: number[], index: number) => columns.includes(index);

const extractColumns = (dataSet: UnheadedCSV[], columns: number[]) =>
  dataSet.map((data) => data.filter((_, index) => isSelectedColumn(columns, index)));

export const loadAndProcessCSVData = async (
  datasetFile: LocalFile,
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
