import { parse, unparse, ParseConfig, ParseResult } from 'papaparse';

export type ParsedCSVArray = number | string | null;
export type UnheadedCSV = ParsedCSVArray[];

const csvParser = (option: ParseConfig) => (blob: Blob | string) =>
  new Promise<ParseResult<UnheadedCSV>>((complete, error) => {
    parse<UnheadedCSV>(blob, { ...option, complete, error });
  });

export const parseCsvData = csvParser({
  skipEmptyLines: true,
  dynamicTyping: true,
});
