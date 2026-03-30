import { useEffect, useState, useCallback } from 'react';
import { getDashboardDevices, patchDeviceControl, type Device } from '../../api';
import { useSockets } from '../../context/SocketContext';
import Toggle from '../../components/ui/Toggle';

interface DeviceState extends Device {
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

export default function SensorControl() {
  const [devices, setDevices] = useState<DeviceState[]>([]);
  const { deviceSocket } = useSockets();

  useEffect(() => {
    getDashboardDevices().then((res) => {
      setDevices(
        res.data.devices.map((d) => ({ ...d, loading: false, prevStatus: d.currentStatus }))
      );
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
            window.dispatchEvent(
              new CustomEvent('app:toast', { detail: { message: `Failed to control ${d.name}` } })
            );
            return { ...d, currentStatus: d.prevStatus, loading: false };
          }
          // PROCESSING — stay loading
          return d;
        })
      );
    };
    deviceSocket.on('device_status', handler);
    return () => { deviceSocket.off('device_status', handler); };
  }, [deviceSocket]);

  const handleToggle = useCallback(async (device: DeviceState, newChecked: boolean) => {
    const action = newChecked ? 'ON' : 'OFF';
    setDevices((prev) =>
      prev.map((d) => d.id === device.id ? { ...d, loading: true, prevStatus: d.currentStatus } : d)
    );
    try {
      await patchDeviceControl(device.id, action);
    } catch {
      setDevices((prev) =>
        prev.map((d) => d.id === device.id ? { ...d, loading: false } : d)
      );
    }
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Sensor Control</h3>
      <div className="flex flex-col gap-4">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{device.name}</p>
              {device.currentStatus === 'ON' && !device.loading && (
                <p className="text-xs text-green-600">Running</p>
              )}
            </div>
            <Toggle
              checked={device.currentStatus === 'ON'}
              loading={device.loading}
              onChange={(checked) => handleToggle(device, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
