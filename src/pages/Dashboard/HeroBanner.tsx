import { useEffect, useState } from 'react';
import { getDashboardLatest, type SensorReading } from '../../api';
import { useSockets } from '../../context/SocketContext';
import { SENSOR_META } from '../../constants';
import dashboardBg from '../../assets/dasboard-bg.jpg';
import { Icon } from '@iconify/react';
const WAVE_PATH =
  'M4.50122 73.6076C8.53141 72.0456 14.3335 66.9998 19.5363 60.5388C20.9076 58.8357 21.2821 57.2302 22.4373 56.1131C23.5925 54.996 25.3123 54.3712 27.0581 54.2056C34.5252 53.497 43.8303 56.5486 51.3782 59.2419C57.7806 61.5264 63.5469 62.8723 66.4393 63.3504C73.3656 64.4952 75.099 49.0699 80.0499 42.2207C84.074 36.6537 101.747 50.2438 108.704 51.517C119.49 53.4911 131.278 42.0645 143.421 35.4568C151.265 31.1882 156.762 26.6054 162.538 25.0197C173.611 21.98 178.181 32.8818 185.139 34.1646C194.826 35.9507 197.881 24.3997 202.806 15.4252C204.256 13.0396 205.976 11.1652 207.435 9.731C208.894 8.29679 210.041 7.35959 214.696 4.50064';

const CARD_CONFIG = [
  {
    type: 'Temperature',
    icon: 'carbon:temperature',
    iconBg: 'bg-[linear-gradient(to_bottom,#EB92B3_7%,#C00808_79%)]',
    cardBg: 'linear-gradient(to top, rgba(253, 154, 154, 0.5) 0%, rgba(151,92,92,0.5) 100%)',
    border: 'rgba(220,100,100,0.4)',
    waveFrom: '#9373BA',
    waveTo: '#E22525',
    label: 'Temperature',
  },
  {
    type: 'Humidity',
    icon: 'temaki:water',
    iconBg: 'bg-[linear-gradient(to_bottom,#9EE3DF_13%,#1E3A71_82%)]',
    cardBg: 'linear-gradient(to bottom, rgba(0,187,255,0.5) 49%, rgba(0,112,153,0.5) 100%)',
    border: 'rgba(100,200,220,0.4)',
    waveFrom: '#06263A',
    waveTo: '#ffffff',
    label: 'Humidity',
  },
  {
    type: 'Light',
    icon: 'tabler:sun-high',
    iconBg: 'bg-[linear-gradient(to_bottom,#F2DF51_0%,#D85219_100%)]',
    cardBg: 'linear-gradient(to top, rgba(254,159,63, 0.5) 0%, rgba(152,95,38,0.5) 100%)',
    border: 'rgba(250,190,80,0.4)',
    waveFrom: '#F66313',
    waveTo: '#F6D00C',
    label: 'Light Intensity',
  },
];

type ReadingMap = Record<string, SensorReading>;

export default function HeroBanner() {
  const [readings, setReadings] = useState<ReadingMap>({});
  const { sensorSocket } = useSockets();

  useEffect(() => {
    getDashboardLatest().then((res) => {
      const map: ReadingMap = {};
      res.data.readings.forEach((r) => {
        map[r.type] = r;
      });
      setReadings(map);
    });
  }, []);

  useEffect(() => {
    const handler = (data: SensorReading) => {
      setReadings((prev) => ({ ...prev, [data.type]: data }));
    };
    sensorSocket.on('sensor_data', handler);
    return () => {
      sensorSocket.off('sensor_data', handler);
    };
  }, [sensorSocket]);

  return (
    <div className="relative h-61 my-2 w-400 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: '100%',
          backgroundPositionY: -100,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative w-full z-10 flex flex-col items-start justify-between px-8 py-3 gap-2">
        {/* Title */}
        <div className="min-w-50">
          <h1 className="text-white font-bold text-3xl leading-snug drop-shadow">
            Humble Dieu Smart Farm
          </h1>
          <p className="text-green-200 text-sm mt-1 drop-shadow">
            A professional smart farm monitoring system
          </p>
        </div>

        {/* Metric cards */}
        <div className="flex flex-wrap gap-30 ">
          {CARD_CONFIG.map(({ type, icon, iconBg, cardBg, border, waveFrom, waveTo, label }) => {
            const reading = readings[type];
            const meta = SENSOR_META[type as keyof typeof SENSOR_META];
            const gradientId = `wave-gradient-${type}`;
            const belowThreshold = reading != null && reading.value < meta.threshold;
            return (
              <div
                key={type}
                className="rounded-2xl px-5 pt-4 pb-3 w-107.75 h-37 flex items-center justify-between gap-4 backdrop-blur-[1px]"
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  filter: belowThreshold ? 'saturate(0.2) brightness(0.75)' : undefined,
                  transition: 'filter 0.6s ease',
                }}
              >
                {/* Left: icon + label + value */}
                <div className="flex flex-row my-2">
                  <div className="flex flex-col items-start gap-1">
                    <div
                      className={`inline-flex items-center justify-center w-25 h-25 rounded-xl ${iconBg} shadow`}
                    >
                      <Icon icon={icon} fontSize={73} className="text-white" />
                    </div>
                    <p className=" font-bold text-3xl  text-white leading-none inner-shadow-text">
                      {reading ? reading.value : '—'}
                      <span className="text-[35px] font-normal ml-1">{meta?.unit}</span>
                    </p>
                  </div>
                  <div className="ml-6">
                    <span className="flex items-center font-bold text-white text-[30px] leading-8.75 tracking-widest mb-3 inner-shadow-text">
                      {label}
                    </span>
                    {/* Decorative wave */}
                    <svg
                      width="220"
                      height="79"
                      viewBox="0 0 220 79"
                      fill="none"
                      className="shrink-0 ml-10"
                    >
                      <defs>
                        <linearGradient
                          id={gradientId}
                          x1="109.599"
                          y1="4.5"
                          x2="109.599"
                          y2="73.6"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.375" stopColor={waveFrom} />
                          <stop offset="1" stopColor={waveTo} />
                        </linearGradient>
                      </defs>
                      <path
                        d={WAVE_PATH}
                        stroke={`url(#${gradientId})`}
                        strokeWidth="9"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
