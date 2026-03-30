import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../../api';

interface Props {
  title: string;
  color: string;
  data: ChartDataPoint[];
  unit: string;
  latestValue?: number;
}

function formatTime(ts: string) {
  const parts = ts.split(' ');
  if (parts.length < 2) return ts;
  return parts[1].substring(0, 5); // HH:MM
}

export default function SensorChart({ title, color, data, unit, latestValue }: Props) {
  const gradientId = `grad-${title.replace(/\s+/g, '-')}`;
  const chartData = data.map((d) => ({ ...d, time: formatTime(d.recordedAt) }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-51.75 w-299">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        {latestValue !== undefined && (
          <span className="text-sm font-bold" style={{ color }}>
            {latestValue} {unit}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip contentStyle={{ fontSize: 12 }} formatter={(val) => [`${val} ${unit}`, title]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
