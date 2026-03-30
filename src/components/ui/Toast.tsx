import { X } from 'lucide-react';
import type { Toast as ToastType } from '../../hooks/useToast';

interface Props {
  toasts: ToastType[];
  onRemove: (id: number) => void;
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg min-w-[260px] max-w-sm text-sm"
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="shrink-0 hover:opacity-80">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
