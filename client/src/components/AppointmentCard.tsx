import React, { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';
import './ScheduleAppointment.css';
import api from '../services/api';

interface AppointmentFormProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onSuccess: (date: string) => Promise<void>
}
interface Client {
  id: number;
  name: string
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess, setSelectedDate, selectedDate }) => {
  const [_date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('')
  const [clientId, setClientId] = useState('')
  const [clients, setClient] = useState<Client[]>([])

  const [succesMessage, setSuccesMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClient(data)  
      } catch (error) {
        console.error(`Error al cargar clientes: `, error)
      }
      
    };
    loadClients();
  }, [])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(status)
      const response = await api.post('/appointments', {
        date: selectedDate, 
        reason,
        status,
        clientId: Number(clientId),
      });

      setSuccesMessage('Appointment Created Succesfully!');
      setErrorMessage('')
      setSuccesMessage('Appointment Created Succesfully!')
      setDate('')
      setReason('')
      setStatus('')
      // setClient([])

      await onSuccess(selectedDate);
      console.log('Appointment Creado', response.data)
      
    } catch (error) {
      console.error(`Error creating Appointment`, error)
      setErrorMessage('Error creating Appointment')
      setSuccesMessage('')
    }
  }
  
  return(
    <div className='schedule-container'>
      <h2>{'Schedule a New Appointment'}</h2>
      <form onSubmit={handleSubmit} className="schedule-form ">
        <label>
          Date:
          <input
            type="datetime-local"
            name="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </label>

        <label htmlFor='reason'>
          Reason:
          <input type="text" name="reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
        </label>

        <label htmlFor='clientId'>
          Cliente:
          <select name="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
            <option value="">Seleccione</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}

          </select>
        </label>

        <label htmlFor='professionalId' >
          Status:
          <select name="Status" value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value=''>Seleccione</option>
            <option value='pending'>pending</option>
            <option value='confirmed'>confirmed</option>
            <option value='cancelled'>cancelled</option>

            
          </select>
        </label>

        <button type='submit'>Create Appointment</button>
        <div style={{padding: '1rem'}}>
          {succesMessage && <h3 style={{ color: 'green' }}>{succesMessage}</h3>}
          {errorMessage && <h3 style = {{color: 'red'}}>{errorMessage}</h3>}      
        </div>
        
      </form>

    </div>
    )
};
    
export default AppointmentForm;
      