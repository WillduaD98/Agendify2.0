import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_APPOINTMENTS = gql`
  query appointments($date: String) {
    appointments(date: $date) {
      _id
      date
      time
      reason
      status
      client {
        name
        phoneNumber
      }
    }
  }
`;




const AppointmentList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_APPOINTMENTS, {
    variables: { date: selectedDate },
    skip: !selectedDate,
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  return (
    <div className="mt-6">
      <input
        type="date"
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      {loading && <p>Cargando citas...</p>}
      {error && <p>Error cargando citas: {error.message}</p>}
      {!loading && !error && data?.appointments?.length === 0 && (
        <p>No hay citas para esta fecha.</p>
      )}

      <ul className="space-y-2">
        {data?.appointments?.map((appointment: any) => (
          <li key={appointment._id} className="p-4 border rounded shadow">
            <p><strong>Cliente:</strong> {appointment.client?.name}</p>
            <p><strong>Teléfono:</strong> {appointment.client?.phoneNumber}</p>
            <p><strong>Motivo:</strong> {appointment.reason}</p>
            <p><strong>Fecha y hora:</strong> {formatDate(appointment.date)}</p>
            <p><strong>Estado:</strong> {appointment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AppointmentList;