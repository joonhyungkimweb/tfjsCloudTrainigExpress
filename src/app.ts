import express, { Express, json, Request, Response } from 'express';
import { loadAndProcessCSVData } from './Modules/DataProcessor';
import { Readable } from 'stream';
import { LoadModel } from './Modules/ModelLoader';
import { trainModel } from './Modules/ModelTrainer';
import { createModelSaver } from './Modules/ModelSaver';
import cors from 'cors';
import { CSVParams, ImageParams, TrainingParams } from './@types/TrainingParams';
import { onStart } from './Modules/DB';
import { trainCSVModel } from './Modules/CSVTrainer';
import { trainImageModel } from './Modules/ImageTrainer';

const app: Express = express();
app.use(cors());
app.use(json());
const port = process.env.PORT ?? 8080;

app.post('/', async (req: Request<null, any, TrainingParams>, res: Response) => {
  try {
    if (req.body.type == null || (req.body.type !== 'csv' && req.body.type !== 'image'))
      throw new Error('Invalid Data type');
    res.status(200).send();
    if (req.body.type === 'csv') await trainCSVModel(req.body as CSVParams);
    if (req.body.type === 'image') await trainImageModel(req.body as ImageParams);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send((err as Error).message);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
