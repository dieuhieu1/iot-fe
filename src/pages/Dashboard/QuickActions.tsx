import { useNavigate } from 'react-router-dom';
import { Wifi, Clock } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate('/sensors')}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Data Sensors
          <Wifi size={16} className="text-gray-500" />
        </button>
        <button
          onClick={() => navigate('/activities')}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#7c3aed' }}
        >
          Activity Log
          <Clock size={16} />
        </button>
      </div>
    </div>
  );
}
