import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      _id
      name
      phoneNumber
    }
  }
`;

const ClientList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_CLIENTS);

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p>Error loading clients: {error.message}</p>;

  const clients = data?.clients || [];

  if (clients.length === 0) {
    return <p>No clients registered yet.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Lista de Clientes</h2>
      <ul className="space-y-2">
        {clients.map((client: any) => (
          <li key={client._id} className="p-4 border rounded shadow">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Phone Number:</strong> {client.phoneNumber}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
