import HeroBanner from './HeroBanner';
import SensorCharts from './SensorCharts';
import SensorControl from './SensorControl';
import QuickActions from './QuickActions';

export default function DashboardPage() {
  return (
    <div>
      <div className="w-full flex mx-6">
        <HeroBanner />
      </div>
      <div className="flex pl-6">
        {/* Charts — ~70% */}
        <div className="flex-1 min-w-0">
          <SensorCharts />
        </div>
        {/* Right panel — ~30% */}
        <div className="w-80 shrink-0 flex flex-col gap-4 mr-5">
          <SensorControl />

          <div
            className="w-full h-2.5 rounded-[10px] my-2"
            style={{ background: 'linear-gradient(to right, #E31637, #142F63)' }}
          />

          {/* <QuickActions /> */}
        </div>
      </div>
    </div>
  );
}
