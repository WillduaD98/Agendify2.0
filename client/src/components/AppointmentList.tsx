import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      _id
      date
      reason
      status
      client {
        name
        phoneNumber
      }
    }
  }
`;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

const AppointmentList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_APPOINTMENTS);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error loading appointments: {error.message}</p>;

  const appointments = data?.appointments || [];

  if (appointments.length === 0) {
    return <p>There are no appointments.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Lista de Citas en la fecha Utilizada</h2>
      <ul className="space-y-2">
        {appointments.map((appointment: any) => (
          <li key={appointment._id} className="p-4 border rounded shadow">
            <p><strong>Client Name:</strong> {appointment.client?.name}</p>
            <p><strong>Client Phone Number:</strong> {appointment.client?.phoneNumber}</p>
            <p><strong>Client Reason:</strong> {appointment.reason}</p>
            <p><strong>Appointment Date/Hr:</strong> {formatDate(appointment.date)}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
