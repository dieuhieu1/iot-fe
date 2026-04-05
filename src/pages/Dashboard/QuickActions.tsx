import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <>
      <h3 className=" flex justify-center items-center gap-5">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="qa-lightning-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="14%" stopColor="#94BECA" />
              <stop offset="73%" stopColor="#E5ED82" />
            </linearGradient>
          </defs>
        </svg>
        <style>{`.qa-lightning path,.qa-lightning rect,.qa-lightning polygon{fill:url(#qa-lightning-grad)}`}</style>
        <Icon icon={'ph:lightning-fill'} fontSize={40} className="qa-lightning" />
        <span
          className="font-['Inter'] not-italic font-black text-2xl leading-6 tracking-[0.05em] bg-linear-to-b from-black to-[#666666] bg-clip-text text-transparent"
          style={{
            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          Quick Actions
        </span>
      </h3>
      <div
        className=" bg-[#E0E0E0] border border-[rgba(255,56,60,0.2)] rounded-[10px] p-4 h-48 flex flex-col gap-4 items-center justify-center"
        style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        <button
          onClick={() => navigate('/sensors')}
          className="flex items-center justify-between w-full px-6 py-4 rounded-2xl border-gray-300 hover:bg-gray-50 transition-colors "
          style={{
            background:
              'linear-gradient(to right, #FFFFFF 0%, #BBBD91 35%, #B1B291 74%, #7B7C60 100%)',
          }}
        >
          <span
            className="font-['Inter'] not-italic font-black text-xl leading-6 tracking-[0.05em] text-[#5D5151]"
            style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Data Sensors
          </span>
          <Icon icon="tdesign:sensors-1" fontSize={30} />
        </button>
        <button
          onClick={() => navigate('/activities')}
          className="flex items-center justify-between w-full px-6 py-4 rounded-2xl hover:opacity-90 transition-colors text-[#FFFFFF]"
          style={{
            background:
              'linear-gradient(to right, #C69AD5 0%, #913BA2 29%, #312999 65%, #04031C 94%)',
          }}
        >
          <span
            className="font-['Inter'] not-italic font-black text-xl leading-6 tracking-[0.05em] "
            style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Activity Log
          </span>
          <Icon icon="fluent:shifts-activity-24-filled" fontSize={30} />
        </button>
      </div>
    </>
  );
}
