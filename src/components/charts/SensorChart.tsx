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
  textColor: string;
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  data: ChartDataPoint[];
  unit: string;
  latestValue?: number;
}

function formatTime(ts: string) {
  const parts = ts.split(' ');
  if (parts.length < 2) return ts;
  return parts[1].substring(0, 8); // HH:MM:SS
}

export default function SensorChart({
  title,
  color,
  textColor,
  bgFrom,
  bgMid,
  bgTo,
  data,
  unit,
  latestValue,
}: Props) {
  const gradientId = `grad-${title.replace(/\s+/g, '-')}`;
  const chartData = data.map((d) => ({ ...d, time: formatTime(d.recordedAt) }));

  return (
    <div
      className="rounded-lg p-2 h-50 w-310"
      style={{ background: `linear-gradient(to right, ${bgFrom} 0%, ${bgMid} 50%, ${bgTo} 100%)` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">{title}</span>
        {latestValue !== undefined && (
          <span
            className="text-2xl font-extrabold"
            style={
              textColor.startsWith('linear-gradient')
                ? {
                    background: textColor,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : { color: textColor }
            }
          >
            {latestValue}
            {unit}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.85)' }}
            interval="preserveStartEnd"
            axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.85)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, background: bgFrom, border: 'none', color: '#fff' }}
            formatter={(val) => [`${val} ${unit}`, title]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ r: 4, fill: color, stroke: color, strokeWidth: 2 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
