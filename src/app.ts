import './utils/env';
import express, { Express, json, Request, Response } from 'express';
import cors from 'cors';
import {
  StableDiffusionRequestParameters,
  TfjsParametersWithDataType,
  TfjsRequestParameters,
  TrainingRequestParameters,
} from './@types/TrainingParams';
import { trainCSVModel } from './Modules/CSVTrainer';
import { trainImageModel } from './Modules/ImageTrainer';
import { createTrainingSession, startTrainingSession } from './Modules/APICalls';
import { trainStableDiffusionModel } from './Modules/StableDiffusionTrainer';

const app: Express = express();
app.use(cors());
app.use(json());
const port = process.env.PORT ?? 8080;

app.post('/', async (req: Request<null, any, TrainingRequestParameters>, res: Response) => {
  try {
    if (req.body.platform === 'tfjs') {
      const requestBody = req.body as TfjsRequestParameters;
      if (
        requestBody.dataType == null ||
        (requestBody.dataType !== 'TEXT' && requestBody.dataType !== 'IMAGE')
      )
        throw new Error('Invalid Data type');
      const {
        data: { id: trainingId },
      } = await createTrainingSession(req.body);
      await startTrainingSession(trainingId);

      res.status(200).send();
      if (requestBody.dataType === 'TEXT')
        await trainCSVModel(trainingId, req.body as TfjsParametersWithDataType<'TEXT'>);
      if (requestBody.dataType === 'IMAGE')
        await trainImageModel(trainingId, req.body as TfjsParametersWithDataType<'IMAGE'>);
      return;
    }

    if (req.body.platform === 'stableDiffusion') {
      const requestBody = req.body as StableDiffusionRequestParameters;
      const {
        data: { id: trainingId },
      } = await createTrainingSession(req.body);
      trainStableDiffusionModel({
        ...requestBody,
        trainingOptions: {
          ...requestBody.trainingOptions,
          trainingId,
        },
      });
      res.status(200).send();
      return;
    }
    res.status(400).send();
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
