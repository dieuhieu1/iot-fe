import { useRef } from 'react';
import { Icon } from '@iconify/react';

interface Props {
  checked: boolean;
  loading?: boolean;
  onChange: (checked: boolean) => void;
  icon: string;
  aniIcon?: string;
  fontSize: number;
  colorFrom: string;
  colorTo: string;
  trackOn: string;
  trackOff: string;
}

export default function Toggle({
  checked,
  loading = false,
  onChange,
  icon,
  aniIcon,
  fontSize,
  colorFrom,
  colorTo,
  trackOn,
  trackOff,
}: Props) {
  const W = 103;
  const H = 42;
  const THUMB = 34;
  const GAP = 3;

  const gradId = useRef(`tg-${Math.random().toString(36).slice(2, 7)}`).current;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={loading}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none shrink-0
        ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        width: W,
        height: H,
        background: checked ? trackOn : trackOff,
        boxShadow: 'inset 0px 2px 4px 2px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Gradient definition — shared by both icons */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .${gradId} path,.${gradId} rect,.${gradId} polygon{fill:url(#${gradId})}
        .${gradId}-ani path,.${gradId}-ani rect,.${gradId}-ani polygon{fill:url(#${gradId})}
        .${gradId}-off path,.${gradId}-off rect,.${gradId}-off polygon{fill:#9ca3af}
        @keyframes tg-spring-bounce {
          0%   { transform: translateY(0) scale(1); }
          20%  { transform: translateY(-6px) scale(1.1, 0.9); }
          40%  { transform: translateY(0px) scale(0.95, 1.05); }
          55%  { transform: translateY(-3px) scale(1.05, 0.95); }
          70%  { transform: translateY(0px) scale(1); }
          85%  { transform: translateY(-1px) scale(1.02, 0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .tg-spring-bounce { animation: tg-spring-bounce 1s ease-in-out infinite; }
      `}</style>

      {/* Middle left-right icon — only when ON */}
      {checked && aniIcon && (
        <span
          className="absolute left-6 bottom-2 flex items-center justify-center pointer-events-none"
          style={{ animation: 'toggle-lr 0.8s ease-in-out infinite ' }}
        >
          <Icon
            icon={aniIcon}
            fontSize={fontSize}
            className={`${gradId}-ani`}
            style={{ transform: icon === 'ph:fan-fill' ? 'rotate(-180deg)' : undefined }}
          />
        </span>
      )}

      {/* Thumb */}
      <span
        className="absolute flex items-center justify-center rounded-full shadow-md transition-transform duration-300"
        style={{
          width: THUMB,
          height: THUMB,
          background:
            'radial-gradient(50% 50% at 50% 50%, #FFEA00 7.21%, #F4AA60 50.96%, #F7FF0B 72.6%)',
          transform: checked ? `translateX(${W - THUMB - GAP}px)` : `translateX(${GAP}px)`,
          boxShadow: '0px 4px 4px 1px rgba(0,0,0,0.25)',
          zIndex: 1,
        }}
      >
        {checked && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(246,163,30,0) 0%, rgba(247,255,11,0.36) 100%)',
              filter: 'blur(2px)',
            }}
          />
        )}

        {loading ? (
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <Icon
            icon={icon}
            fontSize={fontSize}
            className={`${checked ? gradId : `${gradId}-off`} ${checked ? (icon === 'ph:fan-fill' ? 'animate-spin' : 'tg-spring-bounce') : ''}`}
          />
        )}
      </span>
    </button>
  );
}
