import { useEffect, useState, useRef } from 'react';
import { Wind, Droplets, Lightbulb, ArrowUpDown, Calendar, Copy, Check } from 'lucide-react';
import { getActionLogs, type ActionLogRow } from '../../api';
import { useSockets } from '../../context/SocketContext';
import TableSkeleton from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import { ACTION_DISPLAY } from '../../constants';
import type { ActivityFilters } from './FilterBar';

const PAGE_SIZE = 10;

const DEVICE_ICON: Record<string, { Icon: typeof Wind; color: string }> = {
  'Ventilation Fan': { Icon: Wind,      color: '#38a169' },
  'Smart Pump':      { Icon: Droplets,  color: '#3182ce' },
  'Smart Light':     { Icon: Lightbulb, color: '#d69e2e' },
};

interface DeviceStatusEvent {
  deviceId: number;
  deviceCode: string;
  currentStatus: string;
  executionStatus: string;
  logId: number;
}

let nextTempId = -1;

interface Props {
  filters: ActivityFilters;
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

export default function ActivityTable({ filters }: Props) {
  const [rows, setRows]       = useState<ActionLogRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const { deviceSocket }      = useSockets();
  const rowsRef               = useRef<ActionLogRow[]>([]);
  const filtersRef            = useRef(filters);
  rowsRef.current             = rows;
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
    if (filters.deviceId)        params.deviceId        = parseInt(filters.deviceId);
    if (filters.action)          params.action          = filters.action;
    if (filters.executionStatus) params.executionStatus = filters.executionStatus;
    if (filters.date)            params.date            = filters.date;
    if (filters.sortOrder)       params.sortOrder       = filters.sortOrder;
    getActionLogs(params)
      .then((res) => {
        setRows(res.data.data);
        setTotal(res.data.meta.total);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    const handler = (event: DeviceStatusEvent) => {
      // Skip real-time update when sorted oldest-first — new rows belong at the bottom
      if (filtersRef.current.sortOrder === 'ASC') return;

      const existing = rowsRef.current.find((r) => r.deviceId === event.deviceId);
      const newRow: ActionLogRow = {
        id: nextTempId--,
        deviceId: event.deviceId,
        device: {
          id: event.deviceId,
          name: existing?.device.name ?? `Device ${event.deviceId}`,
          deviceCode: event.deviceCode,
          type: existing?.device.type ?? '',
        },
        action: event.currentStatus === 'ON' ? 'ON' : 'OFF',
        executionStatus: event.executionStatus,
        description: null,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setRows((prev) => [newRow, ...prev].slice(0, PAGE_SIZE));
      setTotal((t) => t + 1);
    };
    deviceSocket.on('device_status', handler);
    return () => { deviceSocket.off('device_status', handler); };
  }, [deviceSocket]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">DEVICE_ID <ArrowUpDown size={12} /></span>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">EXECUTED AT <Calendar size={12} /></span>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">DEVICE NAME <ArrowUpDown size={12} /></span>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTION</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTION_STATUS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton cols={5} rows={5} />
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-gray-400">No data found</td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const deviceCfg = DEVICE_ICON[row.device.type];
              const actionCfg = ACTION_DISPLAY[row.action]?.[row.executionStatus];
              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 text-gray-700 font-mono">#{row.device.id}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="flex items-center gap-1">
                      {row.createdAt}
                      <CopyBtn text={row.createdAt} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {deviceCfg ? (
                      <span className="flex items-center gap-2">
                        <deviceCfg.Icon size={14} style={{ color: deviceCfg.color }} />
                        <span className="text-gray-700">{row.device.name}</span>
                      </span>
                    ) : (
                      <span className="text-gray-700">{row.device.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-xs" style={{ color: actionCfg?.color ?? '#4a5568' }}>
                    {actionCfg?.text ?? row.action}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={row.executionStatus} />
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
        label="results"
      />
    </div>
  );
}
