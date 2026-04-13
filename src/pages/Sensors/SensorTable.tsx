import { useEffect, useState, useRef } from 'react';
import { Flame, Droplets, Sun, ArrowUpDown, Filter, Copy, Check, Calendar } from 'lucide-react';
import { getSensorData, type SensorDataRow } from '../../api';
import { useSockets } from '../../context/SocketContext';
import TableSkeleton from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import type { SensorFilters } from './FilterBar';

const PAGE_SIZE = 10;

interface SensorEvent {
  sensorCode: string;
  type: string;
  unit: string;
  value: number;
  status: string;
  recordedAt: string;
}

const TYPE_ICON: Record<string, { Icon: typeof Flame; color: string; label: string }> = {
  Temperature: { Icon: Flame,    color: '#e53e3e', label: 'Temperature'    },
  Humidity:    { Icon: Droplets, color: '#3182ce', label: 'Humidity'       },
  Light:       { Icon: Sun,      color: '#d69e2e', label: 'Light Intensity' },
};

// Blend between two hex colors based on t (0→1)
function blendHex(a: string, b: string, t: number) {
  const h = (s: string) => parseInt(s, 16);
  const [ar, ag, ab] = [h(a.slice(1,3)), h(a.slice(3,5)), h(a.slice(5,7))];
  const [br, bg, bb] = [h(b.slice(1,3)), h(b.slice(3,5)), h(b.slice(5,7))];
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bv})`;
}

const VALUE_RANGE: Record<string, { min: number; max: number; colorLow: string; colorHigh: string }> = {
  Temperature: { min: 0,    max: 50,   colorLow: '#3182ce', colorHigh: '#e53e3e' }, // blue→red
  Humidity:    { min: 0,    max: 100,  colorLow: '#d69e2e', colorHigh: '#3182ce' }, // orange→blue
  Light:       { min: 0,    max: 1000, colorLow: '#718096', colorHigh: '#d69e2e' }, // gray→yellow
};

function valueColor(type: string, value: number): string {
  const range = VALUE_RANGE[type];
  if (!range) return '#4a5568';
  const t = Math.min(1, Math.max(0, (value - range.min) / (range.max - range.min)));
  return blendHex(range.colorLow, range.colorHigh, t);
}

let nextTempId = -1;

interface Props {
  filters: SensorFilters;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-1 p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors" title="Copy timestamp">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
}

export default function SensorTable({ filters }: Props) {
  const [rows, setRows]       = useState<SensorDataRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const { sensorSocket }      = useSockets();
  const filtersRef            = useRef(filters);
  filtersRef.current          = filters;

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      limit:  PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    };
    if (filters.sensorId)   params.sensorId   = parseInt(filters.sensorId);
    if (filters.sensorName) params.sensorName = filters.sensorName;
    if (filters.date)       params.date       = filters.date;
    if (filters.value)      params.value      = parseFloat(filters.value);
    if (filters.sortBy)     params.sortBy     = filters.sortBy;
    if (filters.sortOrder)  params.sortOrder  = filters.sortOrder;
    getSensorData(params)
      .then((res) => {
        setRows(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    const handler = (event: SensorEvent) => {
      const f = filtersRef.current;

      // Skip real-time update when sort is active — order would be wrong
      if (f.sortBy !== 'recordedAt' || f.sortOrder !== 'DESC') return;

      // Skip if incoming event doesn't match active filters
      if (f.sensorId) return; // can't verify sensorId from socket event
      if (f.sensorName && !event.type.toLowerCase().includes(f.sensorName.toLowerCase())) return;
      if (f.date && !event.recordedAt.includes(f.date)) return;
      if (f.value && parseFloat(f.value) !== event.value) return;

      const newRow: SensorDataRow = {
        id: nextTempId--,
        sensorId: 0,
        sensor: {
          id: 0,
          name: event.type + ' Sensor',
          sensorCode: event.sensorCode,
          type: event.type,
          unit: event.unit,
        },
        value: event.value,
        status: event.status,
        recordedAt: event.recordedAt,
      };
      setRows((prev) => [newRow, ...prev].slice(0, PAGE_SIZE));
      setTotal((t) => t + 1);
    };
    sensorSocket.on('sensor_data', handler);
    return () => { sensorSocket.off('sensor_data', handler); };
  }, [sensorSocket]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">SENSOR_ID <ArrowUpDown size={12} /></span>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">RECORED AT <Calendar size={12} /></span>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SENSOR NAME
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">SENSOR TYPE <Filter size={12} /></span>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              VALUE
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton cols={4} rows={5} />
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-gray-400">No data found</td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const typeCfg = TYPE_ICON[row.sensor.type];
              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 text-gray-700 font-mono">#{row.sensor.id || row.sensorId}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="flex items-center gap-1">
                      {row.recordedAt}
                      <CopyBtn text={row.recordedAt} />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.sensor.name}</td>
                  <td className="px-4 py-3">
                    {typeCfg ? (
                      <span className="flex items-center gap-2">
                        <typeCfg.Icon size={14} style={{ color: typeCfg.color }} />
                        <span style={{ color: typeCfg.color }}>{typeCfg.label}</span>
                      </span>
                    ) : (
                      <span className="text-gray-600">{row.sensor.type}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: valueColor(row.sensor.type, row.value) }}>
                    {row.value} {row.sensor.unit}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        label="entries"
      />
    </div>
  );
}
