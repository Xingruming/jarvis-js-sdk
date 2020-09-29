import axios from 'axios';
import humps from 'humps';
import { BASE_URL } from './consts';

// eslint-disable-next-line import/prefer-default-export
export function createRequest(token = '') {
  const service = axios.create({
    baseURL: token && BASE_URL,
    timeout: 10000,
  });

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
    (error) => Promise.reject(error),
  );

  return service;
}
