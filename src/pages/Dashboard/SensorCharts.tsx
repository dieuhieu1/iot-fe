import { useEffect, useState } from 'react';
import { getDashboardCharts, type ChartDataset, type ChartDataPoint } from '../../api';
import { useSockets } from '../../context/SocketContext';
import { SENSOR_META } from '../../constants';
import SensorChart from '../../components/charts/SensorChart';

const CHART_LIMIT = 20;

type DatasetMap = Record<string, ChartDataset>;

interface SensorEvent {
  type: string;
  value: number;
  recordedAt: string;
  unit: string;
  sensorCode: string;
  status: string;
}

export default function SensorCharts() {
  const [datasets, setDatasets] = useState<DatasetMap>({});
  const { sensorSocket } = useSockets();

  useEffect(() => {
    getDashboardCharts(CHART_LIMIT).then((res) => {
      const map: DatasetMap = {};
      res.data.datasets.forEach((d) => {
        map[d.type] = d;
      });
      setDatasets(map);
    });
  }, []);

  useEffect(() => {
    const handler = (event: SensorEvent) => {
      console.log(event);
      setDatasets((prev) => {
        const existing = prev[event.type];
        if (!existing) return prev;
        const newPoint: ChartDataPoint = { value: event.value, recordedAt: event.recordedAt };
        const data = [...existing.data, newPoint];
        if (data.length > CHART_LIMIT) data.shift();
        return { ...prev, [event.type]: { ...existing, data } };
      });
    };
    sensorSocket.on('sensor_data', handler);
    return () => {
      sensorSocket.off('sensor_data', handler);
    };
  }, [sensorSocket]);

  return (
    <div className="flex flex-col gap-1 h-165">
      {(['Temperature', 'Humidity', 'Light'] as const).map((type) => {
        const meta = SENSOR_META[type];
        const ds = datasets[type];
        const latestValue = ds?.data.at(-1)?.value;
        return (
          <SensorChart
            key={type}
            title={`${meta.label} (${meta.unit})`}
            color={meta.color}
            data={ds?.data ?? []}
            unit={meta.unit}
            latestValue={latestValue}
          />
        );
      })}
    </div>
  );
}
