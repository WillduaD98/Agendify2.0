// client/src/pages/ViewCreateClient.tsx

import React from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';

const ViewCreateClient: React.FC = () => {
  return (
    <div>
      <ClientForm />
      <ClientList />
    </div>
  );
};

export default ViewCreateClient;
