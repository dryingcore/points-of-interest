import axios from 'axios';
import { getPOIsAPI } from '@/api/endpoints/poi';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8888',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = getPOIsAPI(apiClient);
