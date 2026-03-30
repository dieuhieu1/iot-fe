import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '../ui/Toast';
import { useToast } from '../../hooks/useToast';

export default function Layout() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex h-screen overflow-hidden w-full bg-[linear-gradient(to_top,#062B3F_0%,#2B3A71_24%,#00828E_51%,#5EB65F_75%,#42A842_96%)]">
      <Sidebar />
      <main className="relative z-0 w-[calc(100vw-240px)] h-[calc(100vh-30px)] ml-60 bg-gray-50 rounded-2xl my-4">
        <Outlet />
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
