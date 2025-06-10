import React from 'react';



interface Appointment {
    id: number;
    date: string;
    reason: string;
    status: string;
    client?: {
        name: string;
        phoneNumber: number
    }
}
interface AppointmentListProps {
    appointments: Appointment[];
}


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





const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
    if (appointments.length === 0) {
        return <p> There are not Appointments.</p>
    }

    return (
        <div className="mt-6">
        <h2 className="text-xl font-bold mb-3">Lista de Citas en la fecha Utilizada</h2>
        <ul className="space-y-2">
          {appointments.map((appointments) => (
            <li key={appointments.id} className="p-4 border rounded shadow">
              <p><strong>Client Name:</strong> {appointments.client?.name}</p>
              <p><strong>Client Phone Number:</strong> {appointments.client?.phoneNumber}</p>
              <p><strong>Client reason</strong> {appointments.reason}</p>
              <p><strong>Appointment Date/Hr:</strong> {formatDate(appointments.date)}</p>
              <p><strong>Status</strong> {appointments.status}</p>
            </li>
          ))}
        </ul>
      </div>
    )
};

export default AppointmentList