import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentList from '../components/AppointmentList';
import { GET_APPOINTMENTS_BY_FILTER } from "../services/queries";

interface Appointment {
  _id?: string;
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

  const [getAppointments, { data }] = useLazyQuery(GET_APPOINTMENTS_BY_FILTER);

  // Establecer la fecha actual al cargar
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Ejecutar la query cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      getAppointments({ variables: { date: selectedDate } });
    }
  }, [selectedDate]);

  // Actualizar la lista cuando llegan los datos
  useEffect(() => {
    if (data?.appointmentsByFilter) {
      setAppointments(data.appointmentsByFilter);
    }
  }, [data]);

  return (
    <div style={{ background: 'linear-gradient(to right, #e0f7fa, #ffffff)' }}>
      <AppointmentCard
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSuccess={async () => {
          await getAppointments({ variables: { date: selectedDate } });
        }}
      />
      <AppointmentList appointments={appointments} />
    </div>
  );
};

export default ViewCreateAppointments;
