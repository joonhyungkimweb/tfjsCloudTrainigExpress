import express, { Express, Request, Response } from 'express';
import multer from 'multer';
import { loadAndProcessCSVData } from './Modules/DataProcessor';
import { Readable } from 'stream';
import { LoadModel } from './Modules/ModelLoader';
import { trainModel } from './Modules/ModelTrainer';
import { createModelSaver } from './Modules/ModelSaver';

const uplaod = multer({ storage: multer.memoryStorage() });

const app: Express = express();
const port = process.env.PORT ?? 8080;

type TrainingFileFields = 'dataFile' | 'modelFile' | 'weightFile';

type TrainingFileBody = {
  [fieldname in TrainingFileFields]: Express.Multer.File[];
};

app.post(
  '/',
  uplaod.fields([{ name: 'dataFile' }, { name: 'modelFile' }, { name: 'weightFile' }]),
  async (req: Request, res: Response) => {
    try {
      const {
        dataFile: [{ buffer: dataFileBuffer }],
        modelFile: [{ buffer: modelFileBuffer }],
        weightFile: [{ buffer: weightFileBuffer }],
      } = req.files as TrainingFileBody;

      const dataset = await loadAndProcessCSVData(
        Readable.from(dataFileBuffer),
        JSON.parse(req.body.xColumns),
        JSON.parse(req.body.yColumns)
      );

      const model = await LoadModel(modelFileBuffer, weightFileBuffer);

      const result = await trainModel(
        dataset,
        model,
        {
          optimizer: req.body.optimizer,
          loss: req.body.loss,
          metrics: req.body.metrics,
        },
        {
          batchSize: +req.body.batchSize,
          epochs: +req.body.epochs,
          shuffle: JSON.parse(req.body.shuffle),
          validationSplit: +req.body.validationSplit,
        }
      );

      model.save(createModelSaver(req.body.userId, req.body.modelName));

      res.send(JSON.stringify(result));
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send((err as Error).message);
    }
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
