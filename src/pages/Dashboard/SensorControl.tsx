import { useEffect, useState, useCallback } from 'react';
import { getDashboardDevices, patchDeviceControl } from '../../api';
import { useSockets } from '../../context/SocketContext';
import Toggle from '../../components/ui/Toggle';
import { Icon } from '@iconify/react';

interface DeviceState {
  id: number;
  name: string;
  deviceCode: string;
  type: string;
  currentStatus: 'ON' | 'OFF';
  loading: boolean;
  prevStatus: 'ON' | 'OFF';
}

interface DeviceStatusEvent {
  deviceId: number;
  deviceCode: string;
  currentStatus: 'ON' | 'OFF';
  executionStatus: 'PROCESSING' | 'SUCCESS' | 'FAILURE';
  logId: number;
}

const DEVICE_CONFIG: Record<
  string,
  {
    icon: string;
    aniIcon: string;
    labelGradient: string;
    colorFrom: string;
    colorTo: string;
    trackOn: string;
    trackOff: string;
  }
> = {
  'Ventilation Fan': {
    icon: 'ph:fan-fill',
    labelGradient: 'linear-gradient(180deg, #84FB0C 0%, #0D3B07 100%)',
    colorFrom: '#5AD136',
    colorTo: '#666666',
    trackOn: 'linear-gradient(90deg, #5882A4 4.33%, #9CF4AF 30.29%, #69F43F 60%)',
    trackOff: 'linear-gradient(90deg, #a0a0a0 0%, #c8c8c8 30%, #b0b0b0 60%)',
    aniIcon: 'ph:wind-fill',
  },
  'Smart Pump': {
    icon: 'mdi:water-pump',
    aniIcon: 'solar:water-bold-duotone',
    labelGradient: 'linear-gradient(180deg, #60CFFF 0%, #0C3158 100%)',
    colorFrom: '#196ABE',
    colorTo: '#0C3158',
    trackOn: 'linear-gradient(to right, #E0EEF9 1%, #26F2DA 30%, #196BC8 70%)',
    trackOff: 'linear-gradient(90deg, #a0a0a0 0%, #c8c8c8 30%, #b0b0b0 60%)',
  },
  'Smart Light': {
    icon: 'mage:light-bulb-off-fill',
    aniIcon: 'icon-park-outline:light',
    labelGradient: 'linear-gradient(180deg, #FFE566 0%, #B87A00 100%)',
    colorFrom: '#45CCB4',
    colorTo: '#23665A',
    trackOn: 'linear-gradient(90deg, #c97d10 0%, #f5c842 30%, #ffe066 60%)',
    trackOff: 'linear-gradient(90deg, #a0a0a0 0%, #c8c8c8 30%, #b0b0b0 60%)',
  },
  'Smart Heater': {
    icon: 'mdi:radiator',
    aniIcon: 'ph:fire-fill',
    labelGradient: 'linear-gradient(180deg, #FFA07A 0%, #8B0000 100%)',
    colorFrom: '#E53E3E',
    colorTo: '#742A2A',
    trackOn: 'linear-gradient(90deg, #c53030 0%, #f56565 30%, #ffa07a 60%)',
    trackOff: 'linear-gradient(90deg, #a0a0a0 0%, #c8c8c8 30%, #b0b0b0 60%)',
  },
  'Misting System': {
    icon: 'mdi:weather-fog',
    aniIcon: 'ph:cloud-rain-fill',
    labelGradient: 'linear-gradient(180deg, #D6BCFA 0%, #44337A 100%)',
    colorFrom: '#805AD5',
    colorTo: '#322659',
    trackOn: 'linear-gradient(90deg, #553c9a 0%, #9f7aea 30%, #d6bcfa 60%)',
    trackOff: 'linear-gradient(90deg, #a0a0a0 0%, #c8c8c8 30%, #b0b0b0 60%)',
  },
};

function getDeviceConfig(type: string) {
  return DEVICE_CONFIG[type] ?? DEVICE_CONFIG['Ventilation Fan'];
}

export default function SensorControl() {
  const [devices, setDevices] = useState<DeviceState[]>([]);
  const { deviceSocket } = useSockets();

  useEffect(() => {
    getDashboardDevices().then((res) => {
      setDevices(res.data.devices.map((d) => ({ ...d, loading: false, prevStatus: d.currentStatus })));
    });
  }, []);

  useEffect(() => {
    const handler = (event: DeviceStatusEvent) => {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.id !== event.deviceId) return d;
          if (event.executionStatus === 'SUCCESS') {
            return { ...d, currentStatus: event.currentStatus, loading: false, prevStatus: event.currentStatus };
          }
          if (event.executionStatus === 'FAILURE') {
            window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: `Failed to control ${d.name}` } }));
            return { ...d, currentStatus: d.prevStatus, loading: false };
          }
          return d;
        })
      );
    };
    deviceSocket.on('device_status', handler);
    return () => { deviceSocket.off('device_status', handler); };
  }, [deviceSocket]);

  const handleToggle = useCallback(async (device: DeviceState, newChecked: boolean) => {
    const action = newChecked ? 'ON' : 'OFF';
    setDevices((prev) => prev.map((d) => d.id === device.id ? { ...d, loading: true, prevStatus: d.currentStatus } : d));
    try {
      await patchDeviceControl(device.id, action);
    } catch {
      setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, loading: false } : d)));
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="slider-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2BFF20" />
                <stop offset="30%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#105F2D" />
              </linearGradient>
            </defs>
          </svg>
          <style>{`.slider-grad path,.slider-grad rect,.slider-grad circle{fill:url(#slider-grad)}`}</style>
          <Icon icon="bx:slider-alt" fontSize={37} className="slider-grad" />
        </>
        <h3 className="bg-[linear-gradient(180deg,#000000_0%,#C4BCBC_100%)] bg-clip-text text-transparent text-[25px] leading-6 font-black tracking-[0.05em]">
          Device Control
        </h3>
      </div>
      <div className="flex flex-col gap-5">
        {devices.map((device, idx) => {
          const cfg = getDeviceConfig(device.type);
          const isOn = device.currentStatus === 'ON';
          return (
            <div key={device.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="bg-clip-text text-transparent text-[16px] leading-4.75 font-black"
                    style={{ backgroundImage: cfg.labelGradient }}
                  >
                    {device.name}
                  </p>
                  <p className="text-[14px] text-[#22C55E] mt-0.5">
                    {device.loading ? 'Processing...' : isOn ? 'Running' : 'Off'}
                  </p>
                </div>
                <Toggle
                  checked={isOn}
                  loading={device.loading}
                  onChange={(checked) => handleToggle(device, checked)}
                  icon={cfg.icon}
                  fontSize={29}
                  colorFrom={cfg.colorFrom}
                  colorTo={cfg.colorTo}
                  trackOn={cfg.trackOn}
                  trackOff={cfg.trackOff}
                  aniIcon={cfg.aniIcon}
                />
              </div>
              {idx < devices.length - 1 && (
                <div className="border-b border-dashed border-gray-100 mt-5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
