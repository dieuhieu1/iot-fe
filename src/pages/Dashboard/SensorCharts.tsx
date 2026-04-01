import { useEffect, useState } from 'react';
import { getDashboardCharts, type ChartDataset, type ChartDataPoint } from '../../api';
import { useSockets } from '../../context/SocketContext';
import { SENSOR_META } from '../../constants';
import SensorChart from '../../components/charts/SensorChart';

const CHART_LIMIT = 20;

type DatasetMap = Record<string, ChartDataset>;

function makeMockPoints(count: number, base: number, spread: number): ChartDataPoint[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const t = new Date(now.getTime() - (count - 1 - i) * 5000);
    const pad = (n: number) => String(n).padStart(2, '0');
    const recordedAt = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
    const value = Math.round((base + (Math.random() - 0.5) * spread * 2) * 10) / 10;
    return { value, recordedAt };
  });
}

const MOCK_DATASETS: DatasetMap = {
  Temperature: { type: 'Temperature', data: makeMockPoints(20, 28, 8) },
  Humidity: { type: 'Humidity', data: makeMockPoints(20, 65, 15) },
  Light: { type: 'Light', data: makeMockPoints(20, 400, 200) },
};

interface SensorEvent {
  type: string;
  value: number;
  recordedAt: string;
  unit: string;
  sensorCode: string;
  status: string;
}

export default function SensorCharts() {
  const [datasets, setDatasets] = useState<DatasetMap>(MOCK_DATASETS);
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
    <div className="flex flex-col gap-2 h-165">
      {(['Temperature', 'Humidity', 'Light'] as const).map((type) => {
        const meta = SENSOR_META[type];
        const ds = datasets[type];
        const latestValue = ds?.data.at(-1)?.value;
        return (
          <SensorChart
            key={type}
            title={`${meta.label} (${meta.unit})`}
            color={meta.color}
            textColor={meta.textColor}
            bgFrom={meta.bgFrom}
            bgMid={meta.bgMid}
            bgTo={meta.bgTo}
            data={ds?.data ?? []}
            unit={meta.unit}
            latestValue={latestValue}
          />
        );
      })}
    </div>
  );
}
