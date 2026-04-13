import { useState } from 'react';
import ActivityFilterBar, { type ActivityFilters } from './FilterBar';
import ActivityTable from './ActivityTable';

const DEFAULT_FILTERS: ActivityFilters = {
  deviceId:        '',
  action:          '',
  executionStatus: '',
  date:            '',
  sortOrder:       'DESC',
};

export default function ActivitiesPage() {
  const [filters, setFilters] = useState<ActivityFilters>(DEFAULT_FILTERS);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Action History Log</h1>
      <p className="text-sm text-gray-500 mb-6">
        View, filter, and audit device activities and status changes.
      </p>
      <ActivityFilterBar onApply={setFilters} />
      <ActivityTable filters={filters} />
    </div>
  );
}
