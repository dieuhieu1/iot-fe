import { useState } from 'react';

export interface ActivityFilters {
  deviceId:        string;
  action:          string;
  executionStatus: string;
  date:            string;
  sortOrder:       string;
}

interface Props {
  onApply: (filters: ActivityFilters) => void;
}

export default function ActivityFilterBar({ onApply }: Props) {
  const [deviceId,        setDeviceId]        = useState('');
  const [action,          setAction]          = useState('');
  const [executionStatus, setExecutionStatus] = useState('');
  const [date,            setDate]            = useState('');
  const [sortOrder,       setSortOrder]       = useState('DESC');

  const handleApply = () => {
    onApply({ deviceId, action, executionStatus, date, sortOrder });
  };

  return (
    <div className="flex flex-wrap gap-3 items-end mb-5">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Device ID</label>
        <input
          type="number"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="e.g. 1"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Action</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All</option>
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Execution Status</label>
        <select
          value={executionStatus}
          onChange={(e) => setExecutionStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All</option>
          <option value="PROCESSING">Processing</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Date</label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="e.g. 2026-04-13 or 2026-04-13 14:30"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Sort by Time</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
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
