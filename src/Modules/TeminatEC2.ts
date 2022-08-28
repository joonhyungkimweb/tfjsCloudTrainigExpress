import fetch from 'cross-fetch';

const CALLBACK_GATEWAY =
  'https://loh99h6rjc.execute-api.ap-northeast-2.amazonaws.com/prod/cloud-training';

const EC2_METADATA_API = 'http://169.254.169.254/latest/meta-data/instance-id';

const getInstanceId = async (): Promise<string> => {
  const request = await fetch(EC2_METADATA_API);
  if (!request.ok) throw new Error('network error');
  return await request.text();
};
const fetchDelete = (instanceId: string) =>
  fetch(`${CALLBACK_GATEWAY}?id=${instanceId}`, {
    method: 'DELETE',
  });

export const terminateInstance = async () => fetchDelete(await getInstanceId());
