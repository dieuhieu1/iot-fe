export const API_BASE = 'http://localhost:3000/api/v1';
export const WS_HOST = 'http://localhost:3000';

export const SENSOR_META = {
  Temperature: { label: 'Temperature',     unit: '°C',  color: '#e53e3e', icon: 'flame'   },
  Humidity:    { label: 'Humidity',        unit: '%',   color: '#3182ce', icon: 'droplet' },
  Light:       { label: 'Light Intensity', unit: 'Lux', color: '#d69e2e', icon: 'sun'     },
} as const;

export const DEVICE_META = {
  'Ventilation Fan': { icon: 'fan',         color: '#38a169' },
  'Smart Pump':      { icon: 'droplets',    color: '#3182ce' },
  'Smart Light':     { icon: 'lightbulb',   color: '#d69e2e' },
} as const;

export const EXECUTION_STATUS = ['PROCESSING', 'SUCCESS', 'FAILURE'] as const;

export const ACTION_DISPLAY: Record<string, Record<string, { text: string; color: string }>> = {
  ON: {
    SUCCESS:    { text: 'TURNED ON',   color: '#38a169' },
    PROCESSING: { text: 'TURNING ON',  color: '#dd6b20' },
    FAILURE:    { text: 'TURNED ON',   color: '#38a169' },
  },
  OFF: {
    SUCCESS:    { text: 'TURNED OFF',  color: '#4a5568' },
    PROCESSING: { text: 'TURNING OFF', color: '#dd6b20' },
    FAILURE:    { text: 'TURNED OFF',  color: '#4a5568' },
  },
};
