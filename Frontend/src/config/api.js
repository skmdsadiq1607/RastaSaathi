import axios from 'axios';
import env from './env';

let getAccessToken = () => null;
let onRefresh = async () => null;
let onForbidden = () => {};

export const apiClient = axios.create({ baseURL: env.apiBaseUrl, withCredentials: true, timeout: 12000 });

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const token = await onRefresh();
      if (token) {
        original.headers.Authorization = 'Bearer ' + token;
        return apiClient(original);
      }
    }
    if (error.response?.status === 403) onForbidden();
    return Promise.reject(error);
  }
);

export function configureApiClient(handlers) {
  getAccessToken = handlers.getAccessToken || getAccessToken;
  onRefresh = handlers.onRefresh || onRefresh;
  onForbidden = handlers.onForbidden || onForbidden;
}

export const axiosBaseQuery = () => async ({ url, method = 'get', data, params, headers }) => {
  try {
    const result = await apiClient({ url, method, data, params, headers });
    return { data: result.data };
  } catch (axiosError) {
    return { error: { status: axiosError.response?.status || 500, data: axiosError.response?.data || { message: axiosError.message } } };
  }
};
