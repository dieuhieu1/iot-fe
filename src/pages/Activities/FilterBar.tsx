import { useState } from 'react';

export interface ActivityFilters {
  search: string;
  from: string;
  to: string;
  date: string;
  deviceType: string;
  sortBy: string;
  sortOrder: string;
}

const SORT_OPTIONS = [
  { label: 'Alphabet (A-Z)',  sortBy: 'name',      sortOrder: 'asc'  },
  { label: 'Alphabet (Z-A)',  sortBy: 'name',      sortOrder: 'desc' },
  { label: 'Newest First',    sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Oldest First',    sortBy: 'createdAt', sortOrder: 'asc'  },
  { label: 'Device ID (↑)',   sortBy: 'deviceId',  sortOrder: 'asc'  },
  { label: 'Device ID (↓)',   sortBy: 'deviceId',  sortOrder: 'desc' },
];

interface Props {
  onApply: (filters: ActivityFilters) => void;
}

export default function ActivityFilterBar({ onApply }: Props) {
  const [search, setSearch]         = useState('');
  const [from, setFrom]             = useState('2026-05-20');
  const [to, setTo]                 = useState('2026-05-21');
  const [date, setDate]             = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [sortKey, setSortKey]       = useState('name|asc');

  const handleApply = () => {
    const [sortBy, sortOrder] = sortKey.split('|');
    onApply({ search, from, to, date, deviceType, sortBy, sortOrder });
  };

  return (
    <div className="flex flex-wrap gap-3 items-end mb-5">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Search Logs</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search device name..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Search by time</label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="e.g. 2026-05-20 14:30"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Sensor Type</label>
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Sensors</option>
          <option value="Ventilation Fan">Ventilation Fan</option>
          <option value="Smart Pump">Smart Pump</option>
          <option value="Smart Light">Smart Light</option>
        </select>
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
