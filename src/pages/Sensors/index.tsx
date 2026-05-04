import { useState } from 'react';
import SensorFilterBar, { type SensorFilters } from './FilterBar';
import SensorTable from './SensorTable';

const DEFAULT_FILTERS: SensorFilters = {
  sensorName: '',
  date: '',
  value: '',
  sortBy: 'recordedAt',
  sortOrder: 'DESC',
};

export default function SensorsPage() {
  const [filters, setFilters] = useState<SensorFilters>(DEFAULT_FILTERS);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Sensor Data Table</h1>
      <p className="text-sm text-gray-500 mb-6">
        Monitor and analysis historical data from all lot sensors
      </p>
      <SensorFilterBar onApply={setFilters} />
      <SensorTable filters={filters} />
    </div>
  );
}
