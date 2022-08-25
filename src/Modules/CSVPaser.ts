import { parse, ParseConfig, ParseResult } from 'papaparse';
export type UnheadedCSV = number[];

const csvParser = (option: ParseConfig) => (blob: Blob | string) =>
  new Promise<ParseResult<UnheadedCSV>>((complete, error) => {
    parse<UnheadedCSV>(blob, { ...option, complete, error });
  });

export const parseCsvData = csvParser({
  skipEmptyLines: true,
  dynamicTyping: true,
});
