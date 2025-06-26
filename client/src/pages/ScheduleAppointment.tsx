import _React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard.js';
// import AppointmentList from '../components/AppointmentList.js';
import { GET_APPOINTMENTS_BY_DATE } from '../services/queries.js';
// import './ScheduleAppointment.css';

import { useQuery } from '@apollo/client';


const ViewCreateAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const { data, loading, error, refetch } = useQuery(GET_APPOINTMENTS_BY_DATE, {
    variables: { date: selectedDate },
    skip: !selectedDate
  });

  return (
    <div style={{ background: 'linear-gradient(to right, #e0f7fa, #ffffff)' }}>
      <h1 className="text-2xl font-bold mb-4">Citas para el {selectedDate}</h1>

      <AppointmentCard
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSuccess={() => { refetch(); return Promise.resolve(); }} // para volver a cargar citas al crear una nueva
      />

      {loading && <p>Cargando citas...</p>}
      {error && <p>Error cargando citas: {error.message}</p>}
      {!loading && data?.appointments?.length === 0 && (
        <p>No hay citas para esta fecha.</p>
      )}

      <ul className="space-y-2">
        {data?.appointments.map((appt: any) => (
          <li key={appt._id} className="p-4 border rounded shadow">
            <p><strong>Cliente:</strong> {appt.client?.name}</p>
            <p><strong>Teléfono:</strong> {appt.client?.phoneNumber}</p>
            <p><strong>Motivo:</strong> {appt.reason}</p>
            <p><strong>Fecha:</strong> {new Date(appt.date).toLocaleString()}</p>
            <p><strong>Estado:</strong> {appt.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewCreateAppointments;