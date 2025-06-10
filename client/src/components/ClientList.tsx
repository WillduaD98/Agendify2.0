import React from 'react';

interface Client {
    id: number;
    name: string;
    phoneNumber: number;
}

interface ClientListProps {
    clients: Client[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
    if (clients.length ===0) {
        return <p> There are not Clients Register get.</p>
    }

    return (
        <div className="mt-6">
        <h2 className="text-xl font-bold mb-3">Lista de Clientes</h2>
        <ul className="space-y-2">
          {clients.map((client) => (
            <li key={client.id} className="p-4 border rounded shadow">
              <p><strong>Name:</strong> {client.name}</p>
              <p><strong>Phone Number:</strong> {client.phoneNumber}</p>
            </li>
          ))}
        </ul>
      </div>
    )
};

export default ClientList;