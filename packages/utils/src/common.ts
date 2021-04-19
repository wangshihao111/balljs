export const WORKER_ENV_NTH = 'WORKER_ENV_NTH';

export const isFirstWorker = () => Number(process.env[WORKER_ENV_NTH]) === 0;
