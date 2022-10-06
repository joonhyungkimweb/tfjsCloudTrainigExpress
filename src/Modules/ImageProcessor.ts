import { getObject } from './Storage';
import { tensor, tidy, node, image, Tensor4D, stack, util } from '@tensorflow/tfjs-node-gpu';
import { Readable } from 'stream';

const streamToBuffer = (stream: Readable) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

const loadImageList = async (imageListURL: string): Promise<string[]> => {
  const { Body } = await getObject(imageListURL);
  return JSON.parse((await streamToBuffer(Body as Readable)).toString('utf-8'));
};

const loadImageFile = async (imageURL: string) => {
  const { Body } = await getObject(imageURL.split('/').slice(3).join('/'));
  return streamToBuffer(Body as Readable);
};

const convertCanvasToTensor = (
  content: Buffer,
  width: number,
  height: number,
  channel: number,
  normalize: boolean
) =>
  tidy(() => {
    const imageTensor = node.decodeImage(content, channel);
    return image
      .cropAndResize(
        imageTensor.reshape<Tensor4D>([1, ...imageTensor.shape]),
        [[0, 0, 1, 1]],
        [0],
        [height, width]
      )
      .cast('int32')
      .reshape([height, width, channel])
      .div(normalize ? 255 : 1);
  });

const makeOnehotLabels = (uniqueValues: (string | number)[], datas: (string | number)[]) => {
  return datas.map((value) => uniqueValues.map((e) => +(value === e)));
};

export const loadAndProcessImageData = async (
  datasetURL: string,
  width: number,
  height: number,
  channel: number,
  normalize: boolean
) => {
  const imageList = await loadImageList(datasetURL);
  const uniqueValues = Array.from(
    new Set(imageList.map((url) => url.split('/').slice(-2)[0]))
  ).sort();

  util.shuffle(imageList);

  const xs = stack(
    await Promise.all(
      imageList.map(async (url) =>
        convertCanvasToTensor(await loadImageFile(url), width, height, channel, normalize)
      )
    )
  );

  const ys = tensor(
    makeOnehotLabels(
      uniqueValues,
      imageList.map((url) => url.split('/').slice(-2)[0])
    )
  );

  return {
    xs,
    ys,
  };
};
