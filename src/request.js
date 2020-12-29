import axios from 'axios';
import * as rax from 'retry-axios';
import humps from 'humps';
import { BASE_URL } from './consts';

// eslint-disable-next-line import/prefer-default-export
export function createRequest(token = '', enableRetry = false) {
  const service = axios.create({
    baseURL: token && BASE_URL,
    timeout: 10000,
  });
  if (enableRetry) {
    service.defaults.raxConfig = {
      instance: service,
      httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS'],
      retry: 3,
      noResponseRetries: 3,
      backoffType: 'exponential',
      statusCodesToRetry: [[401, 499], [500, 599]],
      onRetryAttempt: (err) => {
        const cfg = rax.getConfig(err);
        // eslint-disable-next-line no-console
        console.log(`Retry attempt #${cfg.currentRetryAttempt}`);
      },
    };
    rax.attach(service);
  }
  service.interceptors.request.use(
    (config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      if (config.data && !(config.data instanceof FormData)) {
        config.data = humps.decamelizeKeys(config.data);
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  service.interceptors.response.use(
    (response) => {
      response.data = humps.camelizeKeys(response.data);
      return response;
    },
    (error) => {
      const { request } = error;
      if (request) {
        // eslint-disable-next-line no-console
        console.error('Request Error: ', request.method, request.url, request.params);
      }
      return Promise.reject(error);
    },
  );

  return service;
}
