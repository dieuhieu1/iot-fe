interface Props {
  checked: boolean;
  loading?: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, loading = false, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={loading}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked ? 'bg-green-500' : 'bg-gray-300'}
      `}
      style={{ width: 40, height: 22 }}
    >
      <span
        className={`inline-block bg-white rounded-full shadow transition-transform duration-200`}
        style={{
          width: 16,
          height: 16,
          transform: checked ? 'translateX(20px)' : 'translateX(3px)',
        }}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </span>
      )}
    </button>
  );
}
