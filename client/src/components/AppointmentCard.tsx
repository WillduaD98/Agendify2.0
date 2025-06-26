import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './ScheduleAppointment.css';

interface AppointmentFormProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onSuccess: () => Promise<void>;
}

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      _id
      name
    }
  }
`;

const ADD_APPOINTMENT = gql`
  mutation AddAppointment($input: CreateAppointmentInput!) {
    addAppointment(input: $input) {
      _id
    }
  }
`;

const AppointmentCard: React.FC<AppointmentFormProps> = ({ onSuccess, setSelectedDate, selectedDate }) => {
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [clientId, setClientId] = useState('');
  const [succesMessage, setSuccesMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data, loading: loadingClients, error: errorClients } = useQuery(GET_CLIENTS);
  const [addAppointment, { loading: saving }] = useMutation(ADD_APPOINTMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addAppointment({
        variables: {
          input: {
            date: selectedDate,
            reason,
            status,
            clientId,
          },
        },
      });

      setSuccesMessage('Appointment created successfully!');
      setErrorMessage('');
      setReason('');
      setStatus('');

      await onSuccess();
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      setErrorMessage('Error creating appointment');
      setSuccesMessage('');
    }
  };

  return (
    <div className="schedule-container">
      <h2>Schedule a New Appointment</h2>
      <form onSubmit={handleSubmit} className="schedule-form">
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </label>

        <label>
          Reason:
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} required />
        </label>

        <label>
          Client:
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
            <option value="">Seleccione</option>
            {loadingClients ? (
              <option disabled>Loading...</option>
            ) : errorClients ? (
              <option disabled>Error loading clients</option>
            ) : (
              data?.clients.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </label>

        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Seleccione</option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Create Appointment'}
        </button>

        <div style={{ padding: '1rem' }}>
          {succesMessage && <h3 style={{ color: 'green' }}>{succesMessage}</h3>}
          {errorMessage && <h3 style={{ color: 'red' }}>{errorMessage}</h3>}
        </div>
      </form>
    </div>
  );
};

export default AppointmentCard;
