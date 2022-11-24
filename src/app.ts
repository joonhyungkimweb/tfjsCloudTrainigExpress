import './utils/env';
import express, { Express, json, Request, Response } from 'express';
import cors from 'cors';
import { TrainingParametersWithDataType, TrainingRequestParameters } from './@types/TrainingParams';
import { trainCSVModel } from './Modules/CSVTrainer';
import { trainImageModel } from './Modules/ImageTrainer';
import { createTrainingSession, startTrainingSession } from './Modules/APICalls';

const app: Express = express();
app.use(cors());
app.use(json());
const port = process.env.PORT ?? 8080;

app.post('/', async (req: Request<null, any, TrainingRequestParameters>, res: Response) => {
  try {
    if (req.body.type == null || (req.body.type !== 'csv' && req.body.type !== 'image'))
      throw new Error('Invalid Data type');
    const {
      data: {
        training: { id: trainingId },
      },
    } = await createTrainingSession(req.body);
    await startTrainingSession(trainingId);

    res.status(200).send();
    if (req.body.type === 'csv')
      await trainCSVModel(trainingId, req.body as TrainingParametersWithDataType<'csv'>);
    if (req.body.type === 'image')
      await trainImageModel(trainingId, req.body as TrainingParametersWithDataType<'image'>);
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
