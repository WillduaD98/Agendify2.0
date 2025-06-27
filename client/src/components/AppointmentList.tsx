import React from 'react';

interface Appointment {
  id?: string;
  _id?: string;
  date: string;
  reason: string;
  status: string;
  client?: {
    name: string;
    phoneNumber: number;
  };
}

interface Props {
  appointments: Appointment[];
}

function formatDate(dateString: string) {
  const date = new Date(parseInt(dateString));
  console.log('now', Date.now());
  console.log('dateString',dateString);
  
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

const AppointmentList: React.FC<Props> = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return <p>There are no appointments.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Lista de Citas en la fecha Utilizada</h2>
      <ul className="space-y-2">
        {appointments.map((appointment: any) => (
          <li key={appointment._id || appointment.id} className="p-4 border rounded shadow">
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
