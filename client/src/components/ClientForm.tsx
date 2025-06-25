// client/src/components/ClientForm.tsx

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

interface ClientFormProps {
  onSuccess?: () => void; // ✅ Ya no es obligatorio ni async
}

const ADD_CLIENT = gql`
  mutation AddClient($input: ClientInput!) {
    addClient(input: $input) {
      _id
      name
      phoneNumber
    }
  }
`;

const ClientForm: React.FC<ClientFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [addClient, { loading }] = useMutation(ADD_CLIENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addClient({
        variables: {
          input: {
            name,
            phoneNumber,
          },
        },
      });

      setSuccessMessage('Client created successfully');
      setErrorMessage('');
      setName('');
      setPhoneNumber('');

      // ✅ Llama onSuccess si existe
      if (onSuccess) onSuccess();
} catch (error: any) {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    console.error('GraphQL Error Message:', error.graphQLErrors[0].message);
    console.error('GraphQL Error Details:', error.graphQLErrors[0]);
  }
  if (error.networkError) {
    console.error('Network Error:', error.networkError);
  }
  console.error('Apollo Error:', error.message);
  setErrorMessage(`There was an error: ${error.message}`);
  setSuccessMessage('');
}



  };

  return (
    <div className="d-flex flex-column align-items-center py-5">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-3 text-center fw-bold text-primary">Create a new client</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>

        {successMessage && <div className="alert alert-success mt-3 text-center">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3 text-center">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ClientForm;
