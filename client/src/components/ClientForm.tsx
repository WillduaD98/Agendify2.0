import React, { useState } from 'react';
import api from '../services/api'

interface ClientFormProps {
    onSuccess: () => Promise<void>;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/clients', {
                name,
                phoneNumber: Number(phoneNumber)
            });

            setSuccessMessage('Client created successfully');
            setErrorMessage('');
            setName('');
            setPhoneNumber('');
            await onSuccess();
            console.log('Cliente creado', response.data)

        } catch (error) {
            console.error(`Error al crear cliente:`, error)
            setErrorMessage('There was an error creating the client');
            setSuccessMessage('');
        }

    }

    return (
        <div className="d-flex flex-column align-items-center py-5">
            <div className="card p-4 shadow rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="mb-3 text-center fw-bold text-primary">Create a new client</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name input */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Client Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Juan Perez"
                        required
                    />
                </div>
                {/*Phone Number input*/}
                <div className="mb-3">
                <label className="form-label fw-semibold">Client Phone Number:</label>
                    <input
                        type="tel"
                        className="form-control"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ej: 4771234567"
                        required
                    />
                </div>
                <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">Save Clients</button>
                </div>
                </form>

                {successMessage && <div className="alert alert-success mt-3 text-center">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger mt-3 text-center">{errorMessage}</div>}
            </div>
        </div>
    );
};

export default ClientForm;