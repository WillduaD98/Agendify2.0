import _React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentList from '../components/AppointmentList';
// import './ScheduleAppointment.css';
import api from '../services/api';


interface Appointment {
  id: number;
  date: string;
  reason: string;
  status: string;
  client?: {
    name: string;
    phoneNumber: number;
  };
}

const ViewCreateAppointments = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async (date: string) => {
    try {
      const res = await api.get('/appointments', {
        params: { date }
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    setSelectedDate(today); // esto dispara el useEffect de selectedDate
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div style= {{ background: 'linear-gradient(to right, #e0f7fa, #ffffff)'}}>
      <h1 className="text-2xl font-bold mb-4"></h1>
      <AppointmentCard
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSuccess={fetchAppointments}
      />
      <AppointmentList appointments={appointments} />
    </div>
  );
};

export default ViewCreateAppointments;
