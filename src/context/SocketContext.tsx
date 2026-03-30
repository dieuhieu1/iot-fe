import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_HOST } from '../constants';

interface SocketContextValue {
  sensorSocket: Socket;
  deviceSocket: Socket;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [sockets, setSockets] = useState<SocketContextValue | null>(null);

  useEffect(() => {
    const sensorSocket = io(`${WS_HOST}/sensors`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
    const deviceSocket = io(`${WS_HOST}/devices`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    sensorSocket.on('connect', () => {
      console.log('[WS] /sensors connected, id:', sensorSocket.id);
    });
    deviceSocket.on('connect', () => {
      console.log('[WS] /devices connected, id:', deviceSocket.id);
    });

    setSockets({ sensorSocket, deviceSocket });

    return () => {
      sensorSocket.disconnect();
      deviceSocket.disconnect();
    };
  }, []);

  if (!sockets) return null;

  return <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>;
}

export function useSockets() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSockets must be used inside SocketProvider');
  return ctx;
}
