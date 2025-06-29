import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.example.com';


const cache = new Map();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async (config) => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      return Promise.reject(new Error('No internet connection'));
    }

    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);


async function request(method, url, data = null, config = {}) {
  if (method === 'get') {
    const cacheKey = url + JSON.stringify(config.params || {});
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
  }

  const response = await api.request({
    url,
    method,
    data,
    ...config,
  });

  if (method === 'get') {
    const cacheKey = url + JSON.stringify(config.params || {});
    cache.set(cacheKey, response.data);
    setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000)
  }

  return response.data;
}

export const GET = (url, config) => request('get', url, null, config);
export const POST = (url, data, config) => request('post', url, data, config);
export const PUT = (url, data, config) => request('put', url, data, config);
export const PATCH = (url, data, config) => request('patch', url, data, config);
export const DELETE = (url, config) => request('delete', url, null, config);
