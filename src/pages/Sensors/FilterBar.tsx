import { useState, useEffect } from 'react';
import { getSensors, type SensorListItem } from '../../api';

export interface SensorFilters {
  sensorName: string;
  date: string;
  value: string;
  sortBy: string;
  sortOrder: string;
}

interface Props {
  onApply: (filters: SensorFilters) => void;
}

const SORT_OPTIONS = [
  { label: 'Time (Newest)',     sortBy: 'recordedAt', sortOrder: 'DESC' },
  { label: 'Time (Oldest)',     sortBy: 'recordedAt', sortOrder: 'ASC'  },
  { label: 'Value (High→Low)', sortBy: 'value',      sortOrder: 'DESC' },
  { label: 'Value (Low→High)', sortBy: 'value',      sortOrder: 'ASC'  },
];

export default function SensorFilterBar({ onApply }: Props) {
  const [sensorName, setSensorName] = useState('');
  const [date, setDate] = useState('');
  const [value, setValue] = useState('');
  const [sortKey, setSortKey] = useState('recordedAt|DESC');
  const [sensorOptions, setSensorOptions] = useState<SensorListItem[]>([]);

  useEffect(() => {
    getSensors({ limit: 100 })
      .then((res) => setSensorOptions(res.data.data))
      .catch(() => {});
  }, []);

  const handleApply = () => {
    const [sortBy, sortOrder] = sortKey.split('|');
    onApply({ sensorName, date, value, sortBy, sortOrder });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };

  return (
    <div className="flex flex-wrap gap-3 items-end mb-5">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Sensor Name</label>
        <select
          value={sensorName}
          onChange={(e) => setSensorName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All</option>
          {sensorOptions.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Date</label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 2026-04-13 or 2026-04-13 14:30"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Value</label>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 28 or 28.1"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Sort by</label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={`${o.sortBy}|${o.sortOrder}`} value={`${o.sortBy}|${o.sortOrder}`}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleApply}
        className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-green-700 hover:bg-green-800 transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );
}
