import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/Dashboard';
import SensorsPage from './pages/Sensors';
import ActivitiesPage from './pages/Activities';
import StatsPage from './pages/Stats';
import ProfilePage from './pages/Profile';

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/sensors"    element={<SensorsPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/stats"      element={<StatsPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}
