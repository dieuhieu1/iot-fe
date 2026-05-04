import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getActionLogStats, type DeviceActionStat } from '../../api';
import { DEVICE_META } from '../../constants';

const DEVICE_ICON_MAP: Record<string, string> = {
  'Ventilation Fan': 'ph:fan-fill',
  'Smart Pump': 'mdi:water-pump',
  'Smart Light': 'mage:light-bulb-off-fill',
  'Smart Heater': 'mdi:radiator',
  'Misting System': 'mdi:weather-fog',
};

const PIE_COLORS = ['#48bb78', '#a0aec0'];

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: DeviceActionStat }) {
  const meta = DEVICE_META[stat.deviceType as keyof typeof DEVICE_META];
  const color = meta?.color ?? '#718096';
  const icon = DEVICE_ICON_MAP[stat.deviceType] ?? 'mdi:devices';
  const onPct = stat.totalCount > 0 ? Math.round((stat.onCount / stat.totalCount) * 100) : 0;
  const offPct = 100 - onPct;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon icon={icon} fontSize={20} style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 leading-tight truncate">{stat.deviceName}</p>
          <p className="text-[11px] text-gray-400">{stat.deviceType}</p>
        </div>
        <div className="ml-auto text-right flex-shrink-0">
          <p className="text-xl font-black text-gray-800">{stat.totalCount}</p>
          <p className="text-[10px] text-gray-400">total actions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-green-600">{stat.onCount}</p>
          <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wide">Turned ON</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-gray-600">{stat.offCount}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Turned OFF</p>
        </div>
      </div>

      {stat.totalCount > 0 && (
        <div>
          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>ON rate</span>
            <span>{onPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-500"
              style={{ width: `${onPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
            <span>{onPct}% ON</span>
            <span>{offPct}% OFF</span>
          </div>
        </div>
      )}

      {stat.totalCount === 0 && (
        <p className="text-[11px] text-gray-300 text-center">No successful actions yet</p>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gray-100" />
        <div className="flex-1">
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="h-8 w-12 bg-gray-100 rounded ml-auto" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-2 bg-gray-100 rounded-full" />
    </div>
  );
}

// ── Charts section ────────────────────────────────────────────────────────────

function ChartsSection({ stats }: { stats: DeviceActionStat[] }) {
  const barData = stats.map((s) => ({
    name: s.deviceName.length > 12 ? s.deviceName.slice(0, 11) + '…' : s.deviceName,
    ON: s.onCount,
    OFF: s.offCount,
  }));

  const totalOn = stats.reduce((acc, s) => acc + s.onCount, 0);
  const totalOff = stats.reduce((acc, s) => acc + s.offCount, 0);
  const pieData = [
    { name: 'Turned ON', value: totalOn },
    { name: 'Turned OFF', value: totalOff },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4">ON / OFF per Device</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e2e8f0' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="ON" fill="#48bb78" radius={[4, 4, 0, 0]} />
            <Bar dataKey="OFF" fill="#a0aec0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
        <p className="text-sm font-bold text-gray-700 mb-4">Overall ON / OFF Ratio</p>
        {totalOn + totalOff === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-300">
            No data yet
          </div>
        ) : (
          <div className="flex items-center gap-6 flex-1">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-4">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <div>
                    <p className="text-xs text-gray-500">{entry.name}</p>
                    <p className="text-lg font-black" style={{ color: PIE_COLORS[i] }}>
                      {entry.value}
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        ({totalOn + totalOff > 0 ? Math.round((entry.value / (totalOn + totalOff)) * 100) : 0}%)
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const [stats, setStats] = useState<DeviceActionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActionLogStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="p-5">
      <h1 className="text-xl font-bold text-gray-900 mb-0.5">Device Action Statistics</h1>
      <p className="text-sm text-gray-500 mb-4">
        Number of successful ON / OFF actions per device.
      </p>

      {/* Charts */}
      {!loading && stats.length > 0 && <ChartsSection stats={stats} />}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Icon icon="mdi:chart-bar" fontSize={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No statistics yet. Start controlling devices to see data here.</p>
          </div>
        ) : (
          stats.map((stat) => <StatCard key={stat.deviceId} stat={stat} />)
        )}
      </div>
    </div>
  );
}
