export const API_BASE = 'http://localhost:3000/api/v1';
export const WS_HOST = 'http://localhost:3000';

export const SENSOR_META = {
  Temperature: {
    label: 'Temperature',
    unit: '°C',
    color: '#FF0000',
    textColor: '#FF0000',
    icon: 'flame',
    bgFrom: '#BF0606',
    bgMid: '#C97683',
    bgTo: '#E68CB3',
  },
  Humidity: {
    label: 'Humidity',
    unit: '%',
    color: '#628689',
    textColor: 'linear-gradient(to bottom, #273A3C, #699DA2)',
    icon: 'droplet',
    bgFrom: '#030D33',
    bgMid: '#61899A',
    bgTo: '#A2E8E2',
  },
  Light: {
    label: 'Light Intensity',
    unit: 'Lux',
    color: '#d69e2e',
    textColor: 'linear-gradient(to right, #F36F09, #381C06)',
    icon: 'sun',
    bgFrom: '#CC4005',
    bgMid: '#E86730',
    bgTo: '#EFEF2F',
  },
} as const;

export const DEVICE_META = {
  'Ventilation Fan': { icon: 'fan', color: '#38a169' },
  'Smart Pump': { icon: 'droplets', color: '#3182ce' },
  'Smart Light': { icon: 'lightbulb', color: '#d69e2e' },
} as const;

export const EXECUTION_STATUS = ['PROCESSING', 'SUCCESS', 'FAILURE'] as const;

export const ACTION_DISPLAY: Record<string, Record<string, { text: string; color: string }>> = {
  ON: {
    SUCCESS: { text: 'TURNED ON', color: '#38a169' },
    PROCESSING: { text: 'TURNING ON', color: '#dd6b20' },
    FAILURE: { text: 'TURNED ON', color: '#38a169' },
  },
  OFF: {
    SUCCESS: { text: 'TURNED OFF', color: '#4a5568' },
    PROCESSING: { text: 'TURNING OFF', color: '#dd6b20' },
    FAILURE: { text: 'TURNED OFF', color: '#4a5568' },
  },
};
