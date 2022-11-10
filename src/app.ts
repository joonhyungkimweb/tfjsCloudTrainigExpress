import express, { Express, json, Request, Response } from 'express';
import cors from 'cors';
import { CSVParams, ImageParams, TrainingParams } from './@types/TrainingParams';
import { trainCSVModel } from './Modules/CSVTrainer';
import { trainImageModel } from './Modules/ImageTrainer';
import { onStart } from './Modules/DB';

const app: Express = express();
app.use(cors());
app.use(json());
const port = process.env.PORT ?? 8080;

app.post('/', async (req: Request<null, any, TrainingParams>, res: Response) => {
  try {
    if (req.body.type == null || (req.body.type !== 'csv' && req.body.type !== 'image'))
      throw new Error('Invalid Data type');
    const trainingSeq = `training-${+new Date()}`;
    await onStart(req.body, trainingSeq);
    res.status(200).send();
    if (req.body.type === 'csv') await trainCSVModel(req.body as CSVParams, trainingSeq);
    if (req.body.type === 'image') await trainImageModel(req.body as ImageParams, trainingSeq);
  } catch (err) {
    console.error(err);
    console.log(new Date(), req.hostname);
    res.status(500);
    res.send((err as Error).message);
  }
});

app.get('/', (_, res) => {
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
