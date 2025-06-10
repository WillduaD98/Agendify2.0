import _React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScheduleAppointment from './pages/ScheduleAppointment';
import PublicBooking from './pages/PublicBooking';
import ViewCreateClient from './pages/ViewCreateClients';
import Navbar from './components/Navbar'; // ✅ Importa el Navbar

const App = () => {
  const location = useLocation();

  // Si estás en la ruta de Login, no mostrar Navbar
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />} {/* ✅ Mostrar Navbar solo si no estás en login */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<ScheduleAppointment />} />
        <Route path="/booking" element={<PublicBooking />} />
        <Route path="/clients" element={<ViewCreateClient />} />
      </Routes>
    </>
  );
};

export default App;
