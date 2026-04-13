import axios from 'axios';
import { API_BASE } from '../constants';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg: string =
      error?.response?.data?.message || 'Server error, please try again';
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: msg } }));
    return Promise.reject(error);
  }
);

export default api;

// --- Types ---

export interface SensorReading {
  sensorCode: string;
  type: string;
  unit: string;
  value: number;
  status: string;
  recordedAt: string;
}

export interface ChartDataPoint {
  value: number;
  recordedAt: string;
}

export interface ChartDataset {
  sensorCode: string;
  type: string;
  unit: string;
  data: ChartDataPoint[];
}

export interface Device {
  id: number;
  name: string;
  deviceCode: string;
  type: string;
  currentStatus: 'ON' | 'OFF';
}

export interface SensorDataRow {
  id: number;
  sensorId: number;
  sensor: {
    id: number;
    name: string;
    sensorCode: string;
    type: string;
    unit: string;
  };
  value: number;
  status: string;
  recordedAt: string;
}

export interface ActionLogRow {
  id: number;
  deviceId: number;
  device: {
    id: number;
    name: string;
    deviceCode: string;
    type: string;
  };
  action: string;
  executionStatus: string;
  description: string | null;
  createdAt: string;
}

// --- API calls ---

export const getDashboardLatest = () =>
  api.get<{ readings: SensorReading[] }>('/dashboard/latest');

export const getDashboardCharts = (limit = 20) =>
  api.get<{ datasets: ChartDataset[] }>(`/dashboard/charts?limit=${limit}`);

export const getDashboardDevices = () =>
  api.get<{ devices: Device[] }>('/dashboard/devices');

export const patchDeviceControl = (id: number, action: 'ON' | 'OFF') =>
  api.patch<{ message: string; logId: number }>(`/devices/${id}/control`, { action });

export const getSensorData = (params: Record<string, string | number>) =>
  api.get<{ data: SensorDataRow[]; total: number }>('/sensor-data', { params });

export const getActionLogs = (params: Record<string, string | number>) =>
  api.get<{ data: ActionLogRow[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(
    '/action-logs', { params }
  );
