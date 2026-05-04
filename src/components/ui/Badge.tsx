interface Props {
  status: 'SUCCESS' | 'FAILURE' | 'PROCESSING' | string;
}

const config: Record<string, { label: string; className: string }> = {
  SUCCESS: { label: '✓ Success', className: 'bg-green-100 text-green-800' },
  FAILURE: { label: '✗ Failed', className: 'bg-red-100 text-red-800' },
  PROCESSING: { label: '⟳ Pending', className: 'bg-orange-100 text-orange-800' },
};

export default function Badge({ status }: Props) {
  const cfg = config[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
