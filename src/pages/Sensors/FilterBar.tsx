import { useState } from 'react';

export interface SensorFilters {
  search: string;
  sensorType: string;
  date: string;
  sortBy: string;
  sortOrder: string;
}

const today = new Date().toISOString().split('T')[0];

const SORT_OPTIONS = [
  { label: 'Alphabet (A-Z)',  sortBy: 'name',       sortOrder: 'asc'  },
  { label: 'Alphabet (Z-A)',  sortBy: 'name',       sortOrder: 'desc' },
  { label: 'Newest First',    sortBy: 'recordedAt', sortOrder: 'desc' },
  { label: 'Oldest First',    sortBy: 'recordedAt', sortOrder: 'asc'  },
  { label: 'Sensor ID (↑)',   sortBy: 'sensorId',   sortOrder: 'asc'  },
  { label: 'Sensor ID (↓)',   sortBy: 'sensorId',   sortOrder: 'desc' },
];

interface Props {
  onApply: (filters: SensorFilters) => void;
}

export default function SensorFilterBar({ onApply }: Props) {
  const [search, setSearch]         = useState('');
  const [sensorType, setSensorType] = useState('');
  const [date, setDate]             = useState(today);
  const [sortKey, setSortKey]       = useState('name|asc');

  const handleApply = () => {
    const [sortBy, sortOrder] = sortKey.split('|');
    onApply({ search, sensorType, date, sortBy, sortOrder });
  };

  return (
    <div className="flex flex-wrap gap-3 items-end mb-5">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Search Logs</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sensor name..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Sensor Type</label>
        <select
          value={sensorType}
          onChange={(e) => setSensorType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Sensors</option>
          <option value="Temperature">Temperature</option>
          <option value="Humidity">Humidity</option>
          <option value="Light">Light Intensity</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
